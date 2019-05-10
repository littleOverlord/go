// Copyright 2019 tdd authors
package util

import (
	"fmt"
	"testing"
	"path"
)

func TestGetWorkSpace(t *testing.T){
	if WorkSpace == "" || WorkSpace == "." {
		t.Error(fmt.Sprintf(`WorkSpace can't be "%s"`,WorkSpace))
	}
}
func TestIsDir(t *testing.T){
	logPath := path.Join("back","log")
	filePath := path.Join(WorkSpace,logPath)
	if !IsDir(filePath) {
		t.Error(fmt.Sprintf(`"%s" should be a dir!`,filePath))
	}
	filePath = path.Join(filePath,"mongodb.log")
	if IsDir(filePath) {
		t.Error(fmt.Sprintf(`"%s" should be a file!`,filePath))
	}
}
func TestIsFile(t *testing.T){
	logPath := path.Join("back","log")
	filePath := path.Join(WorkSpace,logPath)
	if IsFile(filePath) {
		t.Error(fmt.Sprintf(`"%s" should be a dir!`,filePath))
	}
	filePath = path.Join(filePath,"mongodb.log")
	if !IsFile(filePath) {
		t.Error(fmt.Sprintf(`"%s" should be a file!`,filePath))
	}
}