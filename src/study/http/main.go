package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"ni/logger"
)

func main() {
	resp, err := http.Get(`http://192.168.31.62:8017/essays/about.tpl`)
	if err != nil {
		// handle error
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		logger.Error(err.Error())
		return
	}
	fmt.Println(string(body))
}
