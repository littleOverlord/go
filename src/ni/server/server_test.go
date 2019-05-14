// Copyright 2019 tdd authors
package server

import (
	"testing"
	"ni/config"
)

func TestCreate(t *testing.T){
	cfg := config.Table["app/main/config.json"].(map[string]interface{})["server"].(map[string]interface{})
	Create(cfg)
}