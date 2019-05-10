// Copyright 2019 tdd authors
package config

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"fmt"
	"path/filepath"

	"ni/logger"
	"ni/util"
)

var Table map[string]interface{}

func init(){
	defer func(){
		if p := recover(); p != nil {
			fmt.Println(p)
        }
	}()
	loadConfig()
}

func loadConfig() {
	appAbs := appPath()

	dir, err := os.Open(appAbs)
	if err != nil {
		panic("loadConfig error : " + err.Error())
	}
	defer dir.Close()

	files, err := dir.Readdir(-1)
	if err != nil {
		beeLogger.Log.Error(err.Error())
	}

	for _, file := range files {
		switch file.Name() {
		case "bee.json":
			{
				err = parseJSON(filepath.Join(currentPath, file.Name()), &Conf)
				if err != nil {
					beeLogger.Log.Errorf("Failed to parse JSON file: %s", err)
				}
				break
			}
		case "Beefile":
			{
				err = parseYAML(filepath.Join(currentPath, file.Name()), &Conf)
				if err != nil {
					beeLogger.Log.Errorf("Failed to parse YAML file: %s", err)
				}
				break
			}
		}
	}

	// Check format version
	if Conf.Version != confVer {
		beeLogger.Log.Warn("Your configuration file is outdated. Please do consider updating it.")
		beeLogger.Log.Hint("Check the latest version of bee's configuration file.")
	}

	// Set variables
	if len(Conf.DirStruct.Controllers) == 0 {
		Conf.DirStruct.Controllers = "controllers"
	}

	if len(Conf.DirStruct.Models) == 0 {
		Conf.DirStruct.Models = "models"
	}
}
// 获取app绝对路径
func appPath() string{
	relAppPath := path.Join("src","app")
	path := path.Join(util.WorkSpace,relAppPath)
	return path
}