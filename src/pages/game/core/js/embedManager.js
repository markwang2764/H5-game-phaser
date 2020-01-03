var EmbedManager = function(){
    this.data = GAME.tool.toJson(window.CFG.embed) || {};
}

var p = EmbedManager.prototype;

p.init = function(data, id){
    this.gameId = id;
    this.data = data;
}

/**
 * 追加埋点
 * @param {埋点数据} obj 
 */
p.append = function(obj){
    for(var i in obj){
        if(obj[i]){
            this.data[i] = obj[i];
        }
    }
    console.warn("append");
}

/**
 * 发送普通数据点击埋点
 * @param {埋点数据，字符串或json都可} item 
 */
p.embedClick = function(item){
    if (item && typeof item === 'object') {
        item = JSON.stringify(item);
    }
    window.DB.exposure.singleClk({data:item});
}

/**
 * 发送普通数据曝光埋点
 * @param {埋点数据，字符串或json都可} item 
 */
p.embedExport = function(item){
    if (item && typeof item === 'object') {
        item = JSON.stringify(item);
    }
    window.DB.exposure.singleExp(item);
}

/**
 * 根据编号发送点击埋点
 * @param {埋点编号} aim 
 */
p.numClick = function(aim){
    var data = window.CFG.embed;
    for(var i in data){
        var d = data[i];
        if(d.dpm === d.appId + ".115." + aim){
            if(i.indexOf("click") !== -1){
                ads.embedClick(d);
                break;
            }
        }
    }
}

/**
 * 根据编号发送曝光埋点
 * @param {埋点编号} aim 
 */
p.numExport = function(aim){
    var data = window.CFG.embed;
    for(var i in data){
        var d = data[i];
        if(d.dpm === d.appId + ".115." + aim){
            if(i.indexOf("exposure") !== -1){
                ads.embedExport(d);
                break;
            }
        }
    }
}

window.GAME = window.GAME || {};
GAME.embed = new EmbedManager();

export default {};

