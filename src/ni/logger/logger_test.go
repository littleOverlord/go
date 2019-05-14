// Copyright 2019 tdd authors
package logger

import (
	"fmt"
	"testing"
	"time"
)

func TestFileName(t *testing.T){
	name := fileName(LOGTYPE.Error)
	if name == "2006-01-02.error"{
		t.Error("the file name is not wrong ")
	}
}

func TestErrorlog(t *testing.T){
	c := 1000
	t1 := time.Now()
	for index := 0; index < c; index++ {
		errorLog(t,fmt.Sprintf("add %d error!!",index))
		// errorLog(t,"add second error!!")
	}
	group.Wait()
	t2 := time.Now()
	fmt.Println(c,"count spend time:", t2.Sub(t1))
}

func errorLog(t *testing.T, msg string){
	Error(msg)
}