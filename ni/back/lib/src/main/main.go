package main

import (
	"fmt"
	"net/http"
	
	"router"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){
		err := router.Distribute(w,r)
		if(err != nil){
			
			fmt.Println(r.URL.Path,err.Error())
		}
   });
	http.ListenAndServe(":8080",nil);
}