// Copyright 2019 tdd authors
package util

import (
	"fmt"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"time"
)

//WorkSpace 工作路径，即当前服务器的根路径
var WorkSpace string

func init() {
	defer func() {
		if p := recover(); p != nil {
			fmt.Println(p)
		}
	}()
	getWorkSpace()

}

// 获取工作路径
func getWorkSpace() {
	currentPath, err := os.Getwd()
	reg := regexp.MustCompile(`src.*$`)
	absWK := reg.ReplaceAllString(currentPath, "")
	WorkSpace = path.Dir(filepath.ToSlash(absWK))
	fmt.Println(currentPath, absWK, WorkSpace)
	if err != nil {
		panic("Get currentPath error by os.Getwd(), " + err.Error())
	}
}

//IsDir 判断是否目录
func IsDir(dirname string) bool {
	fhandler, err := os.Stat(dirname)
	if !(err == nil || os.IsExist(err)) {
		return false
	} else {
		return fhandler.IsDir()
	}
}

//IsFile 判断是否文件
func IsFile(filename string) bool {
	fhandler, err := os.Stat(filename)
	if !(err == nil || os.IsExist(err)) {
		return false
	} else if fhandler.IsDir() {
		return false
	}
	return true
}

//MondayStamp get nearest monday time stamp
func MondayStamp() int64 {
	now := time.Now()

	offset := int(time.Monday - now.Weekday())
	if offset > 0 {
		offset = -6
	}

	weekStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local).AddDate(0, 0, offset)
	return weekStart.UnixNano() / 1000000
}
