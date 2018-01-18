@echo off
@echo 启动本地开发节点
::msg %username% /time:3 /w "正在启动本地开发节点..."
goto continue
:continue
start werl +sbt ns +sub true  -boot start_sasl -config sasl -env ERL_LIBS ../lib -env ERL_MAX_ETS_TABLES 10000 +pc unicode

exit