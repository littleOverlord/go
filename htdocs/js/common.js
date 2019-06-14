var modules = {};
(function(){
    var exports = modules["common"] = {};
    // resize window
    var con;
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
    resize();
    window.addEventListener("resize",resize);

    // host
    var hostNode = document.getElementById("host"),host = location.host;
    hostNode.innerText = host;
    hostNode.setAttribute("href",location.protocol +"//"+host);
})()