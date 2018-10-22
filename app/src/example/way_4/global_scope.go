package main
import (
	"fmt"
)
var a = "G"
func main()  {
	n()
	m()
	n()
}
func n(){
	fmt.Print(a)
}
func m(){
	a = "O"
	fmt.Print(a)
}
//GOO