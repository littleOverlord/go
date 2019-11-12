package user

import (
	"errors"
	"fmt"
	"mgame-go/app/temp"
	"mgame-go/ni/db"
	"mgame-go/ni/websocket"
	"strconv"

	badger "github.com/dgraph-io/badger/v2"
)

var wxCfg = make(map[string]*wxProject)

type wxProject struct {
	appID     string
	appSecret string
}

func init() {
	// regist ws(s) handlers
	port()
}

// 用户注册
func registUser(info loginMessage, client *websocket.Client) (string, error) {
	username := info.Username
	gamename := info.Gamename
	password := info.Password
	from := info.From
	if username == "" || gamename == "" || password == "" || from == "" {
		return "", errors.New("arg error")
	}
	col, err := db.Collection(gamename + "_user")
	if err != nil {
		return "", err
	}
	err = col.View(func(txn *badger.Txn) error {
		// Your code here…
		_, err := txn.Get([]byte(username))
		return err
	})
	if err != badger.ErrKeyNotFound {
		if err == nil {
			err = errors.New("the user has existed")
		}
		return "", err
	}
	var (
		msg string
	)
	uid, err := temp.GetUID()
	if err != nil {
		return "", err
	}
	err = inserNewUser(col, uid, username, "", from, "", password)
	// fmt.Println(uid)
	if err != nil {
		return "", err
	}
	go websocket.AddClientToCache(uid, "", "", from, gamename, client)
	msg = fmt.Sprintf(`{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s"}`, uid, username, "", from, "")
	return msg, nil
}

// 用户登录
func loginUser(info loginMessage, client *websocket.Client) (string, error) {
	var (
		msg  string
		uid  string
		name string
		from string
		head string
	)

	username := info.Username
	gamename := info.Gamename
	password := info.Password
	if username == "" || gamename == "" || password == "" {
		return "", errors.New("arg error")
	}
	col, err := db.Collection(gamename + "_user")
	if err != nil {
		return "", err
	}
	err = col.View(func(txn *badger.Txn) error {
		var (
			err error
			ps  string
		)
		uid, err = db.ReadItemValue(txn, username)
		if err != nil {
			return err
		}

		ps, err = db.ReadItemValue(txn, uid+"password")
		if err != nil {
			return err
		}
		if ps != password {
			return errors.New("login error")
		}

		from, err = db.ReadItemValue(txn, uid+"from")
		if err != nil {
			return err
		}

		name, err = db.ReadItemValue(txn, uid+"name")
		if err != nil {
			return err
		}

		head, err = db.ReadItemValue(txn, uid+"head")

		return err
	})

	if err != nil {
		return "", err
	}
	_uid, err := strconv.Atoi(uid)
	if err != nil {
		return "", err
	}
	websocket.AddClientToCache(_uid, name, head, from, gamename, client)
	msg = fmt.Sprintf(`{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s"}`, _uid, username, name, from, head)
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
