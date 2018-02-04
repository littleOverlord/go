package router

import (
	"net/http"
	"fmt"
)

type Handler func(w http.ResponseWriter, r *http.Request) error

//路由表
var routers = make(map[string]Handler)

//设置路由处理函数
func Set(pattern string, handler Handler) (e error){
	if handler == nil {
		e = fmt.Errorf("router.Set == handle no %s is nil!", pattern)
		return e
	}
	routers[pattern] = handler
	return nil
}

//路由分发
func Distribute(w http.ResponseWriter, r *http.Request) error{
	h := pathMatch(r.URL.Path)
	if h == nil {
		err := fmt.Errorf("%s","router.Distribute == no handle!")
		return err
	}
	return h(w,r)
}

//%%%%%%%%%%%%%%%%%%%%% 本地函数

func pathMatch(p string) Handler{
	h := routers[p]
	if h == nil {
		h = routers[""]
	}
	return h
}