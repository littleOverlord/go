package main

import (
	"fmt"
)

func main() {
	var a = []int{1, 3, 4, 5, 3, 2, 67, 8, 85, 4, 5}
	fmt.Println(3 / 2)
	temp := sliceInsert(a, 0, 400)
	// a = append(temp, a[0:]...)
	fmt.Println(temp)
	a = a[:5]
	fmt.Println(len(a))
	a = append(a, 10)
	fmt.Println(a[5])

	var m = make(map[string]interface{})
	i := m["i"]
	fmt.Println(i)
}
func sliceInsert(s []int, i int, el int) []int {

	n := []int{el}
	start := append([]int{}, s[0:i]...)
	end := s[i:]
	start = append(start, n...)
	end = append(start, end...)
	return end
}
