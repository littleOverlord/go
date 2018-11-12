::
:: 配置
::
set basepath=%~dp0
set basepath=%basepath:back\boot\=%
::数据库数据存放目录
set dbpath=""
::数据库日志存放目录
set logpath=""
::以追加的方式记录日志
set logappend=true
::端口号 默认为29817
set port=29817 
::mongodb所绑定的ip地址
set bind_ip=127.0.0.1 
::检查创建db目录
cd ../
IF EXIST db (
    echo "has been exist dir 'db'"
) ELSE (
    mkdir db
)
set dbpath=%basepath%back\db
:: 检查创建db log目录
if exist log (
    echo "has been exist dir 'log'"
) else (
    mkdir log
)
cd log
if not exist mongodb.log (
    cd.>mongodb.log
)
set logpath=%basepath%back\log\mongodb.log
echo dbpath=%dbpath% logpath=%logpath% port=%port% bind_ip=%bind_ip%
:: 启动mongodb
mongod --dbpath=%dbpath% --logpath=%logpath% --logappend --port=%port% --bind_ip=%bind_ip%
pause