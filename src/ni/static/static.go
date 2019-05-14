// Copyright 2019 tdd authors
package static

import (
	"fmt"
	"io/ioutil"
	"path"
	"path/filepath"
	"net/http"
	"strings"
	"mime"

	"ni/logger"
	"ni/util"
	"ni/config"
)
// 不应用gzip压缩的文件格式
var noGzipExts = map[string]bool{
	".png": true,
	".jpg": true,
	".gif": true,
}
// 静态资源配置
var staticCfg = map[string]string{
	"dir"    : "",
	"default": "",
}

func init(){
	staticCfg["dir"] = config.Table["app/main/config.json"].(map[string]interface{})["static"].(map[string]interface{})["dir"].(string)
	staticCfg["default"] = config.Table["app/main/config.json"].(map[string]interface{})["static"].(map[string]interface{})["default"].(string)
}

// 静态资源响应
func Response(w http.ResponseWriter, req *http.Request){
	isGzip := gzip(w, req)
	if !isGzip {
		http.ServeFile(w, req, path.Join(util.WorkSpace,staticCfg["dir"],req.URL.Path))
	}
}

// gzip压缩
func gzip(w http.ResponseWriter, req *http.Request) bool{
	_path := path.Join(util.WorkSpace,staticCfg["dir"], req.URL.Path)
	if util.IsDir(_path) {
		_path = path.Join(_path,"index.html")
	}
	ext := filepath.Ext(_path)
	if noGzipExts[ext] || !strings.HasPrefix(req.Header.Get("Accept-Encoding"), "gzip") {
		return false
	}
	// 获取content-type, 默认 "text/plain; charset=utf-8"
	ct := mime.TypeByExtension(ext)
	if ct == "" {
		ct = mime.TypeByExtension(".txt")
	}

	data, err := ioutil.ReadFile(_path)
	if err != nil {
		http.NotFoundHandler().ServeHTTP(w, r)
		// 这里需要日志系统;
		logger.Error()
		return true
	}

	fmt.Println(ext,ct)
	fmt.Println()
	return true
}