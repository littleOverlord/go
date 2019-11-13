package main

import (
	"fmt"
	"log"
	"math"
	"math/rand"
	"strconv"
	"sync"
	"time"

	badger "github.com/dgraph-io/badger/v2"
)

var db *(badger.DB)

func main() {
	// Open the Badger database located in the /tmp/badger directory.
	// It will be created if it doesn't exist.
	var err error
	db, err = badger.Open(badger.DefaultOptions("/Users/tangdandan/works/go/back/badger/test"))
	if err != nil {
		log.Fatal(err.Error())
	}
	// defer db.Close()
	// Your code here…
	t0 := time.Now()
	// err = insertOne()
	// err = insertMany()
	rankAll()
	// err = read()
	// err = readAll()
	// err = deleteAll()
	// sumByte("987897","")
	// fmt.Println(MondayStamp())
	//abs()
	t1 := time.Now()
	fmt.Println(t1.Sub(t0))
	if err != nil {
		fmt.Println(err.Error())
	}
}

func abs() {
	ii := 0
	r := int(math.Abs(float64(ii - 1)))
	fmt.Println(r)
}

/**
* 测试字符串合并
**/
func sumByte(numStr string, src string) string {
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
		log.Fatal("the number is too large!")
	}

	for i := 0; i < len2; i++ {
		empty[i+diff] = num[i]
	}
	// fmt.Println(string(empty))
	return string(empty)
}

/**
* 插入数据
**/
func insertOne() error {
	fmt.Println("insertOne :: ")
	err := db.Update(func(txn *badger.Txn) error {
		// item, err := txn.Get([]byte("10000"))
		// if err != nil {
		// 	return err
		// }
		// valCopy, err := item.ValueCopy(nil)
		// if err != nil {
		// 	return err
		// }
		// fmt.Println(string(valCopy))

		e := badger.NewEntry([]byte("10000"), []byte("new black")).WithTTL(time.Hour / 2).WithMeta(byte(55))
		err := txn.SetEntry(e)
		return err
	})

	return err
}

/**
* 插入数据
**/
func insertMany() error {
	fmt.Println("insertMany :: ")
	txn := db.NewTransaction(true)
	defer txn.Discard()
	rand.Seed(time.Now().UnixNano())
	for i := 1; i < 10000; i++ {
		is := strconv.Itoa(i)
		score := rand.Intn(10000) + 1
		err := txn.Set([]byte(sumByte(strconv.Itoa(score), "")+sumByte(is, "0000000000")), []byte(fmt.Sprintf(`{"score":%d,"uid":%d}`, score, i)))
		if err != nil {
			return err
		}
		if (i+1)%500 == 0 {
			fmt.Printf(`finished %d`, i+1)
		}
	}

	// Commit the transaction and check for error.
	if err := txn.Commit(); err != nil {
		return err
	}

	return nil
}

/**
* 读取数据
**/
func read() error {
	fmt.Println("readOne :: ")
	err := db.View(func(txn *badger.Txn) error {
		// Your code here…
		item, err := txn.Get([]byte("10000"))
		if err != nil {
			return err
		}
		fmt.Println(item.Version())
		fmt.Println(item.UserMeta())
		fmt.Println(item.String())
		valCopy, err := item.ValueCopy(nil)
		fmt.Println(string(valCopy))
		return err
	})
	return err
}

/**
*
**/
func readAll() error {
	fmt.Println("readAll :: ")
	err := db.View(func(txn *badger.Txn) error {
		opts := badger.DefaultIteratorOptions
		opts.PrefetchValues = true
		opts.PrefetchSize = 100
		opts.Reverse = true
		it := txn.NewIterator(opts)
		defer it.Close()
		for it.Rewind(); it.Valid(); it.Next() {
			item := it.Item()
			k := item.Key()
			valCopy, err := item.ValueCopy(nil)
			fmt.Printf("key=%s,value=%s\n", k, string(valCopy))
			if err != nil {
				return err
			}
		}
		return nil
	})
	return err
}

type rankItem struct {
	UID   int `json:"uid"`
	Score int `json:"score"`
}

func rank() {
	t0 := time.Now()
	index := 9900
	until := index + 10
	count := 0
	fmt.Println(index)
	err := db.View(func(txn *badger.Txn) error {
		count++
		opts := badger.DefaultIteratorOptions
		opts.PrefetchValues = true
		opts.PrefetchSize = 100
		opts.Reverse = true
		it := txn.NewIterator(opts)
		defer it.Close()
		for it.Rewind(); it.Valid(); it.Next() {
			item := it.Item()
			k := item.Key()
			if string(k) == "0" {
				fmt.Println(k, until)
			}
			// if count >= index && count < until {
			// 	valCopy, err := item.ValueCopy(nil)
			// 	if err != nil {
			// 		return err
			// 	}
			// 	var _item rankItem
			// 	err = json.Unmarshal(valCopy, &_item)
			// 	if err != nil {
			// 		return err
			// 	}
			// 	if _item.UID == 0 {
			// 		fmt.Println(string(valCopy))
			// 	}
			// }
		}
		return nil
	})
	if err != nil {
		fmt.Println(err.Error())
	}
	t1 := time.Now()
	fmt.Println(t1.Sub(t0))
}

func rankAll() {
	var wg sync.WaitGroup

	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func() {
			rank()
			wg.Done()
		}()
	}
	wg.Wait()
}

func deleteAll() error {
	fmt.Println("deleteAll :: ")
	txn := db.NewTransaction(true)
	defer txn.Discard()

	for i := 1; i < 200; i++ {
		is := strconv.Itoa(i)
		err := txn.Delete([]byte(is))
		if err != nil {
			return err
		}
	}
	err := txn.Delete([]byte(strconv.Itoa(10000)))
	if err != nil {
		return err
	}
	// Commit the transaction and check for error.
	if err := txn.Commit(); err != nil {
		return err
	}

	return nil
}

func readWrite() error {
	fmt.Println("readAll :: ")
	err := db.Update(func(txn *badger.Txn) error {
		err := txn.Set([]byte("10001"), []byte("1"))

		return err
	})
	return err
}

func MondayStamp() int64 {
	now := time.Now()

	offset := int(time.Monday - now.Weekday())
	if offset > 0 {
		offset = -6
	}

	weekStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local).AddDate(0, 0, offset)
	return weekStart.UnixNano()
	// 1000000
}
