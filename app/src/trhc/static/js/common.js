var modules = {};
(function(){
    var exports = modules["common"] = {};
    var nav,con,nowNav,currClass,clientWidth,clientHeight;
    var ElsByAttr = function(keys){
        var r = {};
        for(var i = 0,len = keys.length; i < len; i++){
            var nodes = $("["+keys[i]+"]");
            nodes.each(function(k,v){
                r[nodes.eq(k).attr(keys[i])] = {
                    node: nodes.eq(k)
                }
            });
        }
        return r;
    };
    var tabControler = function(now,curr){
        nav = ElsByAttr(["data-nav"]),con = ElsByAttr(["data-content"]);
        posResize(con);
        currClass = curr;
        for(var k in nav){
            (function(key){
                nav[key].node.click(function(){
                    setNow(key);
                })
            })(k);
        }
        nav[now].node.addClass(currClass);
    };
    var setNow = function(key){
        if(key != nowNav){
            nav[key].node.addClass(currClass);
            nav[nowNav].node.removeClass(currClass);
            nowNav = key;
            console.log(con[now].offest.top);
            $('html,body').animate({scrollTop:con[now].offest.top}, 800);
        }
    };
    var posResize = function(list){
        for(var i in list){
            list[i].offest = list[i].node.offset();
            list[i].size = {
                w : list[i].node.with(),
                h : list[i].node.height()
            }
        }
    };
    var resize = function(){
        var body = $(document.body),
            w = document.body.clientWidth || document.documentElement.clientWidth,
            h = document.body.clientHeight || document.documentElement.clientHeight,
            s = w/1000;
            clientWidth = w;
            clientHeight = h;
        if(s<1){
            s = s<1 && s >0.6?s:0.6;
            body.attr("style","font-size:"+s*20+"px;");
        }else{
            body.attr("style","font-size:20px;");
        }
        posResize(con);
    };
    var windowScroll = function(e){
        var t = $(window).scrollTop();
        for(let k in con){
            if(t >= con[k].offest.top && t < con[k].offest.top+con[k].size.h){
                return setNow(k);
            }
        }
        console.log(e);
    };
    tabControler("index","curr");
    resize();
    window.addEventListener("resize",resize);
    $(window).scroll(windowScroll);
})()
