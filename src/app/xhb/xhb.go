package xhb

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"mgame-go/app/temp"
	"mgame-go/ni/logger"
	"mgame-go/ni/mongodb"
	"mgame-go/ni/websocket"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type wxProject struct {
	appID     string
	appSecret string
}

func init() {
	// regist ws(s) handlers
	port()
}

// 从小伙伴服务器获取用户信息
func getUserInfo(arg *loginMessage) (data *sessionResult, err error) {
	resp, err := http.Get(fmt.Sprintf(`https://gc.hgame.com/user/getticketuserinfo?game_key=%s&timestamp=%s&nonce=%s&login_type=%s&login_ticket=%s&signature=%s`, arg.GameKey, arg.Timestamp, arg.Nonce, arg.LoginType, arg.LoginTicket, arg.Signature))
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

// 获取小伙伴用户在服务器的用户数据
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
	col, ctx, cancel := mongodb.Collection(gamename + "_user")
	defer cancel()
	filter := bson.M{"username": username}
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
			go websocket.AddClientToCache(uid, name, head, from, gamename, client)
			msg = fmt.Sprintf(`{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s"}`, uid, username, name, from, head)
		} else {
			return "", err
		}
	} else {
		go websocket.AddClientToCache(res.UID, name, head, from, gamename, client)
		msg = fmt.Sprintf(`{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s"}`, res.UID, res.Username, res.Name, res.From, res.Head)
	}
	return msg, nil
}
