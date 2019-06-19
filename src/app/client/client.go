package client

import (
	"ni/mongodb"
)

var uid int

func init() {
	initUid()
	// regist ws(s) handlers
	port()
}

func initUid() {
	col, ctx, cancel := mongodb.Collection("client")
}
