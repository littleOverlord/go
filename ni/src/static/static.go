package static

//%%%%%%%%%%%%%%%%%%%%% 导入
import (
	"router"
	"fmt"
)

//%%%%%%%%%%%%%%%%%%%%% 导出

func main(){
	router.Set()
}

type Handler func(w http.ResponseWriter, r *http.Request) error

//设置路由处理函数
func Set(pattern string, handler Handler) (e error){
	if handler == nil {
		e = fmt.Errorf("router.Set == handle %s is nil!", pattern)
		return e
	}
	routers[pattern] = handler
	return nil
}

//错误信息处理
func ErrorWithJSON(w http.ResponseWriter, message string, code int) {
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	w.Write([]byte(message))
    fmt.Fprintf(w, "{message: %q}", message)
}

//路由分发
func Distribute(w http.ResponseWriter, r *http.Request) error{
	h := pathMatch(r.URL.Path)
	if h == nil {
		err := fmt.Errorf("%s","router.Distribute == no handle!")
		ErrorWithJSON(w,"404 code, not found",404)
		return err
	}
	return h(w,r)
}

//%%%%%%%%%%%%%%%%%%%%% 本地函数

//路由表
var routers = make(map[string]Handler)
//根目录
var root string

//匹配路由处理函数
func pathMatch(p string) Handler{
	h := routers[p]
	if h == nil {
		h = routers[""]
	}
	return h
}

//%%%%%%%%%%%%%%%%%%%%% 立即之行
