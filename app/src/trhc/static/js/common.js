var ElsByAttr = function(keys){
    var r = {};
    for(var i = 0,len = keys.length; i < len; i++){
        let nodes = $("["+keys[i]+"]");
        nodes.each(function(k,v){
            r[v.attr("data-content")] = v;
        });
    }
    return r;
}