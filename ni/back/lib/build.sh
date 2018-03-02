set GOPATH=%GOPATH%;%CD%
go build hello
go install hello
go build main
go install main
pause