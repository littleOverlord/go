package main

import (
	_ "ni/server"
	_ "ni/websocket"

	_ "app/wx"
)

func main() {
	// cfg := config.Table["app/main/config.json"].(map[string]interface{})["server"].(map[string]interface{})
	// server.Create(cfg)
	select {}
}
