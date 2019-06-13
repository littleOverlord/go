var modules = {};
(function(){
    var exports = modules["common"] = {};
    var nav,con,nowNav,currClass,clientWidth,clientHeight,timer;
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
                    $('html,body').animate({scrollTop:con[key].offest.top}, 800);
                })
            })(k);
        }
        nav[now].node.addClass(currClass);
        nowNav = now;
    };
    var setNow = function(key){
        if(key != nowNav){
            nav[key].node.addClass(currClass);
            nav[nowNav].node.removeClass(currClass);
            nowNav = key;
            console.log(con[nowNav].offest.top);
            
        }
    };
    var posResize = function(list){
        for(var i in list){
            list[i].offest = list[i].node.offset();
            list[i].size = {
                w : list[i].node.width(),
                h : list[i].node.height()
            }
        }
    };
    var resize = function(){
        var body = $(document.body),
            w = document.body.clientWidth || document.documentElement.clientWidth,
            h = document.body.clientHeight || document.documentElement.clientHeight,
            s = w/1000;
            clientWidth = $(window).width();
            clientHeight = $(window).height();
        if(s<1){
            s = s<1 && s >0.6?s:0.6;
            body.attr("style","font-size:"+s*20+"px;");
        }else{
            body.attr("style","font-size:20px;");
        }
        posResize(con);
    };
    var windowScroll = function(e){
        var t = $(window).scrollTop(),
            l = t + clientHeight/2;
        for(let k in con){
            if( l >= con[k].offest.top && l <= con[k].offest.top+con[k].size.h){
                clearTimeout(timer);
                timer = setTimeout((function(key){
                    return function(){
                        clearTimeout(timer);
                        setNow(key);
                    }
                })(k),100);
                return;
            }
        }
        console.log(e);
    };
    tabControler("index","curr");
    resize();
    window.addEventListener("resize",resize);
    $(window).scroll(windowScroll);
})()