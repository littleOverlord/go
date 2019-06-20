package client

import "testing"

func TestInitUid(t *testing.T) {
	if !(uid.value > 0) {
		t.Error("uid init fail!")
	}
}
