package score

import (
	"mgame-go/ni/websocket"
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
	/**
	return
	{
		"rank":""||[] 前三名，加自己的前后三名，共10个人
	}
	**/
	websocket.RegistHandler("app/score@rank", readRank)
}
