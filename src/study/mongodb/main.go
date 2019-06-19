package main

import (
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"ni/mongodb"
)

type Post struct {
	ID        primitive.ObjectID `bson:"_id"`
	Title     string             `bson:"title"`
	Body      string             `bson:"body"`
	Tags      []string           `bson:"tags"`
	Comments  uint64             `bson:"comments"`
	CreatedAt time.Time          `bson:"created_at"`
	UpdatedAt *time.Time         `bson:"updated_at"`
}

func main() {
	// Initialising and connecting
	// ========================================================================================

	// create a new timeout context
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	// // create a mongo client
	// client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017/"))
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

	// {
	// 	res, err := col.InsertOne(ctx, bson.M{
	// 		"title": "Go mongodb driver cookbook",
	// 		"tags":  []string{"golang", "mongodb"},
	// 		"body": `this is a long post
	// that goes on and on
	// and have many lines`,
	// 		"comments":   1,
	// 		"created_at": time.Now(),
	// 	})
	// 	if err != nil {
	// 		fmt.Println(err.Error())
	// 	}
	// 	fmt.Printf("inserted id: %s\n", res.InsertedID.(primitive.ObjectID).Hex())
	// 	// => inserted id: 5c71caf32a346553363177ce
	// }

	{
		// filter posts tagged as golang
		filter := bson.M{"tags": bson.M{"$elemMatch": bson.M{"$eq": "erlang"}}}

		// find all documents
		cursor := col.FindOne(ctx, filter)

		// iterate through all documents
		// for cursor.Next(ctx) {
		var p Post
		// decode the document
		if err := cursor.Decode(&p); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("post: %+v\n", p)
		// }

		// check if the cursor encountered any errors while iterating
		// if err := cursor.Err(); err != nil {
		// log.Fatal(err)
		// }
	}

	fmt.Println("insert end")
}
