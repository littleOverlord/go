package client

import (
	"fmt"
	"ni/logger"
	"ni/mongodb"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	mux     sync.Mutex
	lastUID UID
	wCh     = make(chan int, 100)
)

// UID is a single db
type UID struct {
	ID    primitive.ObjectID `bson:"_id"`
	Key   string             `bson:"key"`
	Value int                `bson:"value"`
}

func init() {
	initUID()
	// regist ws(s) handlers
	port()
	go watchWrite()
}

func initUID() {
	mux.Lock()
	col, ctx, cancel := mongodb.Collection("client")
	defer func() {
		cancel()
		if p := recover(); p != nil {
			fmt.Println(p)
			logger.Error(p.(string))
		}
	}()
	// filter posts tagged as golang
	filter := bson.M{"key": "uid"}

	cursor := col.FindOne(ctx, filter)
	if err := cursor.Decode(&lastUID); err != nil {
		if err == mongo.ErrNoDocuments {
			_, err := col.InsertOne(ctx, bson.M{"key": "uid", "value": 10000})
			if err != nil {
				panic(err.Error())
			}
		} else {
			panic(err.Error())
		}
	}
	mux.Unlock()
}

//GetUID is the way to get new user id
func GetUID() (int, error) {
	var v int
	mux.Lock()
	v = lastUID.Value
	lastUID.Value++
	wCh <- lastUID.Value
	mux.Unlock()
	return v, nil
}

func writeUID(v int) error {
	fmt.Printf(`writeUID :: %d`, v)
	col, ctx, cancel := mongodb.Collection("client")
	defer cancel()
	filter := bson.M{"_id": lastUID.ID}
	update := bson.M{"$set": bson.M{"value": v}}

	// update document
	_, err := col.UpdateOne(ctx, filter, update)
	return err
}

func watchWrite() {
	for v := range wCh {
		n := len(wCh)
		if n == 0 {
			err := writeUID(v)
			if err != nil {
				logger.Error(err.Error())
			}
		}
	}
}
