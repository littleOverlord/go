package score

import (
	"fmt"
	"ni/mongodb"
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

func TestDeleteRankDB(t *testing.T) {
	time.Sleep(10 * time.Second)
	col, ctx, cancel := mongodb.Collection("rank")
	defer cancel()
	_, err := col.DeleteMany(ctx, bson.M{"game": "testGame", "from": "test"})
	if err != nil {
		t.Error(err)
	}
}

func TestInsertRankDB(t *testing.T) {
	time.Sleep(10 * time.Second)
	var (
		score = []int{233, 2342, 543, 4546, 645, 768, 8876, 5, 6, 5564, 56, 445, 345, 7875, 656, 455, 667, 5457, 7854}
		rd    = &rankDB{
			Game: "testGame",
			From: "test",
			List: []rankItem{},
		}
	)
	for i, v := range score {
		rd.List = append(rd.List, rankItem{
			UID:   i,
			Head:  fmt.Sprintf(`test%d`, i),
			Name:  "",
			Score: v,
		})
	}
	err := saveRank(rd)
	if err != nil {
		t.Error(err)
	}

}

func TestInitRank(t *testing.T) {
	time.Sleep(10 * time.Second)
	fmt.Println(ranks)
}
