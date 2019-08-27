package score

import (
	"ni/websocket"
)

type scoreDB struct {
	UID     int    `bson:"uid" json:"uid"`
	History string `bson:"history" json:"history"`
	Phase   string `bson:"phase" json:"phase"`
	Time    string `bson:"time" json:"time"`
}

func init() {
	// regist ws(s) handlers
	port()
}

func readScore(message *websocket.ClientMessage, client *websocket.Client) error {
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

func addScore(message *websocket.ClientMessage, client *websocket.Client) error {
	return nil
}

func readRank(message *websocket.ClientMessage, client *websocket.Client) error {
	return nil
}
