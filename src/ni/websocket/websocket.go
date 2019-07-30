//Package websocket Copyright 2019 tdd authors
package websocket

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"

	"ni/config"
	"ni/logger"
	"ni/server"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 63 * 1024
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// 允许跨域
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func init() {
	cfg := config.Table["app/main/config.json"].(map[string]interface{})["server"].(map[string]interface{})
	Create(cfg)
}

// serveWs handles websocket requests from the peer.
func serveWs(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("socket start!")
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.Error(err.Error())
		return
	}
	client := &Client{conn: conn, send: make(chan []byte, 256), uid: 0}
	// client.hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}

// Create create websocket server
func Create(cfg map[string]interface{}) {
	go func(c map[string]interface{}) {
		server.CreateSingle("ws", c, serveWs)
	}(cfg)
	go func(c map[string]interface{}) {
		server.CreateSingle("wss", c, serveWs)
	}(cfg)
}
