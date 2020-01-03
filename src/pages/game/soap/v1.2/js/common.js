/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:24:14 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-04-11 09:24:12
 * 公用方法
 */
window.changeJson = function(data){
    if(typeof data == "string"){
        return JSON.parse(data);
    }
    return data;
};

window.getDefaultSave = function(key, num){
    var n = localStorage.getItem(key);
    if(n){
        return Number(n);
    }
    return num;
};

window.searchToJson = function(){
    var obj = {};
    var str = location.search.substr(1);
    var list = str.split("&");
    list.forEach(function(item){
        var temp = item.split("=");
        obj[temp[0]] = temp[1];
    })
    return obj;
};

window.appendJson = function(param, obj){
    for(var i in obj){
        param[i] = obj[i];
    }
};

window.urlJsonParam = function(url, obj){
    var list = [];
    for(var i in obj){
        list.push(i + "=" + encodeURIComponent(obj[i]));
    }
    return url + "?" + list.join("&");
};

window.dataTemplate = function (sid, data) {
    var jtemp = new JTemp(sid);
    var html = jtemp.build(data);
    return html;
};

window.getParamUrl = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null; 
    }
};

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
};

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
};

window.getScript = function(src, callback){
    var script = document.createElement('script');
    script.async = "async";
    script.src = src;
    if(callback){
       script.onload = callback;
    }
    document.getElementsByTagName("head")[0].appendChild(script);
};

window.stepNum = function(num, callback){
    var cur = 0;
    var step = Math.floor(num / 24);
    step = step > 1 ? step : 1;
    setTimeout(()=>{
        var tid = setInterval(function(){
            cur += step;
            if(cur >= num){
                clearInterval(tid);
                cur = num;
            }
            callback(cur);
        }, 30);
    }, 300);
};