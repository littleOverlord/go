package bd

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"mgame-go/app/temp"
	"mgame-go/ni/config"
	"mgame-go/ni/db"
	"mgame-go/ni/logger"
	"mgame-go/ni/websocket"
	"net/http"
	"strconv"
	"strings"

	badger "github.com/dgraph-io/badger/v2"
)

var wxCfg = make(map[string]*wxProject)

type wxProject struct {
	appID     string
	appSecret string
}

func init() {
	initCfg()
	// regist ws(s) handlers
	port()
}

func initCfg() {
	cfg := config.Table["app/main/config.json"].(map[string]interface{})["bd"].(map[string]interface{})
	for k, v := range cfg {
		wxCfg[k] = &wxProject{appID: v.(map[string]interface{})["appID"].(string), appSecret: v.(map[string]interface{})["appSecret"].(string)}
	}
}

// 从微信服务器获取session
func code2Session(code string, gameName string) (data *sessionResult, err error) {
	resp, err := http.Post(`https://spapi.baidu.com/oauth/jscode2sessionkey`, "application/x-www-form-urlencoded",
		strings.NewReader(fmt.Sprintf(`code=%s&client_id=%s&sk=%s`, code, wxCfg[gameName].appID, wxCfg[gameName].appSecret)))
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
	err = json.Unmarshal(body, &data)
	if err != nil {
		logger.Error(err.Error())
		return nil, err
	}
	return data, nil
}

// 获取微信用户在服务器的用户数据
// 没有则注册
func findUserByName(gamename string, info interface{}, client *websocket.Client) (string, error) {

	username, ok := info.(map[string]interface{})["openId"].(string)
	if !ok {
		return "", errors.New("arg error")
	}
	name, ok := info.(map[string]interface{})["nickName"].(string)
	if !ok {
		return "", errors.New("arg error")
	}
	head, ok := info.(map[string]interface{})["avatarUrl"].(string)
	if !ok {
		return "", errors.New("arg error")
	}
	from := "wx"
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
	// uid = strconv.Itoa(_uid)
	err = inserNewUser(col, _uid, username, name, from, head, username)
	// fmt.Println(uid)
	if err != nil {
		return "", err
	}
	go websocket.AddClientToCache(_uid, name, head, from, gamename, client)
	msg = fmt.Sprintf(`{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s","regist":1}`, _uid, username, name, from, head)
	return msg, nil
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
