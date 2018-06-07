package main

import (
	"fmt"
	// "net/http"
	
	// "router"
)

func main() {
	var a int8 = ^120
	fmt.Printf("%08b\n",a)

// 	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){
// 		err := router.Distribute(w,r)
// 		if(err != nil){
			
// 			fmt.Println(r.URL.Path,err.Error())
// 		}
//    });
// 	http.ListenAndServe(":1224",nil)
}