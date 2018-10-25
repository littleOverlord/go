package main
import (
	"fmt"
)

func main(){
	fmt.Printf("The season is %s\n",season(7))
}

func season(month int) string{
	s := month/3
	switch s{
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

