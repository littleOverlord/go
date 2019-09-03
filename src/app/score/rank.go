package score

import (
	"encoding/json"
	"fmt"
	"ni/logger"
	"ni/mongodb"
	"ni/websocket"

	"go.mongodb.org/mongo-driver/bson"
)

// rank user info
type rankItem struct {
	UID   int    `bson:"uid" json:"uid"`
	Score int    `bson:"score" json:"score"`
	Name  string `bson:"name" json:"name"`
	Head  string `bson:"head" json:"head"`
}

// rank db of per game and per platform
type rankDB struct {
	Game string      `bson:"game" json:"game"`
	From string      `bson:"from" json:"from"`
	List []*rankItem `bson:"list" json:"list"`
}

// rank handle struct
type caclRank struct {
	DB  rankDB
	add chan *rankItem
	get chan *readArg
}

// read chan accept arg
type readArg struct {
	message *websocket.ClientMessage
	client  *websocket.Client
}

var (
	// all game all platform rank map
	ranks = make(map[string]*caclRank)
)

// init rank db from mongodb to memory
func initRank() error {
	var (
		err error
	)
	defer func() {
		if err != nil {
			panic("init rank error : " + err.Error())
		}
	}()
	col, ctx, cancel := mongodb.Collection("rank")
	defer cancel()

	filter := bson.M{}
	cursor, err := col.Find(ctx, filter)
	for cursor.Next(ctx) {
		var res rankDB
		if err = cursor.Decode(&res); err != nil {
			return err
		}
		ranks[res.Game+res.From] = &caclRank{
			DB:  res,
			add: make(chan *rankItem, 100),
		}
		go ranks[res.Game+res.From].cacle()
	}
	return nil
}

// read rank interface for client
func readRank(message *websocket.ClientMessage, client *websocket.Client) error {
	cr := ranks[client.Game+client.From]
	if cr == nil {
		client.SendMessage(message, `{"ok":{"rank":"",top:0}}`)
		return nil
	}
	cr.get <- &readArg{message, client}
	return nil
}

// read rank handler
func (cr *caclRank) read(ar *readArg) {
	var (
		index  int
		inTop  bool
		length = len(cr.DB.List)
		end    int
		r      []*rankItem
	)
	for i, v := range cr.DB.List {
		inTop = v.UID == ar.client.UID
		if inTop {
			index = i
			break
		}
	}
	end = 10
	if index > 6 {
		end = index + 4
		if end > length {
			end = length
		}
		r = append(cr.DB.List[0:3], cr.DB.List[index-3:end]...)
	} else {
		if end > length {
			end = length
		}
		r = cr.DB.List[0:end]
	}
	sr, err := json.Marshal(r)
	if err != nil {
		ar.client.SendMessage(ar.message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
	} else {
		ar.client.SendMessage(ar.message, fmt.Sprintf(`{"ok":{"rank":%s,"top":%d}}`, string(sr), index))
	}
}

// add one score and resort the rank list
func (cr *caclRank) sort(ri *rankItem) {
	len := len(cr.DB.List)

	if ri.Score >= cr.DB.List[0].Score {
		cr.DB.List = sliceInsert(cr.DB.List, 0, ri)
	}
}

// rank channels
func (cr *caclRank) cacle() {
	defer func() {
		if p := recover(); p != nil {
			logger.Error(p.(string))
			delete(ranks, cr.DB.Game+cr.DB.From)
		}
	}()
	for {
		select {
		case c, ok := <-cr.get:
			if !ok {
				panic("read caclRank.get chan fail")
			}
			cr.read(c)
		case ri, ok := <-cr.add:
			if !ok {
				panic("read caclRank.add chan fail")
			}
			cr.sort(ri)
		}
	}
}

// insert one element to a slice
func sliceInsert(s []*rankItem, i int, el *rankItem) []*rankItem {
	n := []*rankItem{el}
	start := append([]*rankItem{}, s[0:i]...)
	end := s[i:]
	start = append(start, n...)
	end = append(start, end...)
	return end
}
