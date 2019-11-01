package main

import (
	"fmt"
	badger "github.com/dgraph-io/badger/v2"
)
var db
func main() {
	// Open the Badger database located in the /tmp/badger directory.
	// It will be created if it doesn't exist.
	var err
	db, err = badger.Open(badger.DefaultOptions("/works/go/back/badger"))
	if err != nil {
		log.Fatal(err.Error())
	}
	defer db.Close()
  	// Your code here…
	//insert();
	err := db.Update(func(txn *badger.Txn) error {
		// Your code here…
		txn.Set([]byte(10000),[]byte("black"))
		return nil
	  })
	if err != nil{
		fmt.Println(err.Error())
	}
}
/**
* 插入数据
**/
func insert(){
	txn := db.NewTransaction(true)
	uid := 1
	defer txn.Discard()
	for uid < 100 {
		if err := txn.Set([]byte(uid),[]byte(fmt.Printf`user`)); err == badger.ErrTxnTooBig {
			err := txn.Commit()
			if err != nil {
				fmt.Println(err.Error())
				return
			}
			txn = db.NewTransaction(true)
			err = txn.Set([]byte(k),[]byte(v))
			if err != nil {
				fmt.Println(err.Error())
				return
			}
		  }
	}
	_ = txn.Commit()
	
}