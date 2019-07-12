package user

import (
	"fmt"

	"ni/websocket"
)

type loginMessage struct {
	userName string
	gamename string
	password string
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
	websocket.RegistHandler("app/user@regist", regist)
	websocket.RegistHandler("app/user@login", login)
}

func regist(message *websocket.ClientMessage, client *websocket.Client) error {
	// var data *loginMessage
	var err error
	defer func() {
		client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
	}()
	uinfo, err := registUser(message.Arg, client)
	if err != nil {
		return err
	}
	client.SendMessage(message, fmt.Sprintf(`{"ok": %s}`, uinfo))
	return nil
}

func login(message *websocket.ClientMessage, client *websocket.Client) error {
	var err error
	defer func() {
		client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
	}()
	if err != nil {
		return err
	}
	uinfo, err := loginUser(message.Arg, client)
	if err != nil {
		return err
	}
	client.SendMessage(message, fmt.Sprintf(`{"ok": %s}`, uinfo))
	return nil
}
