//Package websocket Copyright 2019 tdd authors
package websocket

import (
	"fmt"
	"ni/logger"
)

var handlers = make(map[string]WsHandler)

//WsHandler is responsing the request of client
type WsHandler func(message *ClientMessage, client *Client) error

//RegistHandler is the way to add handler for any mods
func RegistHandler(face string, handler WsHandler) {
	defer func() {
		if p := recover(); p != nil {
			// fmt.Println(p)
			logger.Error(p.(string))
		}
	}()
	f := handlers[face]
	if f != nil {
		panic(fmt.Sprintf("Have the same handler of '%s'", face))
	}
	handlers[face] = handler
}

// deal the request of client
func callHandler(message *ClientMessage, client *Client) {
	var err error
	defer func() {
		if err != nil {
			logger.Error(err.Error())
		}
	}()
	handler := handlers[message.Type]
	if handler == nil {
		client.SendMessage(message, fmt.Sprintf(`{"err":"Don't match '%s'"}`, message.Type))
		return
	}
	go handler(message, client)
}
