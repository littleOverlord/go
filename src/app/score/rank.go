package score

import (
	"ni/mongodb"
	"ni/websocket"

	"go.mongodb.org/mongo-driver/bson"
)

type rankItem struct {
	UID   int `bson:"uid" json:"uid"`
	Score int `bson:"score" json:"score"`
}

type rankDB struct {
	Game string     `bson:"game" json:"game"`
	From string     `bson:"from" json:"from"`
	List []rankItem `bson:"list" json:"list"`
}

var (
	rankCacl = make(map[string]*chan int)
	ranks    = make(map[string]rankDB)
)

func initRank() error {
	var (
		err error
	)
	defer func() {
		if err != nil {
			panic("init rank error : " + err.Error())
		}
	}()
	col, ctx, cancel := mongodb.Collection("rank")
	defer cancel()

	filter := bson.M{}
	cursor, err := col.Find(ctx, filter)
	for cursor.Next(ctx) {
		var res rankDB
		if err = cursor.Decode(&res); err != nil {
			return err
		}
	}
	return nil
}

func readRank(message *websocket.ClientMessage, client *websocket.Client) error {
	return nil
}
