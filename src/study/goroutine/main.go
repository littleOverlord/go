package main

import (
	"fmt"
	_ "io/ioutil"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"
)

func main() {
	go panicGR()
	go func() {
		var t = time.Now().UnixNano()
		var r int8
		for {
			tm := int8((time.Now().UnixNano() - t) / 1000000)
			if tm > r {
				r = tm
				fmt.Println(r)
			}
		}
	}()
	select {}
}

func panicGR() {
	var t = time.Now().UnixNano()
	defer func() {
		if p := recover(); p != nil {
			fmt.Println(p.(string))
		}
	}()
	for {
		if time.Now().UnixNano()-t > 1000000*10 {
			panic("time out")
		}
	}
}

func getPath() {
	currentPath, err := os.Getwd()
	absWK := path.Join("src", "study", "io_os")
	workspace := path.Dir(strings.Replace(filepath.ToSlash(currentPath), absWK, "", 1))

	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(path.Clean(currentPath), path.Clean(absWK), strings.Replace(currentPath, absWK, "", 1), workspace, filepath.ToSlash(currentPath))
}

//写入错误日志
func Error(content string) error {
	name := fileName("error")
	err := append(name, []byte(content), 0777)
	return err
}

//追加写入文件
func append(fileName string, data []byte, perm os.FileMode) error {
	// 以只写的模式，打开文件
	f, err := os.OpenFile(fileName, os.O_APPEND|os.O_CREATE, perm)
	if err != nil {
		return err
	}
	defer f.Close()
	_, err = f.Write(data)
	return err
}
func fileName(_type string) string {
	current := time.Now()
	t := current.Format("0000-00-00")
	return t + "." + _type
}
