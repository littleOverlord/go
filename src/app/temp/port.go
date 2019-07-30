package temp

import (
	"fmt"
	"ni/websocket"
	"time"
)

func port() {
	websocket.RegistHandler("app/client@read", read)
	websocket.RegistHandler("app/client@write", write)
	websocket.RegistHandler("app/client@stime", stime)
}

func read(message *websocket.ClientMessage, client *websocket.Client) error {
	return nil
}

func write(message *websocket.ClientMessage, client *websocket.Client) error {
	return nil
}

func stime(message *websocket.ClientMessage, client *websocket.Client) error {
	t := time.Now().UnixNano() / 1000000
	client.SendMessage(message, fmt.Sprintf(`{"ok":{"stime":%d}}`, t))
	return nil
}
