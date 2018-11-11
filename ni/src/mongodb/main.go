package main

import (
	"context"
	"fmt"

	"github.com/mongodb/mongo-go-driver/mongo"
	"github.com/mongodb/mongo-go-driver/bson"
)

func main(){
	testDocumentationExamples()
}

func testDocumentationExamples() {
	client, err := mongo.Connect(context.Background(), "mongodb://localhost:29817", nil)
	if err != nil {
		fmt.Println(err)
		return 
	}

	db := client.Database("documentation_examples")

	_, _err := db.RunCommand(
		context.Background(),
		bson.NewDocument(bson.EC.Int32("dropDatabase", 1)),
	)
	if _err != nil {
		fmt.Println(_err)
		return 
	}

	coll := db.Collection("inventory")

	{
		// Start Example 1

		result, err := coll.InsertOne(
			context.Background(),
			bson.NewDocument(
				bson.EC.String("item", "canvas"),
				bson.EC.Int32("qty", 100),
				bson.EC.ArrayFromElements("tags",
					bson.VC.String("cotton"),
				),
				bson.EC.SubDocumentFromElements("size",
					bson.EC.Int32("h", 28),
					bson.EC.Double("w", 35.5),
					bson.EC.String("uom", "cm"),
				),
			))
		if err != nil {
			fmt.Println(err)
			return
		}
		fmt.Println(result.InsertedID)
		// End Example 1

		// require.NoError(t, err)
		// require.NotNil(t, result.InsertedID)
	}
	
}