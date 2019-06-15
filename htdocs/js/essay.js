(function(){
	var exports = modules["essay"] = {};
	var essayId2Index = {};
	var essayListNode = document.getElementById("essayList");
	var essayShowNode = document.getElementById("essayShow");
	var essayDetailNode = document.getElementById("essayDetail");
	var essayCloseNode = $("#essayClose");
	//添加首页文章列表
	exports.addList = function(data){
		var str = "";
		data.sort(function(a,b){
			return b.time - a.time;
		})
		for(var i =0, len = data.length;i < len; i++){
			essayId2Index[data[i].eid] = i;
			if(data[i].type == "essay"){
				str += modules.components.essay_list(data[i]);
			}
		}
		essayListNode.innerHTML = str;
		$(".essay_i").click(function(){
			showEssayHanle(this,data);
		})
	}
	//处理点击显示文章事件
	var showEssayHanle = function(node,data){
		var eid = node.dataset.eid,
		index = essayId2Index[eid],
		d = data[index];
		essayDetailNode.innerHTML = "";
		showEssay();
		if(d.content){
			insertEssay(d);
		}else{
			modules.common.ajax("GET",`essays/${d.eid}.tpl`,null,null,function(err,data){
				if(err){
					alert(err);
					return;
				}
				d.content = data;
				insertEssay(d);
			})
		}
	}
	//显示文章详情
	var showEssay = function(){
		essayShowNode.setAttribute("style","display:block;");
		modules.common.caclEssayBg();
	}
	//关闭文章详情
	var closeEssay = function(){
		essayShowNode.setAttribute("style","display:none;")
	}
	//插入文章详情
	var insertEssay = function(data){
		var str = modules.components.essay_detail(data);
		essayDetailNode.innerHTML = str;
	}
	//监听关闭按钮点击事件
	essayCloseNode.click(function(){
		closeEssay();
	})
	$(".nav li").click(function(){
		showEssayHanle(this,modules.essay_cfg.list);
	})
	// 监听系统返回
	try {
		const win = top.window;
		// 注册系统返回事件
		win.onpopstate = () => {
			win.history.pushState({}, null);
			closeEssay();
		};
		win.history.pushState({}, null);
	} catch (e) {
	}
})()