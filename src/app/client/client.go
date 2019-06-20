package client

import (
	"fmt"
	"ni/mongodb"
	"sync"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var uid = &struct {
	key   string
	value int
}{
	key:   "uid",
	value: 0,
}
var mux sync.Mutex

func init() {
	initUid()
	// regist ws(s) handlers
	port()
}

func initUid() {
	col, ctx, cancel := mongodb.Collection("client")
	defer cancel()
	// filter posts tagged as golang
	filter := bson.M{"key": "uid"}
	opts := options.FindOneAndUpdate()
	opts.SetUpsert(true)
	opts.SetReturnDocument(options.After)

	cursor := col.FindOneAndUpdate(ctx, filter, bson.M{"$set": bson.M{"key": "uid"}, "$inc": bson.M{"value": 1}}, opts)

	// iterate through all documents
	// for cursor.Next(ctx) {
	// decode the document
	if err := cursor.Decode(uid); err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println(uid)
}
