package router

import (
	"net/http"
	"fmt"
)

type Handler func(w http.ResponseWriter, r *http.Request)

//路由表
var routers = make(map[string]Handler)

//设置路由处理函数
func Set(pattern string, handler Handler) {
	if handler == nil {
		return
	}
	routers[pattern] = handler
}

//路由分发
func Distribute(w http.ResponseWriter, r *http.Request){
	fmt.Print(r.URL.Path)
}

//%%%%%%%%%%%%%%%%%%%%% 本地函数

func pathMatch(p string) (Handler, error){
	h = routers[p]
	if h == nil {
		return nil "no '"+p+"' router handle"
	}
	return h nil
}