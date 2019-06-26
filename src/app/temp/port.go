package temp

import (
	"ni/websocket"
)

func port() {
	websocket.RegistHandler("app/client@read", read)
	websocket.RegistHandler("app/client@write", write)
}

func read(message *websocket.ClientMessage, client *websocket.Client) error {
	return nil
}

func write(message *websocket.ClientMessage, client *websocket.Client) error {
	return nil
}
