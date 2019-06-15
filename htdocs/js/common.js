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
    // 计算文章详情背景
    exports.caclEssayBg = function(){
        var bgNode = document.getElementById("essayBg"),
            contentNode = document.getElementById("essayContent"),
            width = contentNode.clientWidth;
        bgNode.setAttribute("style",`width:${width}px;margin-left:-${width/2}px;`);
    }
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
        exports.caclEssayBg();
    };
    resize();
    window.addEventListener("resize",resize);

    // host
    var hostNode = document.getElementById("host"),host = location.host;
    hostNode.innerText = host;
    hostNode.setAttribute("href",location.protocol +"//"+host);
    
    exports.ajax = (type, url, reqData, reqType, callback, processBack) => {
        const xhr = new XMLHttpRequest();
        if(reqType){
            xhr.responseType = 'arraybuffer';
        }
        /**
         * @description 链接被终止
         */
        xhr.onabort = () => {
            callback("abort");
        };
        xhr.onerror = (ev) => {
            callback(`error status: ${xhr.status} ${xhr.statusText}, ${url}`);
        };
        xhr.upload.onprogress = (ev) => {
            processBack && processBack(ev);
        }
        xhr.onprogress = (ev) => {
            
        }
        xhr.onload = (ev) => {
            if (xhr.status === 300 || xhr.status === 301 || xhr.status === 302 || xhr.status === 303) {
                return callback(xhr.getResponseHeader("Location"));
            }
            if (xhr.status !== 200 && xhr.status !== 304) {
                return callback(`error status: ${xhr.status} ${xhr.statusText}, ${url}`);
            };
            // console.log(xhr.response);
            // console.log(xhr.responseText);
            callback(null,xhr.response || xhr.responseText);
        }
        xhr.open(type, url, true);
        // if(reqType){
            // xhr.setRequestHeader("accept-encoding", "gzip");
        // }
        xhr.send(reqData);
    }
})()