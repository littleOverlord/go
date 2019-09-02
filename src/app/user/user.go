package user

import (
	"app/temp"
	"errors"
	"fmt"
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
			// fmt.Println(uid)
			if err != nil {
				return "", err
			}
			_, err = col.InsertOne(ctx, bson.M{"uid": uid, "username": username, "name": "", "from": from, "head": "", "password": password})
			if err != nil {
				return "", err
			}
			go websocket.AddClientToCache(uid, "", "", from, gamename, client)
			msg = fmt.Sprintf(`{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s"}`, uid, username, "", from, "")
			return msg, nil
		}
		return "", err
	}
	return "", errors.New("regist error")
}

// 用户登录
func loginUser(info loginMessage, client *websocket.Client) (string, error) {
	username := info.Username
	gamename := info.Gamename
	password := info.Password
	if username == "" || gamename == "" || password == "" {
		return "", errors.New("arg error")
	}
	col, ctx, cancel := mongodb.Collection(gamename + "_user")
	defer cancel()
	filter := bson.M{"username": username}
	var (
		res userDB
		msg string
	)
	cursor := col.FindOne(ctx, filter)
	if err := cursor.Decode(&res); err != nil {
		return "", err
	} else if res.Password != password {
		return "", errors.New("login error")
	}
	websocket.AddClientToCache(res.UID, res.Name, res.Head, res.From, gamename, client)
	msg = fmt.Sprintf(`{"uid": %d, "username": "%s", "name": "%s", "from": "%s", "head": "%s"}`, res.UID, res.Username, res.Name, res.From, res.Head)
	return msg, nil
}
