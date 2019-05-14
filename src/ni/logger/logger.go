// Copyright 2019 tdd authors
package logger

import (
	"os"
	"fmt"
	"time"
	"runtime"
	"path"
	"sync"
	"ni/util"
)

//写入错误日志
func Error(content string) {
	group.Add(1)
	go func(){
		// lock.Error.Lock()
		// defer lock.Error.Unlock()
		var buf [1024]byte
		name := fileName(LOGTYPE.Error)
		runtime.Stack(buf[:], true)
		s := fmt.Sprintf("\n%s\n%s\n%s\n====================================================\n",time.Now().String(),content,string(buf[:]))
		err := append(name,[]byte(s),0777)
		if err != nil {
			fmt.Println(err)
		}
		group.Done()
	}()
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
// 写入锁
var lock = &struct{
	Error sync.Mutex
	Info sync.Mutex
	Warn sync.Mutex
}{}
var group = sync.WaitGroup{}
//追加写入文件
func append(fileName string, data []byte, perm os.FileMode) error {
	// 以追加和创建的模式，打开文件
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
	logPath := path.Join("back","log")
	filePath := path.Join(util.WorkSpace,logPath)
	return filePath + "/" + t + "." + _type
}