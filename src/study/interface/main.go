package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	var v = "value"
	var i float64 = 1
	changeVV(&v, &i)
	fmt.Printf("%s%f", v, i)
	var str = []byte(`{"mid":1,"face":"app/player@login","data":[12,54]}`)
	var data *ClientMessage
	err := json.Unmarshal(str, &data)
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println(data)
	fmt.Println(data.face)
	// getData(user{Mid: 1, Data: {Uid: 2}})
}

func changeVV(v *string, i *float64) {
	*v = "ever "
	*i = 10
}

type ClientMessage struct {
	mid  int
	face string
	data []byte
}

type ResponseMessage struct {
	Mid int `json:"mid"`
}

type user struct {
	ResponseMessage
	Data struct {
		Uid int `json:"uid"`
	} `json:"data"`
}

func getData(mess *ResponseMessage) {
	fmt.Println(json.Marshal(mess))
}
