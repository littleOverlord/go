package main
import (
	"fmt"
)
var a string
func main()  {
	a = "G"
	fmt.Print(a)
	f1()
}
func f1(){
	a := "O"
	fmt.Print(a)
	f2()
}
func f2(){
	fmt.Print(a,"\n")
}
//GOG