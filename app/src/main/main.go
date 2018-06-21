package main

import (
	"fmt"
	"net/http"
	
	"router"
	_"mod"
)

func main() {
	var a int = 122
	fmt.Println(a&1)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){
		err := router.Distribute(w,r)
		if(err != nil){
			
			fmt.Println(r.URL.Path,err.Error())
		}
   })
	http.ListenAndServe(":1224",nil)
}