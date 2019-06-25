package client

import (
	"fmt"
	"ni/logger"
	"ni/mongodb"
	"sync"

	"go.mongodb.org/mongo-driver/mongo/options"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var mux sync.Mutex

type Uid struct {
	_id   string
	key   string
	value int
}

func init() {
	initUID()
	// regist ws(s) handlers
	port()
}

func initUID() {
	col, ctx, cancel := mongodb.Collection("client")
	uid := &Uid{
		key:   "uid",
		value: 0,
	}
	defer func() {
		cancel()
		if p := recover(); p != nil {
			fmt.Println(p)
			logger.Error(p.(string))
		}
	}()
	// filter posts tagged as golang
	filter := bson.M{"key": "uid"}

	// cursor := col.FindOne(ctx, filter)
	// iterate through all documents
	// for cursor.Next(ctx) {
	// decode the document
	// if err := cursor.Decode(uid); err != nil {
	// 	panic(err.Error())
	// }
	// fmt.Println(uid)
	// if uid.value == 0 {
	// 	_, err := col.InsertOne(ctx, bson.M{"key": "uid", "value": 10000})
	// 	if err != nil {
	// 		panic(err.Error())
	// 	}
	// }
	opts := options.FindOneAndUpdate()
	opts.SetReturnDocument(options.After)
	opts.SetUpsert(true)
	cursor := col.FindOneAndUpdate(ctx, filter, bson.M{"$set": bson.M{"key": "uid", "value": 10000}}, opts)
	if err := cursor.Decode(uid); err != nil {
		panic(err.Error())
	}
}

//GetUID is the way to get new user id
func GetUID() (int, error) {
	var (
		uid *Uid
		err error
	)
	col, ctx, cancel := mongodb.Collection("client")
	defer cancel()
	cursor := col.FindOne(ctx, bson.M{"key": "uid"})
	if err = cursor.Decode(uid); err != nil {
		return 0, err
	}

	id, err := primitive.ObjectIDFromHex(uid._id)
	if err != nil {
		return 0, err
	}

	// set filters and updates
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"value": uid.value + 1}}

	// update document
	_, err = col.UpdateOne(ctx, filter, update)
	if err != nil {
		return 0, err
	}
	return uid.value, nil
}
