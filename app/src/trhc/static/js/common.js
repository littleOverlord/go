var ElsByAttr = function(keys){
    var r = {};
    for(var i = 0,len = keys.length; i < len; i++){
        var nodes = $("["+keys[i]+"]");
        nodes.each(function(k,v){
            r[nodes.eq(k).attr(keys[i])] = nodes.eq(k);
        });
    }
    return r;
}
var tabControler = function(now,curr){
    var nav = ElsByAttr(["data-nav"]),con = ElsByAttr(["data-content"]);
    for(var k in nav){
        (function(key){
            nav[key].click(function(){
                if(key != now){
                    con[now].hide();
                    con[key].show();
                    nav[key].addClass(curr);
                    nav[now].removeClass(curr);
                    now = key;
                }
            })
        })(k);
    }
    con[now].show();
    nav[now].addClass(curr);
}
var resize = function(){
    var body = $(document.body),
        w = document.body.clientWidth || document.documentElement.clientWidth,
        h = document.body.clientHeight || document.documentElement.clientHeight,
        s = w/1000;
    if(s<1){
        s = s<1 && s >0.6?s:0.6;
        body.attr("style","font-size:"+s*20+"px;");
    }else{
        body.attr("style","font-size:20px;");
    }
}
tabControler("index","curr");
resize();
window.addEventListener("resize",resize);