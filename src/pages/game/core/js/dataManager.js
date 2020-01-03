/**
 * 数据系统管理器，负责
 */
var DataManager = function () {
    this.dataMap = {};
}

var p = DataManager.prototype;

/**
 * 向数据系统管理器中安装一个数据系统
 * @param {object} dataSystem 数据系统实例
 */
p.register = function (dataSystem) {
    if (!dataSystem) 
        return;
    if (!!this.dataMap[dataSystem.id]) {
        console.warn('数据系统:%s已经存在', dataSystem.id);
        return;
    }
    this.dataMap[dataSystem.id] = dataSystem;
}

/**
 * 从数据系统管理器中移除指定数据系统
 * @param {number} id 数据系统id标识
 */
p.remove = function (id) {
    if (!this.dataMap[id]) {
        return;
    }
    var sys = this.dataMap[id];
    // 兼容老版本未设置destroy方法的数据系统
    if(!!sys.destroy && typeof sys.destroy === 'function') {
        sys.destroy();
    } 
    delete this.dataMap[id];
}

/**
 * 查询指定数据系统
 * @param {number} id 数据系统id标识
 */
p.getById = function (id) {
    return this.dataMap[id];
}

p.getCookie = function (cname) {
    var name = cname + "=",
        ca = document
            .cookie
            .split(';'),
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

p.setCookie = function (variable, value, day) {
    var d = new Date();
    d = new Date(d.getTime() + 1000 * 3600 * 24 * day);
    document.cookie = variable + '=' + value + '; expires=' + d.toGMTString() + ';';
}

p.getStorage = function (key) {
    if (window.localStorage) {
        return window
            .localStorage
            .getItem(key);
    } else if (document.cookie) {
        return this.getCookie(key);
    } else {
        return null;
    }
}

p.setStorage = function (key, value) {
    if (window.localStorage) {
        if (value == null) {
            localStorage.removeItem(key);
        } else {
            value && localStorage.setItem(key, value);
        }
    } else if (document.cookie) {
        this.setCookie(key, value, 30);
    } else {}
}

window.GAME = window.GAME || {};
GAME.data = new DataManager();

export default {};