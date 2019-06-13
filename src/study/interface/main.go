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
}

func changeVV(v *string, i *float64) {
	*v = "ever "
	*i = 10
}

type ClientMessage struct {
	Mid  int    `json:"mid"`
	Face string `json:"face"`
	Data []byte `json:"data"`
}
