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
	//4.4.4 TODO.. 
}

// console
func console(){
	//func Printf(format string, list of variables to be printed)
	//%s string; %v default type change;
	fmt.Printf("test Printf with a string: %s\n","like this!!")// test Printf with a string: like this!!
	s := fmt.Sprintf("test Sprintf with a string: %s\n","like this!") //
	fmt.Print("print s == ",s);// print s == test Sprintf with a string: like this!
}