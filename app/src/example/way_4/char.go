package main
import (
	"fmt"
	"unicode"
)

func main(){
	var ch int = '\u0041'
	var ch1 byte = 65
	var ch2 int = '\u03B2'
	var ch3 int = '\U00101234'
	var ch4 rune = 65
	fmt.Printf("%d - %d - %d - %d\n",ch,ch1,ch2,ch3)
	fmt.Printf("%c - %c - %c - %c\n",ch,ch1,ch2,ch3)
	fmt.Printf("%x - %x - %x - %x\n",ch,ch1,ch2,ch3)
	fmt.Printf("%U - %U - %U - %U\n",ch,ch1,ch2,ch3)
	fmt.Printf("%t\n",unicode.IsLetter(ch4))//是否为字母
	fmt.Printf("%t\n",unicode.IsDigit(ch4))//是否为数字
	fmt.Printf("%t\n",unicode.IsSpace(ch4))//是否为空白符
}