package main
import (
	"fmt"
)

var i1 = 5

func main(){
	//integer pointer
	fmt.Printf("An integer: %d, it's location in memory: %p\n",i1, &i1)
	var intP *int
	intP = &i1;
	fmt.Printf("%p, %d\n",intP,*intP)
	i2 := *intP
	fmt.Printf("%p, %d\n",&i2, i2)
	fmt.Printf("%p, %p\n",&i1, intP)

	//string pointer
	s := "good bye"
	var sP *string = &s
	*sP = "ciao"
	fmt.Printf("%s %p\n",s, &s)
	fmt.Printf("%s %p\n",s, sP)
	fmt.Printf("%s %p\n",*sP, sP) 

	var p *int
	// p = &i1
	//对一个空指针的反向引用是不合法的，并且会使程序崩溃：
	fmt.Printf("%p %d\n",p,*p)
}
