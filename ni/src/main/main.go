package main

import (
	"fmt"
	"os"
	"strings"

	"image"
	"image/color"
	"image/gif"
	"io"
	"math"
	"math/rand"
)

func main(){
	//**** gopl.io/ch1/echo1
	//Echo1 prints its command-line arguments.
	fmt.Println("gopl.io/ch1/echo1 ============= ")
	var s, sep string
	for i := 0;i < len(os.Args);i++{
		s += sep + os.Args[i]
		sep = " "
	}
	fmt.Println(s)

	//**** gopl.io/ch1/echo2
	//Echo2 prints its command-line arguments.
	fmt.Println("gopl.io/ch1/echo2 ============= ")
	s,sep = ""," "
	for i,arg := range os.Args[1:]{
		fmt.Println(i,sep,arg)
	}
	

	//**** gopl.io/ch1/echo3
	//Echo3 prints its command-line arguments.
	
	fmt.Println("gopl.io/ch1/echo3 ============= ")
	fmt.Println(strings.Join(os.Args[1:]," "))
	fmt.Println(os.Args[1:])

	//**** gopl.io/ch1/lissajous
	// Lissajous generates GIF animations of random Lissajous figures
	/**
	import {
		"images"
		"images/color"
		"images/gif"
		"io"
		"math"
		"math/rand"
		"os"
	}
	**/

	

	lissajous(os.Stdout)

	
}
var palette = []color.Color{color.White,color.Black}
	const(
		whiteIndex = 0 //first color in palette
		blackIndex = 1 //next color in palette
	)
func lissajous(out io.Writer){
	const(
		cycles = 5 //number of complete x oscillator revolutions
		res = 0.001 //angular resolution
		size = 100 // image canvas cover [-size..+size]
		nframes = 64 // number of animation frames
		delay = 8 //delay between frame in 10ms units
	)
	freq := rand.Float64() * 3.0 // relative frequency of y oscillator
	anim := gif.GIF{LoopCount:nframes}
	phase := 0.0 //phase difference
	for i:=0;i<nframes; i++{
		rect := image.Rect(0,0,2*size+1,2*size+1)
		img := image.NewPaletted(rect,palette)
		for t:=0.0; t < cycles*2*math.Pi;t += res{
			x := math.Sin(t)
			y := math.Sin(t*freq + phase)
			img.SetColorIndex(size + int(x*size+0.5),size+int(y*size+0.5),blackIndex)
		}
		phase += 0.1
		anim.Delay = append(anim.Delay,delay)
		anim.Image = append(anim.Image,img)
	}
	gif.EncodeAll(out, &anim) //NOTE: ignoring encoding errors
}

