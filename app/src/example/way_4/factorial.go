package main
import (
	"fmt"
)

func main(){
	fmt.Printf("32 bit = %d\n",factorial(20))
	fmt.Printf("factorial 24 = %d\n",factorial(20))
}

func factorial(n int) int{
	if n == 0 {
		return 1
	}
	return n * factorial(n - 1)
}