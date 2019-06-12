// Copyright 2019 tdd authors
package websocket

import (
	"fmt"
	"ni/config"
	"ni/server"
	"testing"
	_ "testing"
)

func TestCreate(t *testing.T) {
	cfg := config.Table["app/main/config.json"].(map[string]interface{})["server"].(map[string]interface{})
	serverStart(cfg)
}

// ServerStart create websocket and http server
func serverStart(cfg map[string]interface{}) {
	fmt.Println("ws")
	go func(c map[string]interface{}) {
		server.Create(c)
	}(cfg)
	fmt.Println("wss")
	Create(cfg)
	select {}
}
