// golang代理 project main.go
package main

import (
    "bytes"
    "fmt"
    // "io"
    "log"
    "net"
    "net/url"
    "strings"
)

func main() {
    log.SetFlags(log.Ltime | log.Lshortfile)
    log.Println()
    //监听1314端口
    s, err := net.Listen("tcp", ":80")
    if err != nil {
        log.Panic(err)
    }
    //接受客户端连接
    for {
        c, err := s.Accept()
        if err != nil {
            log.Panic(err)
        }
        fmt.Printf("%d======\n",1)
        go proxy(c)
    }
}
func proxy(client net.Conn) {
    defer client.Close()

    fmt.Printf("localAddr = %s; RemoteAddr = %s \n",client.LocalAddr(), client.RemoteAddr())
    var b [1024]byte
    n, err := client.Read(b[:])
    if err != nil {
        log.Println(err)
        return
    }
    var methon, host, addr string
    fmt.Sscanf(string(b[:bytes.IndexByte(b[:], '\n')]), "%s%s", &methon, &host)
    u, err := url.Parse(host)
    if err != nil {
        log.Println(err)
        return
    }
    //http代理https流量
    if u.Opaque == "443" {
        addr = u.Scheme + ":" + u.Opaque
    } else {
        if u.Host != "" {
            if strings.Index(u.Host, ":") == -1 {
                addr = u.Host + ":80"
            } else {
                addr = u.Host
            }
        } else {
            addr = u.Path
        }
    }
    fmt.Printf("n = %d\n",n)
    fmt.Printf("Opaque = %s, Scheme = %s, Opaque = %s, Host = %s, Path = %s \n", u.Opaque, u.Scheme, u.Opaque, u.Host, u.Path)
    fmt.Printf("addr = %s\n",addr)
    //连接远程服务器
    // s, err := net.Dial("tcp", addr)
    // if err != nil {
    //     log.Println(err)
    //     return
    // }
    // if methon == "CONNECT" {
    //     fmt.Fprint(client, "HTTP/1.1 200 Connection established\r\nConnection: close\r\n\r\n")
    // } else {
    //     s.Write(b[:n])
    // }
    //进行转发
    // go io.Copy(s, client)
    // io.Copy(client, s)
}