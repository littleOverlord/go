package score

import (
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"mgame-go/ni/db"
	"mgame-go/ni/logger"
	"mgame-go/ni/util"
	"mgame-go/ni/websocket"
	"strconv"
	"sync"
	"time"

	badger "github.com/dgraph-io/badger/v2"
)

var (
	rankIndex      int
	rankStamp      int64
	rankDBtimeLock sync.Mutex
	clear          int
	dropStatus     int
	dbNameTable    = make(map[string]int)
	dbNameLock     sync.Mutex
)

// rank user info
type rankItem struct {
	UID   int    `json:"uid"`
	Score int    `json:"score"`
	Name  string `json:"name"`
	Head  string `json:"head"`
}

// read chan accept arg
type readArg struct {
	message *websocket.ClientMessage
	client  *websocket.Client
}

// 初始化排行数据
func initDBinfo() error {
	var (
		col   *badger.DB
		err   error
		index int
		stamp = util.MondayStamp()
	)
	defer func() {
		if p := recover(); p != nil {
			fmt.Println(p)
		}
	}()
	col, err = db.Collection("rank")
	if err != nil {
		panic("initRankDBinfo error: " + err.Error())
	}
	txn := col.NewTransaction(true)
	defer txn.Discard()
	_index, err := db.ReadItemValue(txn, "index")
	if err == badger.ErrKeyNotFound {
		rankIndex = 0
		rankStamp = stamp
		err = db.InsertMany(txn, []string{
			"index", "0",
			"stamp", strconv.FormatInt(stamp, 10),
		})
		return err
	} else if err != nil {
		panic("initRankDBinfo error: " + err.Error())
	}
	index, err = strconv.Atoi(_index)
	if err != nil {
		panic("initRankDBinfo error: " + err.Error())
	}
	_stamp, err := db.ReadItemValue(txn, "stamp")
	oldStamp, err := strconv.ParseInt(_stamp, 10, 64)
	// 判断是否需要切换数据库
	if oldStamp < stamp {
		clear = index + 2
		rankIndex = int(math.Abs(float64(index - 1)))
		rankStamp = stamp
		err = db.InsertMany(txn, []string{
			"index", strconv.Itoa(rankIndex),
			"stamp", strconv.FormatInt(rankStamp, 10),
		})
		if err != nil {
			return err
		}
	}
	dropDB(clear, txn)
	return txn.Commit()
}

/**
* 删除过期的排行数据库
**/
func dropDB(index int, txn *badger.Txn) {
	if clear > 0 && dropStatus == 1 {
		return
	}
	var wg sync.WaitGroup
	index -= 2
	dropStatus = 1
	opts := badger.DefaultIteratorOptions
	opts.PrefetchValues = true
	opts.PrefetchSize = 100
	opts.Reverse = true
	it := txn.NewIterator(opts)
	defer it.Close()
	for it.Rewind(); it.Valid(); it.Next() {
		item := it.Item()
		k := string(item.Key())
		if k != "index" && k != "stamp" {
			dbNameTable[k] = 1
			if clear > 0 {
				wg.Add(1)
				go func() {
					defer wg.Done()
					e := dropDBitem(fmt.Sprintf(`%s%d`, k, index))
					if e != nil {
						logger.Error(e.Error())
					}
				}()
			}
		}
	}
	wg.Wait()
	dropStatus = 0
	clear = 0
}

// 删除每个过期数据库
func dropDBitem(key string) error {
	col, err := db.Collection(key)
	if err != nil {
		return err
	}
	err = col.DropAll()
	return err
}

// read rank interface for client
func readRank(message *websocket.ClientMessage, client *websocket.Client) error {
	// rankChan.get <- &readArg{message, client}
	var (
		col     *badger.DB
		dbName  = client.Game + "_" + client.From + "_rank"
		keysTop = make([]string, 0, 10)
		selfTop = make([]string, 0, 10)

		keysTopItem = make([]rankItem, 10, 10)
		selfTopItem = make([]rankItem, 10, 10)

		keysTopStr []byte
		selfTopStr []byte

		selfPos int
		currPos int

		_uid string
		err  error
	)
	// go checkDBtime()
	_uid, err = sumByte(strconv.Itoa(client.UID), "0000000000")
	if err != nil {
		return err
	}

	// col, err = db.Collection(fmt.Sprintf(`%s%d`, dbName, rankIndex))
	col, err = db.Collection(dbName)
	if err != nil {
		return err
	}
	err = col.View(func(txn *badger.Txn) error {
		opts := badger.DefaultIteratorOptions
		opts.PrefetchValues = true
		opts.PrefetchSize = 100
		opts.Reverse = true
		it := txn.NewIterator(opts)
		defer it.Close()
		for it.Rewind(); it.Valid(); it.Next() {
			item := it.Item()
			k := string(item.Key())
			u := k[19:]
			currPos++
			// fmt.Println(currPos)
			if len(keysTop) < 10 {
				keysTop = append(keysTop, k)
			}
			// fmt.Println(u, _uid)
			if u == _uid {
				selfPos = currPos
			}
			// fmt.Println(currPos)
			if selfPos > 0 && currPos-selfPos == 5 {
				return nil
			} else if len(selfTop) < 10 {
				selfTop = append(selfTop, k)
			} else if len(selfTop) == 10 {
				selfTop = append(selfTop[:0], selfTop[1:]...)
				selfTop = append(selfTop, k)
			}
		}
		if selfPos == 0 {
			selfPos = currPos + 1
		}
		keysTopItem = keysTopItem[:len(keysTop)]
		selfTopItem = selfTopItem[:len(selfTop)]
		// fmt.Println(keysTop, selfTop)
		err = readItems(keysTop, keysTopItem, txn)
		if err != nil {
			return err
		}
		err = readItems(selfTop, selfTopItem, txn)
		return err
	})
	// fmt.Println(keysTopItem, selfTopItem)
	if err == nil {
		keysTopStr, err = json.Marshal(keysTopItem)
		if err == nil {
			selfTopStr, err = json.Marshal(selfTopItem)
		}
	}
	// fmt.Println(string(keysTopStr), string(selfTopStr))
	if err != nil {
		client.SendMessage(message, fmt.Sprintf(`{"err":{"reson":"%s"}}`, err.Error()))
	} else {
		client.SendMessage(message, fmt.Sprintf(`{"ok":{"rank":%s,"top":%d,"rankTop":%s}}`, string(selfTopStr), selfPos, string(keysTopStr)))
	}
	return err
}

//读取每个排行的数据
func readItems(src []string, dst []rankItem, txn *badger.Txn) error {
	for i, v := range src {
		var it rankItem
		_item, err := txn.Get([]byte(v))
		if err != nil {
			return err
		}
		_valCopy, err := _item.ValueCopy(nil)
		if err != nil {
			return err
		}
		err = json.Unmarshal(_valCopy, &it)
		if err != nil {
			return err
		}
		dst[i] = it
	}
	return nil
}

// update rank
func updateRank(old string, score int, client *websocket.Client, leftTime time.Duration) (err error) {
	var (
		col    *badger.DB
		dbName = client.Game + "_" + client.From + "_rank"
		key    string
	)
	defer func() {
		if err != nil {
			logger.Error(err.Error())
		}
	}()
	// go checkDBtime()
	// go addDBName(dbName)
	// col, err = db.Collection(fmt.Sprintf(`%s%d`, dbName, rankIndex))
	col, err = db.Collection(dbName)
	if err != nil {
		return err
	}
	txn := col.NewTransaction(true)
	defer txn.Discard()
	if old != "0" {
		err = deleteOld(client.UID, old, txn)
		if err != nil {
			return err
		}
	}
	_score := strconv.Itoa(score)
	key, err = megerKey(client.UID, _score)
	if err != nil {
		return err
	}
	e := badger.NewEntry([]byte(key), []byte(fmt.Sprintf(`{"uid":%d,"score":%d,"name":"%s","head":"%s"}`, client.UID, score, client.Name, client.Head))).WithTTL(leftTime)
	err = txn.SetEntry(e)
	if err != nil {
		return err
	}
	// Commit the transaction.
	return txn.Commit()
}

// read rank handler
func sendRank(ar *readArg) error {
	var (
		index = -1
		start = 3
		r     []rankItem
	)
	sr, err := json.Marshal(r)
	if err != nil {
		ar.client.SendMessage(ar.message, fmt.Sprintf(`{"err":{"reson":"%s"}}`, err.Error()))
	} else {
		ar.client.SendMessage(ar.message, fmt.Sprintf(`{"ok":{"rank":%s,"top":%d,"start":%d}}`, string(sr), index, start))
	}
	return err
}

/**
* 处理数字按位数补零
**/
func sumByte(numStr string, src string) (string, error) {
	// fmt.Println("sumByte :: ")
	if src == "" {
		src = "0000000000000000000"
	}
	empty := []byte(src)
	num := []byte(numStr)
	len1 := len(empty)
	len2 := len(num)
	diff := len1 - len2
	if diff < 0 {
		return "", errors.New("the number is too large")
	}

	for i := 0; i < len2; i++ {
		empty[i+diff] = num[i]
	}
	// fmt.Println(string(empty))
	return string(empty), nil
}

// 合并排行榜每条数据的key
// @return like "0000000000000000137600000000001"前20位是排序的数据 后11位是uid
func megerKey(uid int, src string) (string, error) {
	_key1, e := sumByte(src, "")
	if e != nil {
		return "", e
	}
	_key2, e := sumByte(strconv.Itoa(uid), "0000000000")
	if e != nil {
		return "", e
	}
	key := _key1 + _key2
	return key, nil
}

/**
* 删除老的排行数据
**/
func deleteOld(uid int, old string, txn *badger.Txn) error {
	key, err := megerKey(uid, old)
	if err != nil {
		return err
	}
	err = txn.Delete([]byte(key))
	return err
}

// 存储新数据库名字
func addDBName(name string) error {
	dbNameLock.Lock()
	var (
		col *badger.DB
		err error
	)
	defer func() {
		dbNameLock.Unlock()
		if err != nil {
			logger.Error(err.Error())
		}
	}()
	in := dbNameTable[name]
	if in == 1 {
		return nil
	}
	col, err = db.Collection("rank")
	if err != nil {
		return err
	}
	err = col.Update(func(txn *badger.Txn) error {
		e := badger.NewEntry([]byte(name), []byte("1")).WithTTL(time.Hour / 2)
		err := txn.SetEntry(e)
		return err
	})
	if err == nil {
		dbNameTable[name] = 1
	}
	return err
}

//检查数据库是否过期
func checkDBtime() error {
	rankDBtimeLock.Lock()
	defer rankDBtimeLock.Unlock()
	var (
		stamp = util.MondayStamp()
		wg    sync.WaitGroup
	)

	if rankStamp < stamp {
		clear = rankIndex
		rankIndex = int(math.Abs(float64(rankIndex - 1)))
		rankStamp = stamp
		for name, _ := range dbNameTable {
			wg.Add(1)
			go func() {
				defer wg.Done()
				err := dropDBitem(name)
				if err != nil {
					logger.Error(err.Error())
				}
			}()
		}

		col, err := db.Collection("rank")
		if err != nil {
			logger.Error(err.Error())
		}
		txn := col.NewTransaction(true)
		defer txn.Discard()

		err = db.InsertMany(txn, []string{
			"index", strconv.Itoa(rankIndex),
			"stamp", strconv.FormatInt(rankStamp, 10),
		})
		if err != nil {
			logger.Error(err.Error())
		}
	}
	wg.Wait()
	return nil
}
