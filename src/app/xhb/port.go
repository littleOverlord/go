package xhb

import (
	"encoding/json"
	"errors"
	"fmt"

	"mgame-go/ni/websocket"
)

type userInfo struct {
	OpenID   string //这里返回的open_id是最长64位的字符创
	Avatar   string //始终是http格式
	Nickname string
	Gender   int // 0 女, 1男
}

type sessionResult struct {
	Code    int    // 0=成功=0  非0=失败
	Message string // 错误描述
	Data    userInfo
}

type loginMessage struct {
	GameKey     string `json:"game_key,omitemoty"`
	Timestamp   string `json:"timestamp,omitemoty"`
	Nonce       string `json:"nonce,omitemoty"`
	LoginType   string `json:"login_type,omitemoty"`
	LoginTicket string `json:"login_ticket,omitemoty"`
	Signature   string `json:"signature,omitemoty"`
	Gamename    string `json:"gamename,omitemoty"`
}

type userDB struct {
	UID      int    `bson:"uid" json:"uid"`
	Username string `bson:"username" json:"username"`
	From     string `bson:"from" json:"from"`
	Name     string `bson:"name" json:"name"`
	Head     string `bson:"head" json:"head"`
	Password string `bson:"password" json:"password"`
}

func port() {
	websocket.RegistHandler("app/xhb@login", login)
}

func login(message *websocket.ClientMessage, client *websocket.Client) error {
	var arg = loginMessage{
		GameKey:     "",
		Timestamp:   "",
		Nonce:       "",
		LoginType:   "",
		LoginTicket: "",
		Signature:   "",
		Gamename:    "",
	}
	var err error
	defer func() {
		if err != nil {
			client.SendMessage(message, fmt.Sprintf(`{"err":{"reson":"%s"}}`, err.Error()))
		}
	}()
	err = json.Unmarshal(message.ArgB, &arg)
	if err != nil {
		return err
	}
	if arg.GameKey == "" || arg.Timestamp == "" || arg.Nonce == "" || arg.LoginType == "" || arg.LoginTicket == "" || arg.Signature == "" {
		return errors.New("arg error")
	}
	if err != nil {
		return err
	}
	sr, err := getUserInfo(&arg)
	if err != nil {
		return err
	}
	if sr.code != 0 {
		return fmt.Errorf("from wx error code: %d, error message: %s", sr.Errcode, sr.Errmsg)
	}
	uinfo, err := findUserByName(arg.Gamename, sr, client)
	if err != nil {
		return err
	}
	client.SendMessage(message, fmt.Sprintf(`{"ok": %s}`, uinfo))
	return nil
}
