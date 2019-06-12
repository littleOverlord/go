// Package server http(s)
// Copyright 2019 tdd authors
package server

import (
	"fmt"
	"net/http"
	"path"
	"time"

	"ni/logger"
	"ni/router"
	"ni/util"
)

// http处理函数类型
type httpHandleFunc func(w http.ResponseWriter, req *http.Request)

//Create 创建http(s)服务
// 从配置表中获取端口、以及https所需tls文件
func Create(cfg map[string]interface{}) {

	fmt.Println("http")
	go func(c map[string]interface{}) {
		err := httpServer("http", c, handleFunc)
		if err != nil {
			fmt.Println(err.Error())
		}
	}(cfg)

	fmt.Println("https")
	go func(c map[string]interface{}) {
		time.Sleep(1000 * time.Microsecond)
		err := httpsServer("https", c, handleFunc)
		if err != nil {
			fmt.Println(err.Error())
		}
	}(cfg)
}

//CreateSingle create single server for http or https
func CreateSingle(scheme string, cfg map[string]interface{}, fh httpHandleFunc) (err error) {
	switch scheme {
	case "ws":
		err = httpServer(scheme, cfg, fh)
	case "wss":
		err = httpsServer(scheme, cfg, fh)
	}
	return err
}

// http(s)处理函数
func handleFunc(w http.ResponseWriter, req *http.Request) {
	err := router.Distribute(w, req)
	if err != nil {
		logger.Error(err.Error())
	}
}

// 创建http服务
func httpServer(scheme string, cfg map[string]interface{}, hf httpHandleFunc) error {
	port := cfg[scheme].(map[string]interface{})["port"].(string)
	fmt.Println(":" + port)
	mux := http.NewServeMux()
	mux.HandleFunc("/", hf)
	err := http.ListenAndServe(":"+port, mux)
	if err != nil {
		logger.Error(err.Error())
	}
	return err
}

// 创建htpps服务
func httpsServer(scheme string, cfg map[string]interface{}, hf httpHandleFunc) error {
	port := cfg[scheme].(map[string]interface{})["port"].(string)
	tlsKey := cfg["https"].(map[string]interface{})["key"].(string)
	tlsCrt := cfg["https"].(map[string]interface{})["crt"].(string)
	mux := http.NewServeMux()
	mux.HandleFunc("/", hf)
	fmt.Println(":"+port, path.Join(util.WorkSpace, tlsKey), path.Join(util.WorkSpace, tlsCrt))
	err := http.ListenAndServeTLS(":"+port, path.Join(util.WorkSpace, tlsCrt), path.Join(util.WorkSpace, tlsKey), mux)
	if err != nil {
		logger.Error(err.Error())
	}
	return err
}
