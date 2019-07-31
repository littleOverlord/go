package main

import (
	"encoding/base64"
	"fmt"
	"time"
)

func main() {
	//getJsonValue()
	formTime()
}

func getJsonValue() {
	// str := []byte(`{"type":"app/user@login","mid":1,"arg":"\{"username":"asdfas","pw":"aelkjl;lk;"\}"}`)
	// var data interface{}
	// json.Unmarshal(str, &data)
	// arg, ok := data.(map[string]interface{})["arg"].(string)
	// fmt.Println(arg, ok)
	r, err := base64.StdEncoding.DecodeString("BiANdpdL4M198aB21pscng==")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(r))
}

func formTime() {
	t := time.Now().UnixNano() / 1000000
	fmt.Println(t)
}
