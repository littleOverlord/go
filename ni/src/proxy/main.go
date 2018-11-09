package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

var (
	// 建立域名和目标map
	hostTarget = map[string]string{
        "www.xianquyouxi.com": "http://localhost:8017",
        "www.xianquyouxi.cn": "http://localhost:8017",
        "xianquyouxi.com": "http://localhost:8017",
        "xianquyouxi.cn": "http://localhost:8017",
	}
	// 用于缓存 httputil.ReverseProxy
	hostProxy = make(map[string]*httputil.ReverseProxy)
)

type baseHandle struct{}

func (h *baseHandle) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	host := r.Host
    log.Println("host:", host)
	// 直接从缓存取出
	if fn, ok := hostProxy[host]; ok {
		fn.ServeHTTP(w, r)
		return
	}

	// 检查域名白名单
	if target, ok := hostTarget[host]; ok {
		remoteUrl, err := url.Parse(target)
		if err != nil {
			log.Println("target parse fail:", err)
			return
		}
        log.Println("remoteUrl: ", remoteUrl.Host,remoteUrl.Scheme)
		proxy := httputil.NewSingleHostReverseProxy(remoteUrl)
        hostProxy[host] = proxy // 放入缓存
		proxy.ServeHTTP(w, r)
		return
	}
	w.Write([]byte("403: Host forbidden " + host))
}

func main() {

	h := &baseHandle{}
	http.Handle("/", h)

	server := &http.Server{
		Addr:    ":80",
		Handler: h,
	}
	log.Fatal(server.ListenAndServe())
}