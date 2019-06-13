(function(){
    var exports = modules["map"] = {};
    // 百度地图API功能
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(104.076171,30.670977);
	var marker = new BMap.Marker(point);  // 创建标注
	map.addOverlay(marker);              // 将标注添加到地图中
	map.centerAndZoom(point, 20);
	var opts = {
	  width : 200,     // 信息窗口宽度
	  height: 100,     // 信息窗口高度
	  title : "泰瑞合成制药公司" , // 信息窗口标题
	  enableMessage:true,//设置允许信息窗发送短息
	  message:"公司简介。。。。"
	}
	var infoWindow = new BMap.InfoWindow("地址：四川省成都市青羊区顺城大街269号富力中心B座1302", opts);  // 创建信息窗口对象 
	marker.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,point); //开启信息窗口
    });
    map.openInfoWindow(infoWindow,point);
})()