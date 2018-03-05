package main

import (
	"fmt"
	"os"
	"strings"
)

func main(){
	//**** gopl.io/ch1/echo1
	//Echo1 prints its command-line arguments.
	fmt.Println("gopl.io/ch1/echo1 ============= ")
	var s, sep string
	for i := 0;i < len(os.Args);i++{
		s += sep + os.Args[i]
		sep = " "
	}
	fmt.Println(s)

	//**** gopl.io/ch1/echo2
	//Echo2 prints its command-line arguments.
	fmt.Println("gopl.io/ch1/echo2 ============= ")
	s,sep = ""," "
	for i,arg := range os.Args[1:]{
		fmt.Println(i,sep,arg)
	}
	

	//**** gopl.io/ch1/echo3
	//Echo3 prints its command-line arguments.
	
	fmt.Println("gopl.io/ch1/echo3 ============= ")
	fmt.Println(strings.Join(os.Args[1:]," "))
	fmt.Println(os.Args[1:])
}