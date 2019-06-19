package wx

import (
	"ni/config"
)

var wxCfg = make(map[string]*wxProject)

type wxProject struct {
	appID     string
	appSecret string
}

func init() {
	initCfg()
	// regist ws(s) handlers
	port()
}

func initCfg() {
	cfg := config.Table["app/main/config.json"].(map[string]interface{})["wx"].(map[string]interface{})
	for k, v := range cfg {
		wxCfg[k] = &wxProject{appID: v.(map[string]string)["appID"], appSecret: v.(map[string]string)["appSecret"]}
	}
}
