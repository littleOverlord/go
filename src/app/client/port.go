package client

import (
	"ni/websocket"
)

func port() {
	websocket.RegistHandler("app/client@read", read)
	websocket.RegistHandler("app/client@write", write)
}

func read(message *websocket.ClientMessage, client *websocket.Client) {

}

func write(message *websocket.ClientMessage, client *websocket.Client) {

}
