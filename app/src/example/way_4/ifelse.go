package main
import (
	"fmt"
	"runtime"
)

var prompt = "Enter a digit, e.g. 3 "+ "or %s to quit."

//判断操作系统类型
func init(){
	if runtime.GOOS == "windows"{
		prompt = fmt.Sprintf(prompt, "Ctrl+Z, Enter")
	}else{
		prompt = fmt.Sprintf(prompt, "Ctrl+D")
	}
	fmt.Printf("%s\n",prompt)
}

func main(){
	i ,b := testBug(1)
	fmt.Printf("%d %t\n",i,b)
	i ,b = testBug(0)
	fmt.Printf("%d %t\n",i,b)

	shortVar()
}

func testBug(i int)(r int,t bool){
	if i != 0 {
		return i, true
	}else{
		return i, false
	}
}
//条件简短赋值
/**
使用简短方式 := 声明的变量的作用域只存在于 if 结构中（在 if 结构的大括号之间，如果使用 if-else 结构则在 else 代码块中变量也会存在）。
如果变量在 if 结构之前就已经存在，那么在 if 结构中，该变量原来的值会被隐藏
**/
func shortVar(){
	var first int = 10
	var cond int

	if first <= 0 {
		fmt.Printf("first is less than or equal to 0\n")
	}else if first > 0 && first < 5 {
		fmt.Printf("first is between 0 and 5\n")
	}else{
		fmt.Printf("first is 5 or greater\n")
	}
	if cond = 5; cond > 10{
		fmt.Printf("cond is greater than 10\n")
	}else{
		fmt.Printf("cond is not greater than 10\n")
	}
}