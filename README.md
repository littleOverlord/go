# GO
这是一个学习golang的项目
## PATH
### windows
#### 1. 配置 系统环境变量的 Path
比如你的GO安装路径是C:\Go, 则把C:\Go\bin添加到Path中;<br />
接下来我们在windows每个路径下面，都可以用CMD命令行直接运行Go命令

#### 2. 配置 GOPATH
GOPATH用于运行时默认寻找Go依赖包的地址；<br />
开发项目目录为：D:\work\project1;<br />
引入第三方包目录为: D:work\plugin;<br />
GOPATH = D:work\plugin;D:\work\project1;

#### 3. 配置 GOROOT
就是Go的根路径C:\Go\，类似Java_home
### linux
vim ~/.bashrc<br />
or <br />
vim ~/.bash_profile<br />
添加<br />
export GOROOT=/usr/local/go<br />
export GOPATH=/home/go_demo<br />
export PATH=$PATH:$GOROOT/bin<br />
<br />
source ~/.bash_profile 立即生效
## 工程结构
一个GO工程中主要包含以下三个目录：

src：源代码文件

pkg：包文件

bin：相关bin文件

## 使用go.mod
参考：https://juejin.im/post/5c8e503a6fb9a070d878184a

1. 使用 `go mod init 模块名` 初始化go.mod
2. 运行go项目将会自动分析依赖，并下载，不需要自己go get
依赖下载到$GOPATH/pkg/mod目录下，这样所有使用 go mod 的项目都可以共用。

*注* `go mod tidy`: 在项目根目录下执行该命令，go mod 会自动分析你当前项目所需要的依赖，并且将他们下载下来。


## 编译

Mac 下编译 Linux 和 Windows 64位可执行程序

> CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build main.go

> CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build main.go

Linux 下编译 Mac 和 Windows 64位可执行程序

> CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build main.go

> CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build main.go

Windows 下编译 Mac 和 Linux 64位可执行程序

> SET CGO_ENABLED=0
> SET GOOS=darwin
> SET GOARCH=amd64
> go build main.go
 
> SET CGO_ENABLED=0
> SET GOOS=linux
> SET GOARCH=amd64
> go build main.go

GOOS：目标平台的操作系统（darwin、freebsd、linux、windows） 
GOARCH：目标平台的体系架构（386、amd64、arm） 
交叉编译不支持 CGO 所以要禁用它

## 卸载go

> rm -rf /usr/local/go

> rm -rf /etc/paths.d/go

> vim ~/.bash_profile

## 包
### 包导入
1. 相对路径
    import ".model"  //<--是与当前文件同一目录的model目录,但是不建议使用这种方式来导包

2. 绝对路径

    import "shortcut/model" //<--加载gopath/src/shortulr/model模块

3. 包名操作

    `-import(."fmt")`

    这个点操作的含义就是这个包导入之后在你调用这个包的函数时， 你可以省略前缀的包名， 也就是前面你调用的fmt. Println("hello world") 可以省略的写成Println("hello world"),无闻的视频上建议不要使用这样的方式,可读性太差

    `-import(f"fmt")`
    别名操作的话调用包函数时前缀变成了 我们的前缀， 即`f.Println("hello world")`,个人不喜欢这种方式,好好的系统包调用名字你给改了,其他人读代码多不爽

    ```
    -import (
    "database/sql"
    _"github.com/ziutek/mymysql/godrv"//<----很重要 感谢天感谢地可算知道这破玩意是啥意思了
    )
    ```
    _操作其实是引入该包，而不直接使用包里面的函数， 而是调用了该包里面的init函数

## 任务

### 日志

    目录：src/ni/logger
    分三类：error info warn
    写入文件名：2019-05-09.error 2019-05-09.info 2019-05-09.warn
    文件内容包括：日期、信息描述、调用堆栈

#### 注意事项
    1、path(包)，路径规则必须按Unix环境为准，需要兼容windows需要filepath.ToSlash( path/filepath )转换
    2、文件写入加锁

### 配置读取

    目录：src/ni/config
    配置类型：.json
    缓存：Table map[string]interface{} key: src目录下的文件路径
    获取：config.Table["app/main/config.json"]

### http(s)服务

    目录：src/ni/server
    http创建成功
    https报错：failed to find certificate PEM data in certificate input, but did find a private key; PEM inputs may have been switched
    似乎是证书有问题，等上传到外网服务器再测试

#### 静态资源
    
    目录：src/ni/static
    默认启用gzip压缩, {".png",".jpg",".gif",...}等压缩率低的资源不参与
    不参与gzip压缩的资源，用http.ServeFile响应请求

#### 路由

    目录：src/ni/router

### websocket服务

    目录：src/ni/websocket
    基于github.com/gorilla/websocket包开发

### mongodb数据库


## 项目依赖

    websocket : github.com/gorilla/websocket
    mongodb : go.mongodb.org/mongo-driver