(function(){
    var exports = modules["components"] = {};
    //文章详情组件
    exports["essay_detail"] = function(data){
        var date = new Date(data.time);
        return `
        <div class="ei_info">${data.author}·${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日</div>
        <h2 class="ei_title">${data.title}</h2>
        <div class="ei_info">${data.from?"转自："+data.from:""}</div>
        <div class="essay_words">
        ${data.content}
        </div>
        `;
    };
    //文章列表组件
    exports["essay_list"] = function(data){
        var date = new Date(data.time);
        return `
        <div class="essay_i" data-eid="${data.eid}">
            <div class="ei_l">
                <p class="ei_info">${data.author}·${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日</p>
                <h2 class="ei_title">${data.title}</h2>
                <ul class="ei_tag">
                    ${(function(){
                        var str = "";
                        for(var i = 0,len = data.tags.length;i<len;i++){
                            str+=`<li>${data.tags[i]}</li>`
                        }
                        return str;
                    })()}
                </ul>
            </div>
        </div>
        `
    }
})()