// Copyright 2019 tdd authors
package config

import (
	"fmt"
	"testing"
)

func TestConfigRead(t *testing.T){
	if srcAbs == "" || srcAbs == "."{
		t.Error("Source reltive dir is wrong")
	}
	fmt.Println(srcAbs)
	fmt.Println(Table)
}