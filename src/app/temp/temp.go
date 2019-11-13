package temp

import (
	"fmt"
	"mgame-go/ni/db"
	"mgame-go/ni/logger"
	"strconv"
	"sync"

	badger "github.com/dgraph-io/badger/v2"
)

var (
	mux     sync.Mutex
	lastUID int
)

func init() {
	initUID()
	// regist ws(s) handlers
	port()
}

func initUID() {
	defer func() {
		if p := recover(); p != nil {
			fmt.Println(p)
			logger.Error(p.(string))
		}
	}()
	col, err := db.Collection("global")
	if err != nil {
		panic(err.Error())
	}
	err = col.View(func(txn *badger.Txn) error {
		// Your code here…
		item, err := txn.Get([]byte("UID"))
		if err != nil {
			return err
		}
		valCopy, err := item.ValueCopy(nil)
		if err != nil {
			return err
		}
		lastUID, err = strconv.Atoi(string(valCopy))
		return err
	})
	if err != nil && err != badger.ErrKeyNotFound {
		panic(err.Error())
	}
	if err == badger.ErrKeyNotFound {
		lastUID = 10000
	}
	fmt.Printf(`init uid == %d\n`, lastUID)
}

//GetUID is the way to get new user id
func GetUID() (int, error) {
	mux.Lock()
	v := lastUID
	lastUID++
	err := writeUID(lastUID)
	if err != nil {
		lastUID--
	}
	mux.Unlock()
	return v, err
}

func writeUID(v int) error {
	// fmt.Printf(`writeUID :: %d`, v)
	// fmt.Println(lastUID.ID)
	col, err := db.Collection("global")
	if err != nil {
		return err
	}
	err = col.Update(func(txn *badger.Txn) error {
		e := badger.NewEntry([]byte("UID"), []byte(strconv.Itoa(v)))
		err := txn.SetEntry(e)
		return err
	})
	return err
}
