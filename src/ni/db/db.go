//Package db Copyright 2019 tdd authors
//look for the detail please go to https://github.com/dgraph-io/badger
package db

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"mgame-go/ni/util"

	badger "github.com/dgraph-io/badger/v2"
)

var (
	table = make(map[string]*badger.DB)
	dbDir = "/back/badger/"
)

// Connect is connecting to mongodb server
func init() {

	fmt.Println("db connected!!")
}

//Collection get a connect with db name
//return a new badger DB object. DB is thread-safe.
func Collection(name string) (db *badger.DB, err error) {
	dir := util.WorkSpace + dbDir + name
	db = table[name]
	if db == nil {
		db, err = badger.Open(badger.DefaultOptions(dir))
		table[name] = db
	}
	return db, err
}

//InsertMany insert many data in a transaction
//@param list like [key1,value1,key2,value2,...]
func InsertMany(txn *badger.Txn, list []string) error {
	var l = len(list)
	for i := 0; i < l; i += 2 {
		// err := txn.Set([]byte(list[i]), []byte(list[i+1]))
		// if err != nil {
		// 	return err
		// }
		e := badger.NewEntry([]byte(list[i]), []byte(list[i+1]))
		//.WithTTL(time.Hour / 2)
		err := txn.SetEntry(e)
		if err != nil {
			return err
		}
	}
	return nil
}

//ReadItemValue read a value from one data
func ReadItemValue(txn *badger.Txn, key string) (string, error) {
	item, err := txn.Get([]byte(key))
	if err != nil {
		return "", err
	}
	valCopy, err := item.ValueCopy(nil)
	if err != nil {
		return "", err
	}
	value := string(valCopy)
	return value, nil
}

func closeAll() {
	for _, v := range table {
		v.Close()
	}
}

func listenSignal() {
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT, syscall.SIGUSR1,
		syscall.SIGUSR2, syscall.SIGTSTP)
	select {
	case <-sigs:
		fmt.Println("exitapp,sigs:", sigs)
		closeAll()
		os.Exit(0)
	}
}
