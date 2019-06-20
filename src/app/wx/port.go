package wx

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"ni/logger"
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

func port() {
	websocket.RegistHandler("app/wx@login", login)
}

func login(message *websocket.ClientMessage, client *websocket.Client) {
	var data *loginMessage
	err := json.Unmarshal([]byte(message.Data), &data)
	defer func(){
		client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
	}
	if err != nil {
		return
	}
	userInfo, err := code2Session(data.code, data.gamename)
	if err != nil {
		return
	}
}

func code2Session(code string, gameName string) (data *sessionResult, err error) {
	resp, err := http.Get(fmt.Sprintf(`https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code`, wxCfg[gameName].appID, wxCfg[gameName].appSecret, code))
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
	fmt.Println(body)
	return data, nil
}
