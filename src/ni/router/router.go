// Copyright 2019 tdd authors
package router

import (
	"fmt"
	"net/http"
	"net/url"

	"mgame-go/ni/logger"
	"mgame-go/ni/static"
)

// 路由注册函数类型
type HttpHandler func(w http.ResponseWriter, req *http.Request) error

// http(s)路由表
var httpHandlers map[string]HttpHandler

// 分发路由
func Distribute(w http.ResponseWriter, req *http.Request) error {
	err := req.ParseForm()
	if err != nil {
		return err
	}
	key, er := getClientInterface(req)
	if er != nil {
		return er
	}
	f := httpHandlers[key]
	if f != nil {
		fmt.Println(key)
		e := f(w, req)
		return e
	} else {
		static.Response(w, req)
	}
	return nil
}

// 添加路由
func AddHH(key string, handler HttpHandler) {
	defer func() {
		if p := recover(); p != nil {
			// fmt.Println(p)
			logger.Error(p.(string))
		}
	}()
	f := httpHandlers[key]
	if f == nil {
		panic(fmt.Sprintf("Have the same handler of '%s'", key))
	}
	httpHandlers[key] = handler
}

// 获取前端接口
func getClientInterface(req *http.Request) (string, error) {
	u, e := url.Parse(req.RequestURI)
	if e != nil {
		return "", e
	}
	at := req.Form["@"]
	key := ""
	if at != nil {
		key = "@" + at[0]
	}
	return u.Path + key, nil
}

// 打印 http.Request.Form
func rangeFromValues(req *http.Request) {
	for key, value := range req.Form {

		for i, el := range value {
			fmt.Println(key, i, el)
		}
	}
}
