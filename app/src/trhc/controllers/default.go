package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["Website"] = "trhcmed.com"
	c.Data["Email"] = "tdd_style@163.com"
	c.TplName = "index.tpl"
}