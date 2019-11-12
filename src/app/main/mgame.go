package main

import (
	_ "mgame-go/ni/server"
	_ "mgame-go/ni/websocket"

	_ "mgame-go/app/score"
	_ "mgame-go/app/user"
	_ "mgame-go/app/wx"
	_ "mgame-go/app/xhb"
)

func main() {
	// cfg := config.Table["app/main/config.json"].(map[string]interface{})["server"].(map[string]interface{})
	// server.Create(cfg)
	select {}
}
