package temp

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
	if !(uid >= 10000) {
		t.Error("uid init fail!")
	}
}

func TestGoGetUid(t *testing.T) {
	var (
		wg sync.WaitGroup
		tm time.Time = time.Now()
	)
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {

			uid, err := GetUID()
			if err != nil {
				t.Error(err.Error())
			}
			fmt.Printf(`get uid = %d \n`, uid)
			wg.Done()
		}()
	}
	wg.Wait()

	fmt.Println(time.Since(tm))
	select {}
}
