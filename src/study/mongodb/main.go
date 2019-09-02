package main

import (
	"fmt"
	"log"

	"ni/mongodb"

	"go.mongodb.org/mongo-driver/bson"
)

type Post struct {
	Title    string   `bson:"title"`
	Body     string   `bson:"body"`
	Tags     []string `bson:"tags"`
	Comments uint64   `bson:"comments"`
}

func main() {
	// Initialising and connecting
	// ========================================================================================

	// create a new timeout context
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	// // create a mongo client
	// client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:29817/"))
	// if err != nil {
	// 	fmt.Println(err.Error())
	// }

	// // disconnect from mongo
	// defer client.Disconnect(ctx)

	// select collection from database
	col, ctx, cancel := mongodb.Collection("posts")
	defer cancel()
	fmt.Println("insert start")
	// InsertOne
	// ========================================================================================
	// var p = Post{
	// 	Title: "Go mongodb driver cookbook",
	// 	Tags:  []string{"golang", "mongodb"},
	// 	Body: `this is a long post
	// 	that goes on and on
	// 	and have many lines`,
	// 	Comments: 1,
	// }
	// {
	// _, err := col.InsertOne(ctx, p)
	// if err != nil {
	// 	fmt.Println(err.Error())
	// }
	// fmt.Printf("inserted id: %s\n", res.InsertedID.(primitive.ObjectID).Hex())
	// => inserted id: 5c71caf32a346553363177ce
	// }

	// {
	// filter posts tagged as golang
	filter := bson.M{}

	// find all documents
	cursor, err := col.Find(ctx, filter)
	if err != nil {
		log.Fatal(err)
	}
	// iterate through all documents
	for cursor.Next(ctx) {
		var p Post
		// decode the document
		if err := cursor.Decode(&p); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("post: %+v\n", p)
	}

	// check if the cursor encountered any errors while iterating
	// if err := cursor.Err(); err != nil {
	// log.Fatal(err)
	// }
	// }

	fmt.Println("insert end")
}
