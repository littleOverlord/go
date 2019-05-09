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
### ubuntu
vim ~/.bashrc
or 
vim ~/.bash_profile
添加
export GOROOT=/usr/local/go
export GOPATH=/home/taoyx/program_develop/go_demo
export PATH=$PATH:$GOPATH:/usr/local/go/bin

source ~/.bash_profile 立即生效
## 工程结构
一个GO工程中主要包含以下三个目录：

src：源代码文件

pkg：包文件

bin：相关bin文件

## 包
### 包导入
+相对路径
import ".model"  //<--是与当前文件同一目录的model目录,但是不建议使用这种方式来导包

+绝对路径
import "shortcut/model" //<--加载gopath/src/shortulr/model模块

+包名操作
-import(."fmt")
这个点操作的含义就是这个包导入之后在你调用这个包的函数时， 你可以省略前缀的包名， 也就是前面你调用的fmt. Println("hello world") 可以省略的写成Println("hello world"),无闻的视频上建议不要使用这样的方式,可读性太差

-import(f"fmt")
别名操作的话调用包函数时前缀变成了 我们的前缀， 即f.Println("hello world"),个人不喜欢这种方式,好好的系统包调用名字你给改了,其他人读代码多不爽

-import (
"database/sql"
_"github.com/ziutek/mymysql/godrv"//<----很重要 感谢天感谢地可算知道这破玩意是啥意思了
)
_操作其实是引入该包，而不直接使用包里面的函数， 而是调用了该包里面的init函数

## 任务

### 日志

    分三类：error info warn
    写入文件名：2019-05-09.error 2019-05-09.info 2019-05-09.warn
    文件内容包括：日期、信息描述、调用堆栈

### 配置读取

### http服务

### websocket服务

### mongodb数据库