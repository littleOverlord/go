# GO
这是一个学习golang的项目
## PATH
### windows
#### 1. 配置 系统环境变量的 Path
比如你的GO安装路径是C:\Go, 则把C:\Go\bin添加到Path中;
接下来我们在windows每个路径下面，都可以用CMD命令行直接运行Go命令

#### 2. 配置 GOPATH
GOPATH用于运行时默认寻找Go依赖包的地址；
开发项目目录为：D:\work\project1;
引入第三方包目录为: D:work\plugin;
GOPATH = D:work\plugin;D:\work\project1;

#### 3. 配置 GOROOT
就是Go的根路径C:\Go\，类似Java_home

## 工程结构
一个GO工程中主要包含以下三个目录：

src：源代码文件

pkg：包文件

bin：相关bin文件
