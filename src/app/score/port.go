package score

import (
	"ni/websocket"
)

func port() {
	/**
	return
	{
		"history":0,历史最高纪录
		"phase":0 当前有效最高纪录
	}
	**/
	websocket.RegistHandler("app/score@read", readScore)
	/**
	accept
	{
		score:0
	}
	**/
	websocket.RegistHandler("app/score@add", addScore)
	websocket.RegistHandler("app/score@rank", readRank)
}
