package main

import (
	"fmt"
	"net/http"
)

func main() {
	//hello.Say()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){
		
		fmt.Println(w,r);
   });
	http.ListenAndServe(":8989",nil);
}