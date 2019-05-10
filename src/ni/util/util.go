// Copyright 2019 tdd authors
package util

import (
	"fmt"
	"os"
	"path"
	"path/filepath"
	"regexp"
)
// 工作路径，即当前服务器的根路径
var WorkSpace string

func init(){
	defer func(){
		if p := recover(); p != nil {
			fmt.Println(p)
        }
	}()
	getWorkSpace()
	
}
// 获取工作路径
func getWorkSpace(){
	currentPath, err := os.Getwd()
	reg := regexp.MustCompile(`src.*$`)
	absWK := reg.ReplaceAllString(currentPath, "")
	WorkSpace = path.Dir(filepath.ToSlash(absWK))
	fmt.Println(currentPath,absWK,WorkSpace)
	if err != nil {
		panic("Get currentPath error by os.Getwd(), " + err.Error())
	}
}
// 判断是否目录
func IsDir(dirname string) bool  {
    fhandler, err := os.Stat(dirname);
    if(! (err == nil || os.IsExist(err)) ) {
        return false
    }else {
        return fhandler.IsDir()
    }
}
// 判断是否文件
func IsFile(filename string) bool  {
    fhandler, err := os.Stat(filename);
    if(! (err == nil || os.IsExist(err)) ) {
        return false
    }else if (fhandler.IsDir()){
        return false
    }
    return true
}