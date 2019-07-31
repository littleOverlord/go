package wx

import (
	"app/temp"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"ni/config"
	"ni/logger"
	"ni/mongodb"
	"ni/websocket"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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
	cfg := config.Table["app/main/config.json"].(map[string]interface{})["wx"].(map[string]interface{})
	for k, v := range cfg {
		wxCfg[k] = &wxProject{appID: v.(map[string]interface{})["appID"].(string), appSecret: v.(map[string]interface{})["appSecret"].(string)}
	}
}

// 从微信服务器获取session
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
	fmt.Println(string(body))
	return data, nil
}

// 获取微信用户在服务器的用户数据
// 没有则注册
func findUserByName(gamename string, info interface{}, client *websocket.Client) (string, error) {
	col, ctx, cancel := mongodb.Collection(gamename + "_user")
	username, ok := info.(map[string]string)["openid"]
	if !ok {
		return "", errors.New("arg error")
	}
	name, ok := info.(map[string]string)["nickname"]
	if !ok {
		return "", errors.New("arg error")
	}
	head, ok := info.(map[string]string)["avatarUrl"]
	if !ok {
		return "", errors.New("arg error")
	}
	from := "wx"
	defer cancel()
	filter := bson.M{"username": info.(map[string]string)["openid"]}
	var (
		res userDB
		msg string
	)
	cursor := col.FindOne(ctx, filter)
	if err := cursor.Decode(&res); err != nil {
		if err == mongo.ErrNoDocuments {
			uid, err := temp.GetUID()
			if err != nil {
				return "", err
			}
			_, err = col.InsertOne(ctx, bson.M{"uid": uid, "username": username, "name": name, "from": from, "head": head})
			if err != nil {
				return "", err
			}
			go websocket.AddClientToCache(uid, client)
			msg = fmt.Sprintf(`{"ok":{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s"}`, uid, username, name, from, head)
		} else {
			return "", err
		}
	} else {
		go websocket.AddClientToCache(res.UID, client)
		msg = fmt.Sprintf(`{"ok":{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s"}`, res.UID, res.Username, res.Name, res.From, res.Head)
	}
	return msg, nil
}
