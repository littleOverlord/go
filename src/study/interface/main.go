package main

import "fmt"

func main() {
	var v = "value"
	var i float64 = 1
	changeVV(&v, &i)
	fmt.Printf("%s%f", v, i)
}

func changeVV(v *string, i *float64) {
	*v = "ever "
	*i = 10
}
