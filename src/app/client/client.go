package client

import (
	"fmt"
	"ni/mongodb"

	"go.mongodb.org/mongo-driver/bson"
)

var uid int

func init() {
	initUid()
	// regist ws(s) handlers
	port()
}

func initUid() {
	col, ctx, cancel := mongodb.Collection("client")
	filter := bson.M{}
	defer cal()
	// filter posts tagged as golang
	filter := bson.M{key:"uid"}
	{$set:{key:"uid"}, $inc : { "value" : 1 }}
	cursor := col.FindOneAndUpdate(ctx, filter)

	// iterate through all documents
	// for cursor.Next(ctx) {
	var p Post
	// decode the document
	if err := cursor.Decode(&p); err != nil {
		fmt.Println(err.Error())
	}
	fmt.Printf("post: %+v\n", p)

}
