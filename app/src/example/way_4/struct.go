package main

import (
	"fmt"
)

func main() {
    //struct
	AC.Name = "myname"
	fmt.Printf("AC name is %s\n",AC.GetName())
	ac := A{Name: "yourname"}
	fmt.Printf("ac name is %s\n",ac.GetName())
	_ = changeName(ac,"hisname")
	fmt.Printf("ac change name is %s\n",ac.GetName())
	_ = changePName(&ac,"hisname")
	fmt.Printf("ac change point name is %s\n",ac.GetName())
	aa := &A{Name: "pointA"}
	fmt.Printf("aa name is %s\n",aa.GetName())
	_ = changePName(aa,"aa_point")
	fmt.Printf("aa change point name is %s\n",aa.GetName())
}

var AC A
type A struct{Name string}

func (a A)GetName()string{
	return a.Name
}

func (a A)SetName(name string)error{
	a.Name = name
	return nil
}

func changeName(a A,n string)error{
	a.Name = n
	return nil
}

func changePName(a *A,n string)error{
	a.Name = n
	return nil
}