package main

import (
	
	"ni/config"
	"ni/server"
)

func main() {
	cfg := config.Table["app/main/config.json"].(map[string]interface{})["server"].(map[string]interface{})
	server.Create(cfg)
	select{}
}
