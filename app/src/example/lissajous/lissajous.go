package lissajous
//%%%%%%%%%%%%%%%%%%%%% 导入
import (
	"fmt"
	"image"
	"image/color"
	"image/gif"
	"math"
	"math/rand"
	"net/http"

	"router"
)


//%%%%%%%%%%%%%%%%%%%%% 导出
//初始化
func init(){
	router.Set("",router.Handler(outGif))
	fmt.Printf("package lissajous init ok!!!\n")
}


//%%%%%%%%%%%%%%%%%%%%% 本地函数
var palette = []color.Color{color.White,color.Black}
const(
	whiteIndex = 0 //first color in palette
	blackIndex = 1 //next color in palette
)
//输出图片
func outGif(out http.ResponseWriter, r *http.Request) error{
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
	return gif.EncodeAll(out, &anim)
}