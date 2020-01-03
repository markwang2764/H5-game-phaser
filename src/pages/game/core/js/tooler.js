var Tooler = {
    /**
     * GET接口请求
     * @param {请求地址} url 
     * @param {json格式参数} data 
     * @param {根据回调的参数data是否为null判断请求成功} callback 
     */
    httpGet:function(url, data, callback){
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
                callback && callback();
            }
        })
    },


    /**
     * POST接口请求
     * @param {请求地址} url 
     * @param {json格式参数} data 
     * @param {根据回调的参数data是否为null判断请求成功} callback 
     */
    httpPost:function(url, data, callback){
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
                callback && callback();
            }
        })
    },


    /**
     * 把网址后的参数转为json对象
     * @param {网址，不传默认用当前网址} url 
     */
    searchToJson:function(url){
        var obj = {};
        var str = url ? url.substr(1) : location.search.substr(1);
        var list = str.split("&");
        list.forEach(function(item){
            var temp = item.split("=");
            obj[temp[0]] = temp[1];
        })
        return obj;
    },

    /**
     * 把json数据和网址拼接成一个完整的url
     * @param {网址} url 
     * @param {json数据} obj 
     */
    urlJsonParam:function(url, obj){
        var list = [];
        for(var i in obj){
            list.push(i + "=" + encodeURIComponent(obj[i]));
        }
        return url + "?" + list.join("&");
    },

    /**
     * 获取url参数
     * @param {参数名称} name 
     */
    getParamUrl:function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return null; 
        }
    },

    /**
     * 将字符串转换为普通对象
     */
    toJson: function (data) {
        try {
            if(typeof data === 'string') {
                return JSON.parse(data);
            } else if(typeof data === 'object') {
                return data;
            } else {
                return null;
            }
        } catch (e) {
            console.error(e);
        }
        
    },

    /**
     * 将字符串按指定的字长进行截取
     * 半角和全角字符混合的情况下，需要按照字长来截取，而不是简单的按长度截取
     */
    substr: function(nick, tarlen) {
        var str = nick;
        var ret = str.match(/[\W | \w]/g);
        var idx = nick.length, len = 0;
        if(!!ret) {
            for(var i = 0, j = ret.length; i < j; i++) {
                var char = ret[i];
                if(!!char.match(/[\w]/)) {
                    len += 1;
                } else {
                    len += 2;
                }
                if(len === tarlen) {
                    idx = i + 1;
                    break;
                } else if(len > tarlen) {
                    idx = i;
                    break;
                }
            }
        }
        str = nick.substr(0, idx);
        if(idx < nick.length){
            str += '..';
        }
        return str;
    },

    wxHeadUrlFix: function(url) {
        if(!url) return '';
        var tail = url.substr(-4, 3);
        if(tail !== '.jpg' && tail !== '.png') {
            url += '?a=a.jpg';
        }
        return url;
    },

    hpGet: function(url, data, cb) {
        var def = {
            "sessionKey": CFG.sessionKey,
            "sourceUserId": CFG.sourceUserId,
            "sourceToken": CFG.sourceToken,
            "consumerIdOrder": this.getParamUrl("consumerIdOrder") || '',
            "appPreview": this.getParamUrl('appPreview') || '',

        };
        var param = def;
        if(!!data) {
            param = Object.assign(data, def);
        }
        this.httpGet(url, param, cb);
    },

    hpPost: function(url, data, cb) {
        var def = {
            "sessionKey": CFG.sessionKey,
            "sourceUserId": CFG.sourceUserId,
            "sourceToken": CFG.sourceToken
        };
        var param = def;
        if(!!data) {
            param = Object.assign(data, def);
        }
        this.httpPost(url, param, cb);
    },

    msTos: function(ms) {
        if(!ms) return "0''00";
        if(ms < 10) {
            return "0''00";
        } else if(ms < 1000) {
            return "0''" + (ms / 1000).toFixed(2).substr(2);
        } else  {
            var sec = Math.floor(ms / 1000);
            var rms = ms % 1000;
            if(ms < 60000){ //小于1min
                if(rms < 10) {
                    return sec + "''00";
                } else if(rms < 1000) {
                    return sec + "''" + (rms / 1000).toFixed(2).substr(2);
                }
            } else { // 大于1min
                var sec2 = sec % 60,
                    min = Math.floor(sec / 60),
                    hour = 0;
                if(min >= 60) {
                    hour = Math.floor(min / 60);
                    min = min % 60;
                }
                var ret = (!!hour ? (hour + ":") : "") + min + "'" + sec2 + "''";
                if(rms < 10) {
                    return ret + '00';
                } else {
                    return ret + (rms / 1000).toFixed(2).substr(2);
                }
            }
        }
    },

    /**
     * 向埋点数据中的指定键值中插入数据
     */
    append2Embed: function(key, data) {
        var value = CFG.embed[key];
        if(value === null || value === undefined) {
            console.error('埋点数据中不存在键：%s', key);
            return null;
        }
        return Object.assign({}, data, JSON.parse(value));
    },

    /**
     * 从url中查询指定key对应的值，组装为一个对象
     */
    paramWrapper: function(keys) {
        if(!(keys instanceof Array) && typeof keys !== "string") {
            console.error('参数类型错误，无法处理非数组或字符串类型的参数');
            return null;
        }
        if(typeof keys === 'string') {
            keys = [keys];
        }

        keys = keys.concat(['source_user_id', 'is_client']);
        var ret = {};
        keys.forEach((key)=>{
            var val = this.getParamUrl(key);
            if(!!val) ret[key] = val;
        });
        ret["share_user_id"] = this.getParamUrl("sourceToken");
        ret["content_id"] = CFG.gameId;
        return ret;
    },

    /**
     * 将两个对象合并为一个
     */
    assign: function (dest, src) {
        Object.assign(dest, src);
    }
}

window.GAME = window.GAME || {};
GAME.tool = Tooler;

export default Tooler;