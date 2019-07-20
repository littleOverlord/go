package score

import (
	"ni/websocket"
)

func port() {
	websocket.RegistHandler("app/score@read", readScore)
	websocket.RegistHandler("app/score@add", addScore)
	websocket.RegistHandler("app/score@rank", readRank)
}
