package main

import (
	"encoding/base64"
	"fmt"
)

func main() {
	getJsonValue()
}

func getJsonValue() {
	// str := []byte(`{"type":"app/user@login","mid":1,"arg":"\{"username":"asdfas","pw":"aelkjl;lk;"\}"}`)
	// var data interface{}
	// json.Unmarshal(str, &data)
	// arg, ok := data.(map[string]interface{})["arg"].(string)
	// fmt.Println(arg, ok)
	r, err := base64.StdEncoding.DecodeString("eyJhIjoxLCJiIjoiYXNkZmFzIn0=")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(r))
}
