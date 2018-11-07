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
	for_test()
	fmt.Println()
	rect()
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

/**
测试 for循环内赋值
**/
func for_test(){
	for i := 0; i < 5; i++{
		var v int
		fmt.Printf("%d",v)
		v = 5
	}
	// for i := 0; ; i++{
		// fmt.Println("Value of i is now: ", i)
	// }
	// for i := 0; i < 3;{
	// 	fmt.Println("Value of i: ",i)
	// }

	s := ""
	for ; s != "aaaaa";{
		fmt.Println("Value of s: ",s)
		s = s + "a"
	}

	for i, j, s := 0, 5, "a"; i < 3 && j < 100 && s != "aaaaa"; 
		i, j, s = i + 1, j + 1, s + "a"{
			fmt.Println("Value of i , j, s : ",i ,j ,s)
	}

	i := 0
	for { //since there are no checks, this is an infinite loop
		if i >= 3 { break }
		//break out of this for loop when this condition is met
		fmt.Println("Value of i is:", i)
		i++
	}
	fmt.Println("A statement just after for loop.")
	
	for i := 0; i<7 ; i++ {
		if i%2 == 0 { continue }
		fmt.Println("Odd:", i)
	}
}

/**
rectangle stars 20 * 10
**/
func rect(){
	w, h := 20, 10
	for x := 0; x < h; x++ {
		for y := 0; y < w; y++{
			fmt.Printf("*")
		}
		fmt.Println()
	}
}