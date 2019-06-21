package client

import (
	"fmt"
	"sync"
	"testing"
	"time"
)

func TestInitUid(t *testing.T) {
	uid, err := GetUID()
	if err != nil {
		t.Error(err.Error())
	}
	if uid != 10000 {
		t.Error("uid init fail!")
	}
}

func TestGoGetUid(t *testing.T) {
	var (
		wg sync.WaitGroup
		tm time.Time = time.Now()
	)
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			wg.Done()
			uid, err := GetUID()
			if err != nil {
				t.Error(err.Error())
			}
			fmt.Println(uid)
		}()
	}
	wg.Wait()
	time.Since(tm)
}
