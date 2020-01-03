window.changeJson = function(data){
    if(typeof data == "string"){
        return JSON.parse(data);
    }
    return data;
}

window.hostLink = function(url){
    //return "./data/" + url;
    return HOST + "/puzzle/" + url;
}

window.searchToJson = function(){
    var obj = {};
    var str = location.search.substr(1);
    var list = str.split("&");
    list.forEach(function(item){
        var temp = item.split("=");
        obj[temp[0]] = temp[1];
    })
    return obj;
}

window.appendJson = function(param, obj){
    for(var i in obj){
        param[i] = obj[i];
    }
}

window.urlJsonParam = function(url, obj){
    var list = [];
    for(var i in obj){
        list.push(i + "=" + encodeURIComponent(obj[i]));
    }
    return url + "?" + list.join("&");
}

window.translateAmount = function(amount){
    if (!amount) return 0;
    var num = (amount / 100).toFixed(2);
    return parseFloat(num);
}
  
window.formatAmount = function(amount){
    if (!amount) return 0;
    var num = amount.toFixed(2);
    return parseFloat(num);
}

window.dataTemplate = function (sid, data) {
    var jtemp = new JTemp(sid);
    var html = jtemp.build(data);
    return html;
}

window.getParamUrl = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null; 
    }
}

window.httpGet = function(url, data, callback){
    $.ajax({
        url: url,
        type: 'GET',
        data: data,
        timeout: 3000,
        dataType: 'json',
        success: function(data){
            callback && callback(data);
        },
        error: function(xhr){
            console.log(xhr);
            callback && callback();
        }
    })
}

window.httpPost = function(url, data, callback){
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        timeout: 3000,
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        success: function(data){
            callback && callback(data);
        },
        error: function(xhr){
            console.log(xhr);
            callback && callback();
        }
    })
}