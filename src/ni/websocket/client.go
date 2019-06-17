//Package websocket Copyright 2019 tdd authors
package websocket

import (
	"encoding/json"
	"fmt"
	"time"
	"sync"

	"github.com/gorilla/websocket"

	"ni/logger"
)

// Clients is all logined client cache list
var Clients = &struct {
	caches map[int]*Client
	mux sync.Mutex
}{
	caches : make(map[int]*Client),
}
// SendMany is send message to many clients
func SendMany(uids []int, text string){
	Clients.mux.Lock()
	for _,v := range uids{
		c,ok := Clients.caches[v]
		if ok {
			c.sendMessage(&ClientMessage{
				Mid : 0,
				Face: "",
				Data: "",
			},text)
		}
	}
	Clients.mux.Unlock()
}

// AddClientToCache is add one client to cache
func AddClientToCache(uid int, c *Client){
	Clients.mux.Lock()
	Clients.caches[uid] = c
	Clients.mux.Unlock()
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte

	// user id
	uid int
}

// ClientMessage is from client
// mid is the message id of single client
// face is the interface of server, like "app/player@login"
// data is the message body
type ClientMessage struct {
	Mid  int
	Face string
	Data string
}

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) readPump() {
	defer func() {
		// c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				logger.Error(err.Error())
			}
			break
		}
		fmt.Println(message)
		var data *ClientMessage
		err = json.Unmarshal(message, data)
		if err != nil {
			logger.Error(fmt.Sprintf(`ws JSON Unmarshal failed: %s`, err.Error()))
		} else {
			callHandler(data, c)
		}
	}
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
// send message to single client
func (c *Client) sendMessage(o *ClientMessage, text string) {
	message := []byte(fmt.Sprintf(`{"mid":%d,"data":%s}`, o.Mid, text))
	c.send <- message
}
