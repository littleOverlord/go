package main
import (
	"fmt"
)

type TZ int
type Rope string
/**
整数：
int8（-128 -> 127）
int16（-32768 -> 32767）
int32（-2,147,483,648 -> 2,147,483,647）
int64（-9,223,372,036,854,775,808 -> 9,223,372,036,854,775,807）

无符号整数：
uint8（0 -> 255）
uint16（0 -> 65,535）
uint32（0 -> 4,294,967,295）
uint64（0 -> 18,446,744,073,709,551,615）

浮点型（IEEE-754 标准）：
float32（+- 1e-45 -> +- 3.4 * 1e38）
float64（+- 5 * 1e-324 -> 107 * 1e308）

复数类型：
complex64 (32 位实数和虚数)
complex128 (64 位实数和虚数)

byte 类型是 uint8 的别名
rune 类型是 int32 的别名
*******************************************************************
类型别名得到的新类型并非和原类型完全相同，新类型不会拥有原类型所附带的方法
*******************************************************************
**/
func main(){
	var a, b TZ = 3,4
	c := a + b;
	fmt.Printf("c has the value: %d\n",c)
	var d Rope = "I'm a string!"
	fmt.Printf("d has the vaue: %s\n",d)
	var c1 complex64 = 5 + 10i
	fmt.Printf("The value is: %v\n", c1)
	fmt.Printf("The real of c1 is: %f\n", real(c1))
	fmt.Printf("The imaginary of c1 is: %f\n", imag(c1))
}