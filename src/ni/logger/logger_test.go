// Copyright 2019 tdd authors
package logger

import (
	"testing"
)

func TestFileName(t *testing.T){
	name := fileName(LOGTYPE.Error)
	if name == "2006-01-02.error"{
		t.Error("the file name is not wrong ")
	}
}

func TestErrorlog(t *testing.T){
	errorLog(t,"add first error!!")
	errorLog(t,"add second error!!")
}

func errorLog(t *testing.T, msg string){
	err := Error(msg)
	if err != nil {
		t.Errorf("Unexpected error: (%T)%v", err, err)
	}
}