package main

import (
	"net/http"
	"router"
)

func main() {
	//hello.Say()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){
		router.Distribute(w,r)
   });
	http.ListenAndServe(":8989",nil);
}