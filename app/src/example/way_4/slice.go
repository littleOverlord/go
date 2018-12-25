package main
import (
	"fmt"
)

func main(){
	s := make([]byte,5)
	fmt.Printf("len = %d; cap = %d\n",len(s),cap(s))
	s = s[2:4]
	fmt.Printf("len = %d; cap = %d\n",len(s),cap(s))
}
