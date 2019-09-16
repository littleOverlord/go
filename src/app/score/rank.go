package score

import (
	"encoding/json"
	"errors"
	"fmt"
	"ni/logger"
	"ni/mongodb"
	"ni/websocket"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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
	Game string     `bson:"game" json:"game"`
	From string     `bson:"from" json:"from"`
	List []rankItem `bson:"list" json:"list"`
}

// channels for controling rank update && get
type channels struct {
	add chan *addArg
	get chan *readArg
}

// read chan accept arg
type readArg struct {
	message *websocket.ClientMessage
	client  *websocket.Client
}

type addArg struct {
	ri     rankItem
	client *websocket.Client
}

var (
	// all game all platform rank map
	ranks = make(map[string]*rankDB)
	// the channels for controling rank update && get
	rankChan = channels{
		add: make(chan *addArg, 100),
		get: make(chan *readArg, 100),
	}
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
		ranks[res.Game+res.From] = &res
		fmt.Println(res.Game)
	}
	fmt.Println(ranks)
	return nil
}

// read rank interface for client
func readRank(message *websocket.ClientMessage, client *websocket.Client) error {
	rankChan.get <- &readArg{message, client}
	return nil
}

// check db has rank && return *caclRank
func checkDBHasRank(game string, from string) (*rankDB, error) {
	col, ctx, cancel := mongodb.Collection("rank")
	defer cancel()

	filter := bson.M{"game": game, "from": from}
	cursor := col.FindOne(ctx, filter)
	var res rankDB
	if err := cursor.Decode(&res); err != nil {
		if err == mongo.ErrNoDocuments {
			err = nil
		}

		return nil, err
	}
	ranks[res.Game+res.From] = &res
	return ranks[res.Game+res.From], nil
}

// update rank
func updateRank(ri *rankItem, client *websocket.Client) (rd *rankDB, err error) {
	rd = ranks[client.Game+client.From]
	if rd == nil {
		rd, err = checkDBHasRank(client.Game, client.From)
		if err != nil {
			return nil, errors.New("rank.checkDBHasRank ::: " + err.Error())
		}
		if rd == nil {
			rd = &rankDB{
				Game: client.Game,
				From: client.From,
				List: []rankItem{*ri},
			}
			err = saveRank(rd)
			if err != nil {
				return nil, errors.New("rank.saveRank ::: " + err.Error())
			}
			ranks[client.Game+client.From] = rd
			return nil, nil

		}
		ranks[client.Game+client.From] = rd
	}
	return rd, nil
}

// save rank to mongodb
func saveRank(rd *rankDB) error {
	col, ctx, cancel := mongodb.Collection("rank")
	defer cancel()
	_, err := col.InsertOne(ctx, *rd)
	return err
}

// read rank handler
func sendRank(ar *readArg) error {
	var (
		rd     = ranks[ar.client.Game+ar.client.From]
		index  = -1
		inTop  bool
		length int
		start  = 3
		end    int
		r      []rankItem
	)
	if rd == nil {
		ar.client.SendMessage(ar.message, `{"ok":{"rank":"","top":0,"start":-1}}`)
		return nil
	}
	length = len(rd.List)
	for i, v := range rd.List {
		inTop = v.UID == ar.client.UID
		if inTop {
			index = i
			break
		}
	}
	end = 10
	if index > 6 {
		start = index - 3
		end = index + 4
		if end > length {
			end = length
		}
		r = append(rd.List[0:3], rd.List[start:end]...)
	} else if index == -1 && length > 10 {
		start = length - 7
		end = length
		r = append(rd.List[0:3], rd.List[start:end]...)
	} else {
		if end > length {
			end = length
		}
		r = rd.List[0:end]
	}
	sr, err := json.Marshal(r)
	if err != nil {
		ar.client.SendMessage(ar.message, fmt.Sprintf(`{"err":{"reson":"%s"}}`, err.Error()))
	} else {
		ar.client.SendMessage(ar.message, fmt.Sprintf(`{"ok":{"rank":%s,"top":%d,"start":%d}}`, string(sr), index, start))
	}
	return err
}

// add one score and resort the rank list
func sortRank(ada *addArg) {
	var (
		rd, err = updateRank(&ada.ri, ada.client)
	)
	if rd == nil {
		if err != nil {
			logger.Error(err.Error())
		}
		return
	}
	rd.List = removeSame(rd.List, &(ada.ri))
	leng := len(rd.List)

	if leng == 0 {
		rd.List = append(rd.List,ada.ri)
	} else if ada.ri.Score >= rd.List[0].Score {
		rd.List = sliceInsert(rd.List, 0, &(ada.ri))
	} else if ada.ri.Score >= rd.List[leng-1].Score {
		rd.List = sliceInsert(rd.List, halfInsert(rd, &(ada.ri)), &(ada.ri))
	} else if leng < 100 {
		rd.List = append(rd.List, ada.ri)
	} else {
		return
	}
	leng = len(rd.List)
	if leng > 100 {
		rd.List = rd.List[:100]
	}
	col, ctx, cancel := mongodb.Collection("rank")
	defer cancel()

	filter := bson.M{"game": rd.Game, "from": rd.From}
	_, err = col.UpdateOne(ctx, filter, bson.M{"$set": bson.M{"list": rd.List}})
	if err != nil {
		logger.Error("rank.sortRank ::: " + err.Error())
	}
}

// dichotomy insert rank
func halfInsert(rd *rankDB, ri *rankItem) int {
	var (
		prev = 0
		last = len(rd.List) - 1
		i    = (last / 2) + 1
		ti   int
	)

	for {
		i = ti
		if rd.List[i].Score > ri.Score {
			ti = i + (last-i)/2
			prev = i
			if ti == i {
				i = i + 1
				ti = i
			}
		} else if rd.List[i].Score < ri.Score {
			ti = prev + (i-prev)/2
			last = i
			if ti == i {
				i = i - 1
				ti = i
			}
		}
		if ti == i {
			break
		}
	}
	return ti
}

// rank channels
func (rc *channels) cacl() {
	defer func() {
		if p := recover(); p != nil {
			logger.Error(p.(string))
		}
	}()
	for {
		select {
		case ar, ok := <-rc.get:
			if !ok {
				panic("read caclRank.get chan fail")
			}
			sendRank(ar)
		case ada, ok := <-rc.add:
			if !ok {
				panic("read caclRank.add chan fail")
			}
			sortRank(ada)
		}
	}
}

// insert one element to a slice
func sliceInsert(s []rankItem, i int, el *rankItem) []rankItem {
	n := []rankItem{*el}
	start := append([]rankItem{}, s[0:i]...)
	end := s[i:]
	start = append(start, n...)
	end = append(start, end...)
	return end
}

// find the index of same user in ranks list
func removeSame(s []rankItem, el *rankItem) []rankItem {
	i := 0
	for _, v := range s {
		if v.UID != el.UID {
			s[i] = v
			i++
		}
	}
	return s[:i]
}
