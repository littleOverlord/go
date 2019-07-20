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
	return nil
}

func addScore(message *websocket.ClientMessage, client *websocket.Client) error {
	return nil
}

func readRank(message *websocket.ClientMessage, client *websocket.Client) error {
	return nil
}
