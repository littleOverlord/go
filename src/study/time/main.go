package main

import (
	"fmt"
	"time"
)

func main() {
	parseDuration()
}

func monday() int64 {
	now := time.Now()

	offset := int(time.Monday - now.Weekday())
	if offset > 0 {
		offset = -6
	}

	weekStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local).AddDate(0, 0, offset)
	fmt.Println(weekStart.UnixNano() / 1000000)
	return weekStart.UnixNano()
}

func parseDuration() {
	md := monday()
	lt := 7*24*60*60*1000*1000000 - (time.Now().UnixNano() - md)
	d, err := time.ParseDuration(fmt.Sprintf(`%dns`, lt))
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println(d)
}
