<p>本篇博客主要介绍了如何从零开始，使用Go Module作为依赖管理，基于Gin来一步一步搭建Go的Web服务器。并使用Endless来使服务器平滑重启，使用Swagger来自动生成Api文档。</p>
<p>源码在此处：https%3A%2F%2Fgithub.com%2FdetectiveHLH%2Fgo-backend-starter</p>
<p>大家可以先查看源码，然后再根据本篇文章，来了解搭建过程中服务器的一些细节。</p>
<h3>搭建环境</h3>
<p>以下所有的步骤都基于MacOS。</p>
<h4>安装go</h4>
<p>在这里推荐使用homebrew进行安装。当然你也可以使用源码安装。</p>
<pre>
brew install go
</pre>
<p>跑完命令之后，在命令行输入go。如果在命令行看到如下输出，则代表安装成功。</p>
<pre>
Go is a tool for managing Go source code.
Usage:
    go &lt;command&gt; [arguments]
The commands are:
...
...
</pre>
<p>需要注意的是，go的版本需要在1.11之上，否则无法使用go module。以下是我的go的版本。</p>
<pre>
go version
# go version go1.12.5 darwin/amd64
</pre>
<h4>IDE</h4>
<p>推荐使用GoLand(https%3A%2F%2Fwww.jetbrains.com%2Fgo%2F)</p>
<h4>配置GOPATH</h4>
<p>打开GoLand，在GoLand的设置中找到Global GOPATH，将其设置为$HOME/go。$HOME目录就是你的电脑的用户目录，如果该目录下没有go目录的话，也不需要新建，当我们在后面的操作中初始化模块的时候，会自动的在用户目录下新建go目录。</p>
<h4>启用GO Module</h4>
<p>同样，在GoLand中设置中找到Go Modules (vgo)。勾选Enable Go Modules (vgo) integration前的选择框来启用Go Moudle</p>
<h3>搭建项目框架</h3>
<h4>新建目录</h4>
<p>在你常用的工作区新建一个目录，如果你有github的项目，可以直接clone下来。</p>
<h4>初始化go module</h4>
<pre>
go mod init $MODULE_NAME
</pre>
<p>在刚刚新建的项目的根目录下，使用上述命令来初始化go module。该命令会在项目根目录下新建一个go.mod的文件。</p>
<p>如果你的项目是从github上clone下来的，$MODULE_NAME这个参数就不需要了。它会默认为github.com/$GITHUB_USER_NAME/$PROJECT_NAME。</p>
<p>例如本项目就是github.com/detectiveHLH/go-backend-starter；如果是在本地新建的项目，则必须要加上最后一个参数。否则就会遇到如下的错误。</p>
<pre>
go: cannot determine module path for source directory /Users/hulunhao/Projects/go/test/src (outside GOPATH, no import comments)
</pre>
<p>初始化完成之后的go.mod文件内容如下。</p>
<pre>
module github.com/detectiveHLH/go-backend-starter

go 1.12
</pre>
<h4>新建main.go</h4>
<p>在项目的根目录下新建main.go。代码如下。</p>
<pre>
package main

import (
    "fmt"
)

func main() {
    fmt.Println("This works")
}
</pre>
<h4>运行main.go</h4>
<p>在根目录下使用go run main.go，如果看到命令行中输出This works则代表基础的框架已经搭建完成。接下来我们开始将Gin引入框架。</p>
<h3>引入Gin</h3>
<p>Gin(https%3A%2F%2Fgin-gonic.com%2F)是一个用Go实现的HTTP Web框架，我们使用Gin来作为starter的Base Framework。</p>
<h4>安装Gin</h4>
<p>直接通过go get命令来安装</p>
<pre>
go get github.com/gin-gonic/gin
</pre>
<p>安装成功之后，我们可以看到go.mod文件中的内容发生了变化。</p>
<p>并且，我们在设定的GOPATH下，并没有看到刚刚安装的依赖。实际上，依赖安装到了$GOPATH/pkg/mod下。</p>
<pre>
module github.com/detectiveHLH/go-backend-starter

go 1.12

require github.com/gin-gonic/gin v1.4.0 // indirect
</pre>
<p>同时，也生成了一个go.sum文件。内容如下。</p>
<pre>
github.com/davecgh/go-spew v1.1.0/go.mod h1:J7Y8YcW2NihsgmVo/mv3lAwl/skON4iLHjSsI+c5H38=
github.com/gin-contrib/sse v0.0.0-20190301062529-5545eab6dad3 h1:t8FVkw33L+wilf2QiWkw0UV77qRpcH/JHPKGpKa2E8g=
github.com/gin-contrib/sse v0.0.0-20190301062529-5545eab6dad3/go.mod h1:VJ0WA2NBN22VlZ2dKZQPAPnyWw5XTlK1KymzLKsr59s=
github.com/gin-gonic/gin v1.4.0 h1:3tMoCCfM7ppqsR0ptz/wi1impNpT7/9wQtMZ8lr1mCQ=
github.com/gin-gonic/gin v1.4.0/go.mod h1:OW2EZn3DO8Ln9oIKOvM++LBO+5UPHJJDH72/q/3rZdM=
github.com/golang/protobuf v1.3.1 h1:YF8+flBXS5eO826T4nzqPrxfhQThhXl0YzfuUPu4SBg=
github.com/golang/protobuf v1.3.1/go.mod h1:6lQm79b+lXiMfvg/cZm0SGofjICqVBUtrP5yJMmIC1U=
github.com/json-iterator/go v1.1.6/go.mod h1:+SdeFBvtyEkXs7REEP0seUULqWtbJapLOCVDaaPEHmU=
github.com/mattn/go-isatty v0.0.7 h1:UvyT9uN+3r7yLEYSlJsbQGdsaB/a0DlgWP3pql6iwOc=
github.com/mattn/go-isatty v0.0.7/go.mod h1:Iq45c/XA43vh69/j3iqttzPXn0bhXyGjM0Hdxcsrc5s=
github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd/go.mod h1:6dJC0mAP4ikYIbvyc7fijjWJddQyLn8Ig3JB5CqoB9Q=
github.com/modern-go/reflect2 v1.0.1/go.mod h1:bx2lNnkwVCuqBIxFjflWJWanXIb3RllmbCylyMrvgv0=
github.com/pmezard/go-difflib v1.0.0/go.mod h1:iKH77koFhYxTK1pcRnkKkqfTogsbg7gZNVY4sRDYZ/4=
github.com/stretchr/objx v0.1.0/go.mod h1:HFkY916IF+rwdDfMAkV7OtwuqBVzrE8GR6GFx+wExME=
github.com/stretchr/testify v1.3.0/go.mod h1:M5WIy9Dh21IEIfnGCwXGc5bZfKNJtfHm1UVUgZn+9EI=
github.com/ugorji/go v1.1.4 h1:j4s+tAvLfL3bZyefP2SEWmhBzmuIlH/eqNuPdFPgngw=
github.com/ugorji/go v1.1.4/go.mod h1:uQMGLiO92mf5W77hV/PUCpI3pbzQx3CRekS0kk+RGrc=
golang.org/x/crypto v0.0.0-20190308221718-c2843e01d9a2/go.mod h1:djNgcEr1/C05ACkg1iLfiJU5Ep61QUkGW8qpdssI0+w=
golang.org/x/net v0.0.0-20190503192946-f4e77d36d62c/go.mod h1:t9HGtf8HONx5eT2rtn7q6eTqICYqUVnKs3thJo3Qplg=
golang.org/x/sys v0.0.0-20190215142949-d0b11bdaac8a/go.mod h1:STP8DvDyc/dI5b8T5hshtkjS+E42TnysNCUPdjciGhY=
golang.org/x/sys v0.0.0-20190222072716-a9d3bda3a223/go.mod h1:STP8DvDyc/dI5b8T5hshtkjS+E42TnysNCUPdjciGhY=
golang.org/x/text v0.3.0/go.mod h1:NqM8EUOU14njkJ3fqMW+pc6Ldnwhi/IjpwHt7yyuwOQ=
gopkg.in/check.v1 v0.0.0-20161208181325-20d25e280405/go.mod h1:Co6ibVJAznAaIkqp8huTwlJQCZ016jof/cbN4VW5Yz0=
gopkg.in/go-playground/assert.v1 v1.2.1/go.mod h1:9RXL0bg/zibRAgZUYszZSwO/z8Y/a8bDuhia5mkpMnE=
gopkg.in/go-playground/validator.v8 v8.18.2 h1:lFB4DoMU6B626w8ny76MV7VX6W2VHct2GVOI3xgiMrQ=
gopkg.in/go-playground/validator.v8 v8.18.2/go.mod h1:RX2a/7Ha8BgOhfk7j780h4/u/RRjR0eouCJSH80/M2Y=
gopkg.in/yaml.v2 v2.2.2 h1:ZCJp+EgiOT7lHqUV2J862kp8Qj64Jo6az82+3Td9dZw=
gopkg.in/yaml.v2 v2.2.2/go.mod h1:hI93XBmqTisBFMUTm0b8Fm+jr3Dg1NNxqwp+5A1VGuI=
</pre>
<p>用过Node的人都知道，在安装完依赖之后会生成一个package-lock.json文件，来锁定依赖的版本。以防止后面重新安装依赖时，安装了新的版本，但是与现有的代码不兼容，这会带来一些不必要的BUG。</p>
<p>但是这个go.sum文件并不是这个作用。我们可以看到go.mod中只记录了一个Gin的依赖，而go.sum中则有非常多。是因为go.mod中只记录了最顶层，就是我们直接使用命令行安装的依赖。但是要知道，一个开源的包通常都会依赖很多其他的依赖包。</p>
<p>而go.sum就是记录所有顶层和其中间接依赖的依赖包的特定版本的文件，为每一个依赖版本生成一个特定的哈希值，从而在一个新环境启用该项目时，可以做到对项目依赖的100%还原。go.sum还会保留一些过去使用过的版本的信息。</p>
<p>在go module下，不需要vendor目录来保证可重现的构建，而是通过go.mod文件来对项目中的每一个依赖进行精确的版本管理。</p>
<p>如果之前的项目用的是vendor，那么重新用go.mod重新编写不太现实。我们可以使用go mod vendor命令将之前项目所有的依赖拷贝到vendor目录下，为了保证兼容性，在vendor目录下的依赖并不像go.mod一样。拷贝之后的目录不包含版本号。</p>
<p>而且通过上面安装gin可以看出，通常情况下，go.mod文件是不需要我们手动编辑的，当我们执行完命令之后，go.mod也会自动的更新相应的依赖和版本号。</p>
<p>下面我们来了解一下go mod的相关命令。</p>
<ul>
    <li>init	初始化go module</li>
    <li>download 下载go.mod中的依赖到本地的缓存目录中（$GOPATH/pkg/mod）下</li>
    <li>edit 编辑go.mod，通过命令行手动升级和获取依赖</li>
    <li>vendor 将项目依赖拷贝到vendor下</li>
    <li>tidy 安装缺少的依赖，舍弃无用的依赖</li>
    <li>graph 打印模块依赖图</li>
    <li>verify 验证依赖是否正确</li>
</ul>
<p>还有一个命令值得提一下，go list -m all可以列出当前项目的构建列表。</p>
<h4>修改main.go</h4>
<p>修改main.go的代码如下。</p>
<pre>
package main

import (
    "fmt"
    "github.com/gin-gonic/gin"
)

func main() {
    fmt.Println("This works.")
    r := gin.Default()
    r.GET("/hello", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "success": true,
            "code": 200,
            "message": "This works",
            "data": nil,
        })
    })
    r.Run()
}
</pre>
<p>上述的代码引入了路由，熟悉Node的应该可以看出，这个与koa-router的用法十分相似。</p>
<h4>启动服务器</h4>
<p>照着上述运行main.go的步骤，运行main.go。就可以在控制台看到如下的输出。</p>
<pre>
This works.
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
    - using env:   export GIN_MODE=release
    - using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /hello                    --> main.main.func1 (3 handlers)
[GIN-debug] Environment variable PORT is undefined. Using port :8080 by default
[GIN-debug] Listening and serving HTTP on :8080
</pre>
<p>此时，服务器已经在8080端口启动了。然后在浏览器中访问http://localhost:8080/hello，就可以看到服务器的正常返回。同时，服务器这边也会打印相应的日志。</p>
<pre>
[GIN] 2019/06/08 - 17:41:34 | 200 |     214.213µs |             ::1 | GET      /hello
</pre>
<h3>构建路由</h3>
<h4>新建路由模块</h4>
<p>在根目录下新建router目录。在router下，新建router.go文件，代码如下。</p>
<pre>
package router

import "github.com/gin-gonic/gin"

func InitRouter() *gin.Engine {
    router := gin.New()
    apiVersionOne := router.Group("/api/v1/")
    apiVersionOne.GET("hello", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "success": true,
            "code": 200,
            "message": "This works",
            "data": nil,
        })
    })
    return router
}
</pre>
<p>在这个文件中，导出了一个InitRouter函数，该函数返回gin.Engine类型。该函数还定义了一个路由为/api/v1/hello的GET请求。</p>
<h4>在main函数中引入路由</h4>
<p>将main.go的代码改为如下。</p>
<pre>
package main

import (
    "fmt"
    "github.com/detectiveHLH/go-backend-starter/router"
)

func main() {
    r := router.InitRouter()
    r.Run()
}
</pre>
<p>然后运行main.go，启动之后，访问http://localhost:8080/api/v1/hello，可以看到，与之前访问/hello路由的结果是一样的。</p>
<p>到此为止，我们已经拥有了一个拥有简单功能的Web服务器。那么问题来了，这样的一个开放的服务器，只要知道了地址，你的服务器就知道暴露给其他人了。这样会带来一些安全隐患。所以我们需要给接口加上鉴权，只有通过认证的调用方，才有权限调用服务器接口。所以接下来，我们需要引入JWT。</p>
<h3>引入JWT鉴权</h3>
<p>使用go get命令安装jwt-go依赖。</p>
<pre>
go get github.com/dgrijalva/jwt-go
</pre>
<h4>新建jwt鉴权文件</h4>
<p>在根目录下新建middleware/jwt目录，在jwt目录下新建jwt.go文件，代码如下。</p>
<pre>
package jwt

import (
    "github.com/detectiveHLH/go-backend-starter/consts"
    "github.com/gin-gonic/gin"
    "net/http"
    "time"
)

func Jwt() gin.HandlerFunc {
    return func(c *gin.Context) {
        var code int
        var data interface{}

        code = consts.SUCCESS
        token := c.Query("token")
        if token == "" {
            code = consts.INVALID_PARAMS
        } else {
            claims, err := util.ParseToken(token)
            if err != nil {
                code = consts.ERROR_AUTH_CHECK_TOKEN_FAIL
            } else if time.Now().Unix() > claims.ExpiresAt {
                code = consts.ERROR_AUTH_CHECK_TOKEN_TIMEOUT
            }
        }

        if code != consts.SUCCESS {
            c.JSON(http.StatusUnauthorized, gin.H{
                "code": code,
                "msg":  consts.GetMsg(code),
                "data": data,
            })

            c.Abort()
            return
        }

        c.Next()
    }
}
</pre>
<h4>引入常量</h4>
<p>此时，代码中会有错误，是因为我们没有声明consts这个包，其中的变量SUCCESS、INVALID_PARAMS和ERROR_AUTH_CHECK_TOKEN_FAIL是未定义的。根据code获取服务器返回信息的函数GetMsg也没定义。同样没有定义的还有util.ParseToken(token)和claims.ExpiresAt。所以我们要新建consts包。我们在根目录下新建consts目录，并且在consts目录下新建code.go，将定义好的一些常量引进去，代码如下。</p>
<h4>新建const文件</h4>
<pre>
const (
    SUCCESS        = 200
    ERROR          = 500
    INVALID_PARAMS = 400
)
</pre>
<h4>新建message文件</h4>
<p>再新建message.go文件，代码如下。</p>
<pre>
var MsgFlags = map[int]string{
    SUCCESS:                         "ok",
    ERROR:                           "fail",
    INVALID_PARAMS:                  "请求参数错误",
}

func GetMsg(code int) string {
    msg, ok := MsgFlags[code]
    if ok {
        return msg
    }
    return MsgFlags[ERROR]
}
</pre>
<h4>新建util</h4>
<p>在根目录下新建util，并且在util下新建jwt.go，代码如下。</p>
<pre>
package util

import (
    "github.com/dgrijalva/jwt-go"
    "time"
)

var jwtSecret = []byte(setting.AppSetting.JwtSecret)

type Claims struct {
    Username string `json:"username"`
    Password string `json:"password"`
    jwt.StandardClaims
}

func GenerateToken(username, password string) (string, error) {
    nowTime := time.Now()
    expireTime := nowTime.Add(3 * time.Hour)
    claims := Claims{
        username,
        password,
        jwt.StandardClaims {
            ExpiresAt : expireTime.Unix(),
            Issuer : "go-backend-starter",
        },
    }
    tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    token, err := tokenClaims.SignedString(jwtSecret)

    return token, err
}

func ParseToken(token string) (*Claims, error) {
    tokenClaims, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
        return jwtSecret, nil
    })
    if tokenClaims != nil {
        if claims, ok := tokenClaims.Claims.(*Claims); ok && tokenClaims.Valid {
            return claims, nil
        }
    }

    return nil, err
}
</pre>
<h4>新建setting包</h4>
<p>在上面的util中，setting包并没有定义，所以在这个步骤中我们需要定义setting包。</p>
<p>使用go get命令安装依赖。</p>
<pre>
go get gopkg.in/ini.v1
</pre>
<p>在项目根目录下新建setting目录，并在setting目录下新建setting.go文件，代码如下。</p>
<pre>
package setting

import (
    "gopkg.in/ini.v1"
    "log"
)

type App struct {
    JwtSecret string
}
type Server struct {
    Ip   string
    Port string
}
type Database struct {
    Type        string
    User        string
    Password    string
    Host        string
    Name        string
    TablePrefix string
}

var AppSetting = &App{}
var ServerSetting = &Server{}
var DatabaseSetting = &Database{}
var config *ini.File

func Setup() {
    var err error
    config, err = ini.Load("config/app.ini")
    if err != nil {
        log.Fatal("Fail to parse 'config/app.ini': %v", err)
    }
    mapTo("app", AppSetting)
    mapTo("server", ServerSetting)
    mapTo("database", DatabaseSetting)
}

func mapTo(section string, v interface{}) {
    err := config.Section(section).MapTo(v)
    if err != nil {
        log.Fatalf("Cfg.MapTo RedisSetting err: %v", err)
    }
}
</pre>
<h4>新建配置文件</h4>
<p>在项目根目录下新建config目录，并新建app.ini文件，内容如下。</p>
<pre>
[app]
JwtSecret = 233
[server]
Ip : localhost
Port : 8000
Url : 127.0.0.1:27017
[database]
Type = mysql
User = $YOUR_USERNAME
Password = $YOUR_PASSWORD
Host = 127.0.0.1:3306
Name = golang_test
TablePrefix = golang_test_
</pre>
<h4>实现登录接口</h4>
<p><b>新增登录接口</b></p>
<p>到此为止，通过jwt token进行鉴权的逻辑已经全部完成，剩下的就需要实现登录接口来将token在用户登录成功之后返回给用户。</p>
<p>使用go get命令安装依赖。</p>
<pre>
go get github.com/astaxie/beego/validation
</pre>
<p>在router下新建login.go，代码如下。</p>
<pre>
package router

import (
    "github.com/astaxie/beego/validation"
    "github.com/detectiveHLH/go-backend-starter/consts"
    "github.com/detectiveHLH/go-backend-starter/util"
    "github.com/gin-gonic/gin"
    "net/http"
)

type auth struct {
    Username string `valid:"Required; MaxSize(50)"`
    Password string `valid:"Required; MaxSize(50)"`
}


func Login(c *gin.Context) {
    appG := util.Gin{C: c}
    valid := validation.Validation{}
    username := c.Query("username")
    password := c.Query("password")

    a := auth{Username: username, Password: password}
    ok, _ := valid.Valid(&a)
    if !ok {
        appG.Response(http.StatusOK, consts.INVALID_PARAMS, nil)
        return
    }

    authService := authentication.Auth{Username: username, Password: password}
    isExist, err := authService.Check()
    if err != nil {
        appG.Response(http.StatusOK, consts.ERROR_AUTH_CHECK_TOKEN_FAIL, nil)
        return
    }

    if !isExist {
        appG.Response(http.StatusOK, consts.ERROR_AUTH, nil)
        return
    }

    token, err := util.GenerateToken(username, password)
    if err != nil {
        appG.Response(http.StatusOK, consts.ERROR_AUTH_TOKEN, nil)
        return
    }

    appG.Response(http.StatusOK, consts.SUCCESS, map[string]string{
        "token": token,
    })
}
</pre>
<p><b>新增返回类</b></p>
<p>在util包下新增response.go文件，代码如下。</p>
<pre>
package util

import (
    "github.com/detectiveHLH/go-backend-starter/consts"
    "github.com/gin-gonic/gin"
)

type Gin struct {
    C *gin.Context
}

func (g *Gin) Response(httpCode, errCode int, data interface{}) {
    g.C.JSON(httpCode, gin.H{
        "code": httpCode,
        "msg":  consts.GetMsg(errCode),
        "data": data,
    })

    return
}
</pre>
<p><b>新增鉴权逻辑</b></p>
<p>除了返回类，login.go中还有关键的鉴权逻辑还没有实现。在根目录下新建service/authentication目录，在该目录下新建auth.go文件，代码如下。</p>
<pre>
package authentication

import "fmt"

type Auth struct {
    Username string
    Password string
}

func (a *Auth) Check() (bool, error) {
    userName := a.Username
    passWord := a.Password
    // todo：实现自己的鉴权逻辑
    fmt.Println(userName, passWord)
    return true, nil
}
</pre>
<p>在此处，需要自己真正的根据业务去实现对用户调用接口的合法性校验。例如，可以根据用户的用户名和密码去数据库做验证。</p>
<h4>修改router.go</h4>
<p>修改router.go中的代码如下。</p>
<pre>
package router

import (
    "github.com/detectiveHLH/go-backend-starter/middleware/jwt"
    "github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
    router := gin.New()

    router.GET("/login", Login)
    apiVersionOne := router.Group("/api/v1/")
    
    apiVersionOne.Use(jwt.Jwt())
    
    apiVersionOne.GET("hello", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "success": true,
            "code": 200,
            "message": "This works",
            "data": nil,
        })
    })
    return router
}
</pre>
<p>可以看到，我们在路由文件中加入了/login接口，并使用了我们自定义的jwt鉴权的中间件。只要是在v1下的路由，请求之前都会先进入jwt中进行鉴权，鉴权通过之后才能继续往下执行。</p>
<h4>运行main.go</h4>
<p>到此，我们使用go run main.go启动服务器，访问http://localhost:8080/api/v1/hello会遇到如下错误。</p>
<pre>
{
    "code": 400,
    "data": null,
    "msg": "请求参数错误"
}
</pre>
<p>这是因为我们加入了鉴权，凡是需要鉴权的接口，都需要带上参数token。而要获取token则必须要先要登录，假设我们的用户名是Tom，密码是123。以此来调用登录接口。</p>
<pre>
http://localhost:8080/login?username=Tom&password=123
</pre>
<p>在浏览器中访问如上的url之后，可以看到返回如下。</p>
<pre>
{
    "code": 200,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbSIsInBhc3N3b3JkIjoiMTIzIiwiZXhwIjoxNTYwMTM5MTE3LCJpc3MiOiJnby1iYWNrZW5kLXN0YXJ0ZXIifQ.I-RSi-xVV1Tk_2iBWolF1u94Y7oVBQXnHh6OI2YKJ6U"
    },
    "msg": "ok"
}
</pre>
<p>有了token之后，我们再调用hello接口，可以看到数据正常的返回了。</p>
<pre>
http://localhost:8080/api/v1/hello?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbSIsInBhc3N3b3JkIjoiMTIzIiwiZXhwIjoxNTYwMTM5MTE3LCJpc3MiOiJnby1iYWNrZW5kLXN0YXJ0ZXIifQ.I-RSi-xVV1Tk_2iBWolF1u94Y7oVBQXnHh6OI2YKJ6U
</pre>
<p>一般的处理方法是，前端拿到这个token，利用持久化存储存下来，然后之后的每次请求都将token写在header中发给后端。后端先通过header中的token来校验调用接口的合法性，验证通过之后才进行真正的接口调用。</p>
<p>而在这我将token写在了request param中，只是为了做一个例子来展示。</p>
<h3>引入swagger</h3>
<p>完成了基本的框架之后，我们就开始为接口引入swagger文档。写过java的同学应该对swagger不陌生。往常写API文档，都是手写。即每个接口的每一个参数，都需要手打。</p>
<p>而swagger不一样，swagger只需要你在接口上打上几个注解（Java中的操作），就可以自动为你生成swagger文档。而在go中，我们是通过注释的方式来实现的，接下来我们安装gin-swagger(https%3A%2F%2Fgithub.com%2Fswaggo%2Fgin-swagger)。</p>
<h4>安装依赖</h4>
<pre>
go get github.com/swaggo/gin-swagger
go get -u github.com/swaggo/gin-swagger/swaggerFiles
go get -u github.com/swaggo/swag/cmd/swag
go get github.com/ugorji/go/codec
go get github.com/alecthomas/template
</pre>
<h4>在router中注入swagger</h4>
<p>引入依赖之后，我们需要在router/router.go中注入swagger。在import中加入_ "github.com/detectiveHLH/go-backend-starter/docs"。</p>
<p>并在router := gin.New()之后加入如下代码。</p>
<pre>
router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
</pre>
<h4>为接口编写swagger注释</h4>
<p>在router/login.go中的Login函数上方加上如下注释。</p>
<pre>
// @Summary 登录
// @Produce  json
// @Param username query string true "username"
// @Param password query string true "password"
// @Success 200 {string} json "{"code":200,"data":{},"msg":"ok"}"
// @Router /login [get]
</pre>
<h4>初始化swagger</h4>
<p>在项目根目录下使用swag init命令来初始化swagger文档。该命令将会在项目根目录生成docs目，内容如下。</p>
<pre>
.
├── docs.go
├── swagger.json
└── swagger.yaml
</pre>
<h4>查看swagger文档</h4>
<p>运行main.go，然后在浏览器访问http://localhost:8080/swagger/index.html就可以看到swagger根据注释自动生成的API文档了。</p>
<h3>引入Endless</h3>
<h4>安装Endless</h4>
<pre>
go get github.com/fvbock/endless
</pre>
<h4>修改main.go</h4>
<pre>
package main

import (
    "fmt"
    "github.com/detectiveHLH/go-backend-starter/router"
    "github.com/fvbock/endless"
    "log"
    "syscall"
)

func main() {
    r := router.InitRouter()

    address := fmt.Sprintf("%s:%s", setting.ServerSetting.Ip, setting.ServerSetting.Port)
    server := endless.NewServer(address, r)
    server.BeforeBegin = func(add string) {
        log.Printf("Actual pid is %d", syscall.Getpid())
    }

    err := server.ListenAndServe()
    if err != nil {
        log.Printf("Server err: %v", err)
    }
}
</pre>
<h3>写在后面</h3>
<p>对比起没有go module的依赖管理，现在的go module更像是Node.js中的package.json，也像是Java中的pom.xml，唯一不同的是pom.xml需要手动更新。</p>
<p>当我们拿到有go module项目的时候，不用担心下来依赖时，因为版本问题可能导致的一些兼容问题。直接使用go mod中的命令就可以将制定了版本的依赖全部安装，其效果类似于Node.js中的npm install。</p>
<p>go module定位module的方式，与Node.js寻找依赖的逻辑一样，Node会从当前命令执行的目录开始，依次向上查找node_modules中是否有这个依赖，直到找到。go则是依次向上查找go.mod文件，来定位一个模块。</p>
<p>相信之后go之后的依赖管理，会越来越好。</p>

