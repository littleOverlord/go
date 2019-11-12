package xhb

import (
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"mgame-go/app/temp"
	"mgame-go/ni/config"
	"mgame-go/ni/db"
	"mgame-go/ni/logger"
	"mgame-go/ni/websocket"
	"net/http"
	"strconv"

	badger "github.com/dgraph-io/badger/v2"
)

var xhbCfg = make(map[string]*xhbCI)

type xhbCI struct {
	ID     string `json:"id"`
	Key    string `json:"key"`
	Secret string `json:"secret"`
}

func init() {
	initCfg()
	// regist ws(s) handlers
	port()
}

func initCfg() {
	cfg := config.Table["app/main/config.json"].(map[string]interface{})["xiaohuoban"].(map[string]interface{})
	for k, v := range cfg {
		fmt.Println(k)
		xhbCfg[k] = &xhbCI{ID: v.(map[string]interface{})["id"].(string), Key: v.(map[string]interface{})["key"].(string), Secret: v.(map[string]interface{})["secret"].(string)}
	}
	fmt.Println(xhbCfg)
}

// 从小伙伴服务器获取用户信息
func getUserInfo(arg *loginMessage) (data *userResult, err error) {

	fmt.Println(arg.Gamename)
	sign, err := signSha1(arg, xhbCfg[arg.Gamename].Secret)
	url := fmt.Sprintf(`https://gc.hgame.com/user/getticketuserinfo?game_key=%s&timestamp=%s&nonce=%s&login_type=%s&login_ticket=%s&signature=%s`, arg.GameKey, arg.Timestamp, arg.Nonce, arg.LoginType, arg.Ticket, sign)
	fmt.Println(url)
	resp, err := http.Get(url)
	if err != nil {
		// handle error
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		logger.Error(err.Error())
		return nil, err
	}
	fmt.Println("json parse start")
	err = json.Unmarshal(body, &data)
	fmt.Println("json parse end")
	if err != nil {
		logger.Error(err.Error())
		return nil, err
	}
	return data, nil
}

// 获取小伙伴用户在服务器的用户数据
// 没有则注册
func findUserByName(gamename string, info *userResult, client *websocket.Client) (string, error) {
	fmt.Println(info)
	username := info.Data.OpenID
	if username == "" {
		username = "xiaohuobantest"
	}
	name := info.Data.Nickname
	head := info.Data.Avatar
	from := "xiaohuoban"

	var (
		uid string
		msg string
	)

	col, err := db.Collection(gamename + "_user")
	if err != nil {
		return "", err
	}
	err = col.View(func(txn *badger.Txn) error {
		// Your code here…
		item, err := txn.Get([]byte(username))
		if err != nil {
			return err
		}
		_cu, err := item.ValueCopy(nil)
		if err != nil {
			return err
		}
		uid = string(_cu)
		return nil
	})
	if err != badger.ErrKeyNotFound {
		if err == nil {
			_uid, err := strconv.Atoi(uid)
			if err != nil {
				return "", err
			}
			go websocket.AddClientToCache(_uid, name, head, from, gamename, client)
			msg = fmt.Sprintf(`{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s","regist":0}`, _uid, username, name, from, head)
		}
		return msg, err
	}
	_uid, err := temp.GetUID()
	if err != nil {
		return "", err
	}
	// uid = strconv.Atoa(_uid)
	err = inserNewUser(col, _uid, username, name, from, head, username)
	// fmt.Println(uid)
	if err != nil {
		return "", err
	}
	go websocket.AddClientToCache(_uid, name, head, from, gamename, client)
	msg = fmt.Sprintf(`{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s","regist":1}`, _uid, username, name, from, head)
	return msg, nil
}

func signSha1(info *loginMessage, secret string) (sign string, err error) {
	// u, err := url.PathUnescape(info.Gameurl)
	// fmt.Println(u)
	// if err != nil {
	// 	return "", err
	// }

	str := fmt.Sprintf(`game_key=%s&login_ticket=%s&login_type=%s&nonce=%s&timestamp=%s%s`, info.GameKey, info.Ticket, info.LoginType, info.Nonce, info.Timestamp, secret)
	h := sha1.New()
	h.Write([]byte(str))
	sign = fmt.Sprintf("%x", h.Sum(nil))
	fmt.Println(sign)
	return sign, nil
}

func inserNewUser(col *badger.DB, uid int, username string, name string, from string, head string, password string) error {
	txn := col.NewTransaction(true)
	defer txn.Discard()
	err := db.InsertMany(txn, []string{
		strconv.Itoa(uid), username,
		username, strconv.Itoa(uid),
		strconv.Itoa(uid) + "from", from,
		strconv.Itoa(uid) + "name", name,
		strconv.Itoa(uid) + "password", password,
		strconv.Itoa(uid) + "head", head,
	})
	if err != nil {
		return err
	}
	// Commit the transaction.
	return txn.Commit()
}
