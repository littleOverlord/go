package main
import (
	"fmt"
)

func main(){
	fmt.Printf("The season is %s\n",season(0))
}
/**
如果在执行完每个分支的代码后，还希望继续执行后续分支的代码，可以使用 fallthrough 关键字来达到目的。
**/
func season(month int) string{
	s := month/3
	switch s{
		case 0: fallthrough
		case 5:
			return "unknow"
		case 1:
			return "spring"
		case 2:
			return "summer"
		case 3:
			return "autumn"
		case 4:
			return "winter"
		default:
			return ""
	}
}

