var CK = CK || {};

(function () {
	var str = function (tar) {
		try{
			return JSON.stringify(tar);
		} catch (e) {

		}
		
	};
	CK.str = str;

	var getSprite = function (name) {
		try{
			return CK.app.game.add.sprite(0, 0, name);
		}catch(e) {
			console.log(e);
		}
	};
	CK.getSprite = getSprite;

	var getGroup = function (x, y) {
		try{
			var group = CK.app.game.add.group();
			group.x = x, group.y = y;
			return group;
		} catch (e) {

		}
	};
	CK.getGroup = getGroup;

	var setAccessor = function (tar) {
		Object.defineProperties(tar, {
			x:{
				get: tar._x
			},
			y: {
				get: tar._y
			},
			width: {
				get: tar._w
			},
			height: {
				get: tar._h
			}
		});
	}
	CK.setAccessor = setAccessor;

	var getTween = function (obj) {
		try{
			return CK.app.game.add.tween(obj);
		}catch(e) {

		}
	}
	CK.getTween = getTween;

	var exetw = function (obj, opts, time, easing) {
		try{
			obj.to(opts, time, easing, true, 0, 0, false);
		} catch (e) {

		}
	}
	CK.exetw = exetw;

	var getQueryValue = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        // console.log(window.location.search, window.location.search.substr(1));
        var ret = window.location.search.substr(1).match(reg);
        // console.log(ret);
        if(!ret) return null;
        return ret[2];
    }
    CK.getQueryValue = getQueryValue;

    var _getCookie = function (cname) {
		var name = cname + "=",
			ca = document.cookie.split(';'),
			i,
			c,
			ca_length = ca.length;
		for (i = 0; i < ca_length; i += 1) {
			c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) !== -1) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	// CK.getCookie = getCookie;

	var _setCookie = function (variable, value, day) {
		var d = new Date();
		d = new Date(d.getTime() + 1000 * 3600 * 24 * day);
		document.cookie = variable + '=' + value + '; expires=' + d.toGMTString() + ';';
	}

	var getStorage = function (key) {
		if (window.localStorage) {
			return window.localStorage.getItem(key);
		} else if (document.cookie) {
			return _getCookie(key);
		} else {
			return null;
		}
	}
	CK.getStorage = getStorage;

	var setStorage = function (key, value) {
		if (window.localStorage) {
			if (value == null) {
				localStorage.removeItem(key);
			} else {
				value && localStorage.setItem(key, value);
			}
		} else if (document.cookie) {
			_setCookie(key, value, 30);
		} else {}
	}
	CK.setStorage = setStorage;

	var clearStorage = function (keys) {
		if(!(keys instanceof Array)){
			console.warn('keys must be array');
			return;
		}
		keys.forEach((val, idx)=>{
			setStorage(val, null);
		});
	}
	CK.clearStorage = clearStorage;

	var assetFixCheck = function (url) {
		var tail = url.substr(-3, 3);
		if(tail !== 'jpg' || tail !== 'png') {
			url += '?a=a.jpg';
		}
		return url;
	}
	CK.assetFixCheck = assetFixCheck;

	/**
     * 将字符串按指定的字长进行截取
     * 半角和全角字符混合的情况下，需要按照字长来截取，而不是简单的按长度截取
     */
    var substr = function(nick, tarlen) {
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
    };
    CK.substr = substr;

    var extend = function (child, parent) {
    	child.prototype = new parent();
    	child.prototype.constructor = child;
    	child.prototype.__super = parent.prototype;
    };
    CK.extends = extend;

    var reqAppend = function (param, prop, key) {
    	var val = CK.getQueryValue(prop);
		
		if(!!val){
			param[key] = val;
		}
		return param;
    }
    CK.reqAppend = reqAppend;

})()