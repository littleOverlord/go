package main

import (
	"fmt"
	"os"
	"time"
	"path"
	_"io/ioutil"
)

func main() {
	currentPath, err := os.Getwd()
	workspace := path.Join("ni","config")
	path.Dir()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(currentPath)
}
//写入错误日志
func Error(content string) error {
	name := fileName("error")
    err:=append(name,[]byte(content),0777)
    return err
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
func fileName(_type string) string {
	current := time.Now()
	t := current.Format("0000-00-00")
	return t + "." + _type
}