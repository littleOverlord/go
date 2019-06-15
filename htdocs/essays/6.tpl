<h3>什么是defer</h3>
<p>defer用来声明一个延迟函数，把这个函数放入到一个栈上， 当外部的包含方法return之前，返回参数到调用方法之前调用，也可以说是运行到最外层方法体的"}"时调用。我们经常用他来做一些资源的释放，比如关闭io操作</p>
<pre>
func doSomething(fileName string) {
    file,err := os.Open(fileName)
    if err != nil {
    panic(err)
    }
    defer file.Close()
}
</pre>
<p>defer 可以保证方法可以在外围函数返回之前调用。有点像其他言的 try finally</p>
<pre>
try{
}finally{
}
</pre>
<h3>defer 读写外部变量</h3>
<p>defer声明的函数读写外部变量，和闭包差不多。比如下面的代码</p>
<pre>
func doSomething() {
    v := 10
    defer func() {
        fmt.Println(v)
        v++
        fmt.Println(v)
    }()
    v += 5
}
</pre>
<p>输出为</p>
<pre>
15
16
</pre>
<p>就像闭包一样，如果不是defer函数方法内的变量会向上一层函数访问变量，重新做计算。</p>
<h3>defer 读写命名的返回值</h3>
<p>这个例子中，defer声明的方法，给命名的返回值自增1</p>
<pre>
1 func doSomething() (rev int) {
2     defer func() {
3         rev++
4     }()
5 
6     return 5
7 }
</pre>
<p>第6行的return 相当于</p>
<pre>
return rev = 5
</pre>
<p>defer 声明的匿名函数会在return 之前执行，相当于</p>
<pre>
rev = 5
// 执行defer方法
rev++
//然后return
return
</pre>
<p>所以结果是6<br />
我把代码做一点点修改</p>
<pre>
1 func doSomething() (rev int) {
2     v := 10
3     defer func() {
4         v++
5     }()
6 
7     return v
8 }
</pre>
<p>第7行返回的是局部变量v.  </p>
<pre>
return v 相当于 return rev = v
</pre>
<p>defer 函数里是对局部变量v的操作，所以与返回的rev没有关系。<br />所有执行的结果是：10</p>
<h3>defer 执行顺序</h3>
<p>当有多个defer时执行顺序逆向的，后进先出：</p>
<pre>
func doSomething() {
    defer fmt.Println(1)
    defer fmt.Println(2)
}
</pre>
<p>会先输出2，再输出1</p>
<h3>defer 处理异常</h3>
<p>panic抛出异常后，如果不处理应用程序会崩溃。为了防止程序崩溃，我们可以在defer的函数里使用recover来捕获中异常：</p>
<pre>
func doSomething() {
    defer func() {
        if err := recover(); err != nil {
            fmt.Print(err)
        }
        
    }()

    fmt.Println("Running...")
    panic("run error")
}
</pre>
<p>输出：</p>
<pre>
Running...
run error
</pre>
<p>recover 会捕获panic的异常。我再把代码做一点点修改：</p>
<pre>
func doSomething() {
    defer func() {
        if err := recover(); err != nil {
            fmt.Print(err)
        }
        
    }()

    defer func() {
        panic("defer error")
    }()

    fmt.Println("Running...")
    panic("run error")
}
</pre>
<p>输出结果</p>
<pre>
Running...
defer error
</pre>
<p>因为 recover()只捕获最后一次panic</p>