package wx

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"ni/logger"
	"ni/mongodb"
	"ni/websocket"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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
	UID      int    `bson:"uid",json:"uid"`
	Username string `bson:"username",json:"username"`
	From     string `bson:"from",json:"from"`
	Name     string `bson:"name",json:"name"`
	Head     string `bson:"head",json:"head"`
}

func port() {
	websocket.RegistHandler("app/wx@login", login)
}

func login(message *websocket.ClientMessage, client *websocket.Client) error {
	var data *loginMessage
	err := json.Unmarshal([]byte(message.Data), &data)
	defer func() {
		client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
	}()
	if err != nil {
		return err
	}
	userInfo, err := code2Session(data.code, data.gamename)
	if err != nil {
		return err
	}

	return nil
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

func findUserByName(info *sessionResult, client *websocket.Client) error {
	col, ctx, cancel := mongodb.Collection("user")
	defer cancel()
	filter := bson.M{"username": info.openid}
	var res userDB
	cursor := col.FindOne(ctx, filter)
	if err := cursor.Decode(&res); err != nil {
		if err == mongo.ErrNoDocuments {
			uid := temp.
			_, err := col.InsertOne(ctx, bson.M{"uid": client.SendMessage, "value": 10000})
			if err != nil {
				return err
			}
			websocket.AddClientToCache()
		} else {
			return err
		}
	}
}
