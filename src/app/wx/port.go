package wx

import (
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
	code      string
	encrypted string
	gamename  string
	iv        string
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
	var err error
	code := message.Arg.(map[string]interface{})["code"].(string)
	gamename := message.Arg.(map[string]interface{})["gamename"].(string)
	encrypted := message.Arg.(map[string]interface{})["encrypted"].(string)
	iv := message.Arg.(map[string]interface{})["iv"].(string)
	defer func() {
		client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
	}()
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
	if err != nil {
		return err
	}
	uinfo, err := findUserByName(gamename, wxinfo, client)
	if err != nil {
		return err
	}
	client.SendMessage(message, fmt.Sprintf(`{"ok": %s}`, uinfo))
	return nil
}
