package main
import (
	"fmt"
	"runtime"
	"os"
)
func main()  {
	var goos string = runtime.GOOS
	fmt.Printf("The operating system is: %s\n", goos)
	path := os.Getenv("GOPATH")
	fmt.Printf("goPath is %s\n", path)
	//4.4.3
	console()
	//4.4.4 
	vartest()
	//4.5.2
	bitOperation()
}

// console
func console(){
	//func Printf(format string, list of variables to be printed)
	//%s string; %v default type change;
	/**
	*	在格式化字符串里，%d 用于格式化整数（%x 和 %X 用于格式化 16 进制表示的数字），%g 用于格式化浮点型（%f 输出浮点数，%e 输出科学计数表示法），%0d 用于规定输出定长的整数，其中开头的数字 0 是必须的。
	*	%n.mg 用于表示数字 n 并精确到小数点后 m 位，除了使用 g 之外，还可以使用 e 或者 f，例如：使用格式化字符串 %5.2e 来输出 3.4 的结果为 3.40e+00。
	*	%v 用于表示复数 var c1 complex64 = 5 + 10i;fmt.Printf("The value is: %v", c1) -> 5 + 10i
	**/
	fmt.Printf("test Printf with a string: %s\n","like this!!")// test Printf with a string: like this!!
	s := fmt.Sprintf("test Sprintf with a string: %s\n","like this!") //
	fmt.Print("print s == ",s);// print s == test Sprintf with a string: like this!
}

// var
func vartest(){
	var a,b = "a","b"
	//并行或同时赋值
	a,b = b,a
	fmt.Print("a == ",a,"b == ",b,"\n")
}
// 位操作
func bitOperation(){
	type ByteSize float64
	const(
		_ = iota //通过赋值给空白标识符来忽略值
		KB ByteSize = 1 << (10*iota)
		MB
		GB
		TB
		PB
		EB
		ZB
		YB
	)
	fmt.Print("KB = ",KB,"\nMB = ",MB,"\nGB = ",GB,"\nTB = ",TB,"\nPB = ",PB,"\nEB = ",EB,"\nZB = ",ZB,"\nYB = ",YB,"\n")
	
	type BitFlag int
	const (
		Active BitFlag = 1 << iota // 1 << 0 == 1
		Send // 1 << 1 == 2
		Receive // 1 << 2 == 4
	)

	flag := Active | Send // == 3
	fmt.Print("Active = ",Active,"\nSend = ",Send,"\nReceive = ",Receive,"\nflag = ",flag,"\n") 
}

var AC A
type A struct{Name string}

func (a A)GetName()string{
	return a.Name
}

func (a A)SetName(name string)error{
	a.Name = name
	return nil
}