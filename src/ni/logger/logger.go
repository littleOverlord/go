// Copyright 2019 tdd authors
package logger

import (
	"os"
	"fmt"
	"time"
	"runtime"
)

//写入错误日志
func Error(content string) error {
	var name string
	var err error
	var buf [1024]byte
	name = fileName(LOGTYPE.Error)
	n := runtime.Stack(buf[:], true)
	fmt.Println(n)
    err = append(name,[]byte("\n" + time.Now().String() + "\n" + content + "\n" + string(buf[:]) + "\n====================================================\n"),0777)
    return err
}
//log类型
var LOGTYPE = &struct {
	Error string
	Info string
	Warn string
}{
	Error : "error",
	Info : "info",
	Warn : "warn",
}
//追加写入文件
func append(fileName string, data []byte, perm os.FileMode) error {
	// 以只写的模式，打开文件
	f, err := os.OpenFile(fileName, os.O_APPEND|os.O_CREATE,perm)
	if err != nil {
		return err
	}
	defer f.Close()
	_,err = f.Write(data)
  	return err
}
// 获取对应的日志名，例如：2019-05-09.error
// @param _type LOGTYPE
func fileName(_type string) string {
	current := time.Now()
	t := current.Format("2006-01-02")
	return t + "." + _type
}