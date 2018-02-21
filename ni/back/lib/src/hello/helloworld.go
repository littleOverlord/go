package hello

import "fmt"

func Say() {
	name := "Michelle"
	fmt.Println("Hello", name)
}

func init(){
	fmt.Println("Init Hello!!")
}