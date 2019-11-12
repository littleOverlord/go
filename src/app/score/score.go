package score

import (
	"encoding/json"
	"errors"
	"fmt"
	"mgame-go/ni/db"
	"mgame-go/ni/util"
	"mgame-go/ni/websocket"
	"strconv"
	"time"

	badger "github.com/dgraph-io/badger/v2"
)

// the db type is saving one user score data
type scoreDB struct {
	UID     int    `bson:"uid" json:"uid"`
	History int    `bson:"history" json:"history"`
	Phase   int    `bson:"phase" json:"phase"`
	Time    int64  `bson:"time" json:"time"`
	From    string `bson:"from" json:"from"`
}

// the message type from client by "app/score@add" interface
type addMessage struct {
	Score int `json:"score"`
}

func init() {
	// initDBinfo()
	// regist ws(s) handlers
	port()
}

// read self score db data
func readScore(message *websocket.ClientMessage, client *websocket.Client) error {
	var (
		err     error
		phase   int
		history int
		col     *badger.DB
	)
	defer func() {
		if err != nil {
			client.SendMessage(message, fmt.Sprintf(`{"err":"%s"}`, err.Error()))
		}
	}()
	col, err = db.Collection(client.Game + "_score")
	if err != nil {
		return err
	}
	err = col.View(func(txn *badger.Txn) error {
		var (
			_phase   string
			_history string
		)
		_phase, err := db.ReadItemValue(txn, scoreKey(client, "phase"))
		if err == badger.ErrKeyNotFound {
			_phase = "0"
		} else if err != nil {
			return err
		}
		phase, err = strconv.Atoi(_phase)
		if err != nil {
			return err
		}

		_history, err = db.ReadItemValue(txn, scoreKey(client, "history"))
		if err == badger.ErrKeyNotFound {
			_history = "0"
		} else if err != nil {
			return err
		}
		history, err = strconv.Atoi(_history)
		return err
	})

	client.SendMessage(message, fmt.Sprintf(`{"ok": {"history": %d, "phase": %d}}`, history, phase))
	return nil
}

// add || update self score db data
func addScore(message *websocket.ClientMessage, client *websocket.Client) error {
	var (
		err      error
		arg      addMessage
		history  string
		old      string
		col      *badger.DB
		leftTime time.Duration
	)
	defer func() {
		if err != nil {
			client.SendMessage(message, fmt.Sprintf(`{"err":{"reson":"%s"}}`, err.Error()))
		} else {
			client.SendMessage(message, `{"ok": "ok"}`)
			updateRank(old, arg.Score, client, leftTime)
		}
	}()
	leftTime, err = time.ParseDuration(fmt.Sprintf(`%dns`, 7*24*60*60*1000*1000000-(time.Now().UnixNano()-util.MondayStamp())))
	if err != nil {
		return err
	}
	err = json.Unmarshal(message.ArgB, &arg)
	if err != nil {
		return err
	} else if arg.Score <= 0 {
		return errors.New("the score can't be equal or less than 0")
	}
	col, err = db.Collection(client.Game + "_score")
	if err != nil {
		return err
	}
	txn := col.NewTransaction(true)
	defer txn.Discard()
	old, err = db.ReadItemValue(txn, scoreKey(client, "phase"))
	if err == badger.ErrKeyNotFound {
		old = "0"
	} else if err != nil {
		return err
	}

	history, err = db.ReadItemValue(txn, scoreKey(client, "history"))
	if err == badger.ErrKeyNotFound {
		history = "0"
	} else if err != nil {
		return err
	}
	_score := strconv.Itoa(arg.Score)
	_history, e := strconv.Atoi(history)
	if e != nil {
		return e
	}
	if arg.Score > _history {
		history = _score
	}
	et := badger.NewEntry([]byte(scoreKey(client, "phase")), []byte(_score)).WithTTL(leftTime)
	err = txn.SetEntry(et)
	if err != nil {
		return err
	}
	err = db.InsertMany(txn, []string{
		scoreKey(client, "history"), history,
		//scoreKey(client, "ctime"), strconv.FormatInt(time.Now().UnixNano(), 10),
	})
	if err != nil {
		return err
	}
	// Commit the transaction.
	return txn.Commit()
}

// mix score db key
// @param suffix "phase"||"history"
func scoreKey(client *websocket.Client, suffix string) string {
	suid := strconv.Itoa(client.UID)
	s := suid + client.From + suffix
	return s
}
