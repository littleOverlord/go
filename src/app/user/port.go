package user

import (
	"encoding/json"
	"fmt"

	"ni/websocket"
)

type loginMessage struct {
	Username string `json:"name,omitempty"`
	Gamename string `json:"gamename,omitempty"`
	Password string `json:"psw,omitempty"`
	From     string `json:"from,omitempty"`
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
	var arg = loginMessage{
		Username: "",
		Gamename: "",
		Password: "",
		From:     "",
	}
	var err error

	defer func() {
		if err != nil {
			client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
		}
	}()
	err = json.Unmarshal(message.ArgB, &arg)
	if err != nil {
		return err
	}
	uinfo, err := registUser(arg, client)
	if err != nil {
		return err
	}
	client.SendMessage(message, fmt.Sprintf(`{"ok": %s}`, uinfo))
	return nil
}

func login(message *websocket.ClientMessage, client *websocket.Client) error {
	var arg = loginMessage{
		Username: "",
		Gamename: "",
		Password: "",
		From:     "",
	}
	var err error
	defer func() {
		if err != nil {
			client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
		}
	}()
	err = json.Unmarshal(message.ArgB, &arg)
	if err != nil {
		return err
	}
	uinfo, err := loginUser(arg, client)
	if err != nil {
		return err
	}
	client.SendMessage(message, fmt.Sprintf(`{"ok": %s}`, uinfo))
	return nil
}
