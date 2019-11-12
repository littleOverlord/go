// Copyright 2019 tdd authors
package db

import (
	"fmt"
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func TestInsert(t *testing.T) {
	for i := 2; i < 20; i++ {
		go insert(i)
	}
}

func TestFind(t *testing.T) {
	col, ctx, cal := Collection("posts")
	defer cal()
	// filter posts tagged as golang
	filter := bson.M{}

	// find all documents
	cursor, err := col.Find(ctx, filter)
	if err != nil {
		t.Error(err.Error())
	}

	// iterate through all documents
	for cursor.Next(ctx) {
		var p Post
		// decode the document
		if err := cursor.Decode(&p); err != nil {
			t.Error(err.Error())
		}
		fmt.Printf("post: %+v\n", p)
	}

	// check if the cursor encountered any errors while iterating
	if err := cursor.Err(); err != nil {
		t.Error(err.Error())
	}
}

func insert(i int) {
	col, ctx, cal := Collection("posts")
	defer cal()
	res, err := col.InsertOne(ctx, bson.M{
		"title": "Go mongodb driver cookbook",
		"tags":  []string{"golang", "mongodb"},
		"body": `this is a long post
that goes on and on
and have many lines`,
		"comments":   i,
		"created_at": time.Now(),
	})
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Printf("inserted id: %s\n", res.InsertedID.(primitive.ObjectID).Hex())
}
