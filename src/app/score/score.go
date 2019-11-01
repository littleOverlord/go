package score

import (
	"encoding/json"
	"fmt"
	"mgame-go/ni/mongodb"
	"mgame-go/ni/util"
	"mgame-go/ni/websocket"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// the db type is saving one user score data
type scoreDB struct {
	UID     int    `bson:"uid" json:"uid"`
	History int    `bson:"history" json:"history"`
	Phase   int    `bson:"phase" json:"phase"`
	Time    int64  `bson:"time" json:"time"`
	From    string `bson:"from" json:"from"`
}

// the message type from client by "app/score@add" interface
type addMessage struct {
	Score int `json:"score"`
}

func init() {
	// regist ws(s) handlers
	initRank()
	go rankChan.cacl()
	port()
}

// read self score db data
func readScore(message *websocket.ClientMessage, client *websocket.Client) error {
	var (
		err   error
		res   scoreDB
		phase int
	)
	defer func() {
		if err != nil {
			client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
		}
	}()
	col, ctx, cancel := mongodb.Collection(client.Game + "_score")
	defer cancel()

	filter := bson.M{"uid": client.UID}
	cursor := col.FindOne(ctx, filter)
	if err := cursor.Decode(&res); err != nil {
		if err != mongo.ErrNoDocuments {
			return err
		}
	}
	if res.Time > 0 && util.MondayStamp() < res.Time {
		phase = res.Phase
	}
	client.SendMessage(message, fmt.Sprintf(`{"ok": {"history": %d, "phase": %d}}`, res.History, phase))
	return nil
}

// add || update self score db data
func addScore(message *websocket.ClientMessage, client *websocket.Client) error {
	var (
		err error
		res scoreDB
		arg addMessage
		t   int64
	)
	defer func() {
		if err != nil {
			client.SendMessage(message, fmt.Sprintf(`{"err":{"reson":"%s"}}`, err.Error()))
		}
	}()
	err = json.Unmarshal(message.ArgB, &arg)
	if err != nil {
		return err
	}
	col, ctx, cancel := mongodb.Collection(client.Game + "_score")
	defer cancel()

	filter := bson.M{"uid": client.UID}
	cursor := col.FindOne(ctx, filter)
	t = time.Now().UnixNano() / 1000000
	if err := cursor.Decode(&res); err != nil {
		if err == mongo.ErrNoDocuments {
			_, err = col.InsertOne(ctx, bson.M{"uid": client.UID, "history": arg.Score, "phase": arg.Score, "time": t, "from": client.From})
			if err != nil {
				return err
			}
		} else {
			return err
		}
	}
	if res.Time > 0 {
		if arg.Score > res.History {
			res.History = arg.Score
		}
		if arg.Score > res.Phase || util.MondayStamp() > res.Time {
			res.Phase = arg.Score
		}
		_, err = col.UpdateOne(ctx, filter, bson.M{"$set": bson.M{"history": res.History, "phase": res.Phase, "time": t}})
		if err != nil {
			return err
		}
	}
	client.SendMessage(message, `{"ok": "ok"}`)
	rankChan.add <- &addArg{
		ri: rankItem{
			UID:   client.UID,
			Score: arg.Score,
			Name:  client.Name,
			Head:  client.Head,
		},
		client: client,
	}
	return nil
}
