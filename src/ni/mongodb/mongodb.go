//Package mongodb Copyright 2019 tdd authors
package mongodb

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"mgame-go/ni/config"
	"mgame-go/ni/logger"
)

var (
	ctx    context.Context
	client *mongo.Client
	url    string
	dbName = "blog"
)

// Connect is connecting to mongodb server
func init() {
	url = config.Table["app/main/config.json"].(map[string]interface{})["db"].(map[string]interface{})["url"].(string)
	dbName = config.Table["app/main/config.json"].(map[string]interface{})["db"].(map[string]interface{})["name"].(string)
	_ctx := context.Background()
	defer func() {
		if p := recover(); p != nil {
			fmt.Println(p)
			client.Disconnect(ctx)
			logger.Error(p.(string))
		}
	}()
	// create a mongo client
	_client, err := mongo.Connect(_ctx, options.Client().ApplyURI(url))
	if err != nil {
		panic(fmt.Sprintf("connect mongodb fail '%s'", err.Error()))
	}
	ctx = _ctx
	client = _client
	fmt.Println("mongodb connected!!")
}

//Collection get a connect with db name and document name
//return a Collection had connected the document
func Collection(document string) (col *mongo.Collection, _ctx context.Context, cal context.CancelFunc) {
	col = client.Database(dbName).Collection(document)
	_ctx, cal = context.WithTimeout(ctx, 10*time.Second)
	return col, _ctx, cal
}
