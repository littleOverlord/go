package wx

import (
	"encoding/json"
	"errors"
	"fmt"

	"ni/websocket"
)

type sessionResult struct {
	openid     string //用户唯一标识
	sessionKey string //会话密钥
	unionid    string //用户在开放平台的唯一标识符，在满足 UnionID 下发条件的情况下会返回，详见 UnionID 机制说明。
	errcode    int    //错误码
	errmsg     string
}

type loginMessage struct {
	Code      string `json:"code,omitempty"`
	Encrypted string `json:"encrypted,omitempty"`
	Gamename  string `json:"gamename,omitempty"`
	Iv        string `json:"iv,omitempty"`
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
	websocket.RegistHandler("app/wx@login", login)
}

func login(message *websocket.ClientMessage, client *websocket.Client) error {
	var arg = loginMessage{
		Code:      "",
		Encrypted: "",
		Gamename:  "",
		Iv:        "",
	}
	var err error
	defer func() {
		client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
	}()
	err = json.Unmarshal(message.ArgB, &arg)
	if err != nil {
		return err
	}
	code := arg.Code
	gamename := arg.Gamename
	encrypted := arg.Encrypted
	iv := arg.Iv
	if code == "" || gamename == "" || encrypted == "" || iv == "" {
		return errors.New("arg error")
	}
	if err != nil {
		return err
	}
	sr, err := code2Session(code, gamename)
	if err != nil {
		return err
	}
	wxdc := &WxBizDataCrypt{
		AppID:      wxCfg[gamename].appID,
		SessionKey: sr.sessionKey,
	}

	wxinfo, err := wxdc.Decrypt(encrypted, iv, false)
	fmt.Println(wxinfo)
	if err != nil {
		fmt.Println(err)
		return err
	}
	uinfo, err := findUserByName(gamename, wxinfo, client)
	if err != nil {
		return err
	}
	client.SendMessage(message, fmt.Sprintf(`{"ok": %s}`, uinfo))
	return nil
}
