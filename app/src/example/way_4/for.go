package main
import (
	"fmt"
)

func main(){
	fmt.Println("for ======================")
	for_loop()
	fmt.Println()
	fmt.Println("goto ======================")
	goto_loop()
	fmt.Println()
}
/**
用标准的for循环
**/
func for_loop() {
	for i := 0;i<15;i++{
		fmt.Printf("%d ",i)
	}
}
/**
使用goto完成类似for的循环
**/
func goto_loop(){
	var i int = 0
	loop: {
		fmt.Printf("%d ",i)
		i++
		if i < 15{
			goto loop
		}
	}
}


