// Copyright 2019 tdd authors
package server

import (
	"fmt"
	"path"
	"time"
	"net/http"

	"ni/logger"
	"ni/util"
	"ni/router"
)
// 创建http(s)服务
func Create(cfg map[string]interface{}){
	port := cfg["http"].(map[string]interface{})["port"].(string)
	fmt.Println("http")
	if port != "" {
		go func(p string){
			err := httpServer(p)
			if err != nil{
				fmt.Println(err.Error()) 
			}
		}(port)
	}
	port = cfg["https"].(map[string]interface{})["port"].(string)
	key := cfg["https"].(map[string]interface{})["key"].(string)
	crt := cfg["https"].(map[string]interface{})["crt"].(string)
	fmt.Println("https")
	if port != "" {
		go func(p string, key string, crt string){
			time.Sleep(1000 * time.Microsecond)
			err := httpsServer(p,key,crt)
			if err != nil{
				fmt.Println(err.Error()) 
			}
		}(port,key,crt)
	}
	select {}
}
// http(s)处理函数
func handleFunc (w http.ResponseWriter, req *http.Request){
	err := router.Distribute(w, req)
	if err != nil {
		logger.Error(err.Error())
	}
}
// 创建htpp服务
func httpServer(port string) error{
	fmt.Println(":"+port)
	mux := http.NewServeMux()
    mux.HandleFunc("/", handleFunc)
	err := http.ListenAndServe(":"+port, mux)
	if err != nil {
		logger.Error(err.Error())
	}
	return err
}
// 创建htpps服务
func httpsServer(port string, key string, crt string) error{
	mux := http.NewServeMux()
    mux.HandleFunc("/", handleFunc)
	fmt.Println(":"+port, path.Join(util.WorkSpace,key), path.Join(util.WorkSpace,crt))
	err := http.ListenAndServeTLS(":"+port, path.Join(util.WorkSpace,key), path.Join(util.WorkSpace,crt), mux)
	if err != nil {
		logger.Error(err.Error())
	}
	return err
}