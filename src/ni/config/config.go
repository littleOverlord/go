//Package config cache all ".json" config
package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path"

	"mgame-go/ni/util"
)

//Table 配置缓存表
var Table = make(map[string]interface{})

// 源码目录
var srcAbs string

// Load is start load all ".json" config files in app dir
func init() {
	defer func() {
		if p := recover(); p != nil {
			fmt.Println(p)
		}
	}()
	srcAbs = srcPath()
	loadConfig("app")
	// fmt.Println(Table)
}

// 读取某个目录下的json
func loadConfig(rd string) {
	absDir := path.Join(srcAbs, rd)

	dir, err := os.Open(absDir)
	if err != nil {
		panic("loadConfig os.Open error : " + err.Error())
	}
	defer dir.Close()

	files, err := dir.Readdir(-1)
	if err != nil {
		panic("loadConfig Readdir error : " + err.Error())
	}
	// fmt.Println(len(files))
	for _, file := range files {
		// fmt.Println(file.Name())
		if util.IsDir(path.Join(absDir, file.Name())) {
			loadConfig(path.Join(rd, file.Name()))
		} else if path.Ext(file.Name()) == ".json" {
			var conf interface{}
			err = parseJSON(path.Join(absDir, file.Name()), &conf)
			if err != nil {
				panic("loadConfig parseJSON error : " + err.Error())
			}
			// fmt.Println(path.Join(rd, file.Name()), Table[path.Join(rd, file.Name())])
			Table[path.Join(rd, file.Name())] = conf
		}
	}

}

// 获取src绝对路径
func srcPath() string {
	_path := path.Join(util.WorkSpace, "src")
	return _path
}

// 读取文件并解析
func parseJSON(p string, c interface{}) error {
	file, err := os.Open(p)
	if err != nil {
		return err
	}
	defer file.Close()
	content, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}

	err = json.Unmarshal(content, c)
	if err != nil {
		return err
	}
	return nil
}
