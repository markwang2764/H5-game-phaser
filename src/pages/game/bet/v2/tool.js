
window.BT = {};

var extend = function (child, parent) {
  try {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
  } catch (e) {
    console.log(e);
  }
};
BT.extend = extend;

var getBox = function () {
  return BT.app.game.make.image(0, 0, 'box');
};
BT.getBox = getBox;

function tostring (num) {
  var wan = num / 10000;
  if (!Math.floor(wan)) return Math.floor(num) + '';
  var yi = num / 100000000;
  var orig = fixed(wan, 1);
  var unit = '万';
  if (Math.floor(yi)) { // 超过亿
    unit = '亿';
    orig = fixed(yi, 1);
  }
  var arr = orig.split('.');
  var integer = arr[0], tail = arr[1];
  tail = trimZero(tail);
  return integer + (tail ? ('.' + tail) : '') + unit;
}

function fixed (num, frac) {
  var str = num.toString();
  var arr = str.split('.');
  var integer = arr[0], tail = arr[1];
  if (!tail) tail = '';
  if (tail.length < frac) {
    for (var i = 0, j = frac - tail.length; i < j; i++) {
      tail += '0';
    }
  } else {
    tail = tail.substr(0, frac);
  }
  return integer + '.' + tail;
}

function trimZero (str) {
  if (str.substr(-1) == '0') {
    str = str.substr(0, str.length - 1);
    return trimZero(str);
  } else {
    return str;
  }
}

BT.searchToJson = function () {
  var obj = {};
  var str = location.search.substr(1);
  var list = str.split('&');
  list.forEach(function (item) {
    var temp = item.split('=');
    obj[temp[0]] = temp[1];
  });
  return obj;
};

BT.appendJson = function (param, obj) {
  for (var i in obj) {
    param[i] = obj[i];
  }
};

BT.urlJsonParam = function (url, obj) {
  var list = [];
  for (var i in obj) {
    list.push(i + '=' + encodeURIComponent(obj[i]));
  }
  return url + '?' + list.join('&');
};

BT.getParamUrl = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); 
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null; 
  }
};

BT.readInt = function (key) {
  var id = BT.getParamUrl('id');
  var n = localStorage.getItem(id + '_' + key);
  if (n) {
    return Number(n);
  }
  return 0;
};

BT.saveInt = function (key, num) {
  var id = BT.getParamUrl('id');
  localStorage.setItem(id + '_' + key, num);
};

BT.saveStr = function (key, str) {
  var id = BT.getParamUrl('id');
  localStorage.setItem(id + '_' + key, str);
};

BT.readStr = function (key) {
  var id = BT.getParamUrl('id');
  return localStorage.getItem(id + '_' + key);
};

BT.tostring = tostring;

BT.transCliIdToSvrId = function (id) {
  var svrId = null;
  if (id >= 6) {
    svrId = id - 5;
  } else if (id >= 2) {
    svrId = id + 11;
  } else {
    svrId = id + 17;
  }
  return svrId;
};

BT.transSvrIdToCliId = function (id) {
  var cliId = null;
  if (id <= 12) {
    cliId = id + 5;
  } else if (id >= 17) {
    cliId = id - 17;
  } else {
    cliId = id - 11;
  }
  return cliId;
};

/** 针对普通JavaScript对象的自有属性遍历 */
BT.forEach = function (obj, cb, thisObj) {
  if (typeof obj !== 'object' || typeof cb !== 'function') return;
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    cb.call(thisObj, obj[i], i);
  }
};

BT.httpGet = function (url, data, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    data: data,
    timeout: 3000,
    dataType: 'json',
    success: function (data) {
      callback && callback(data);
    },
    error: function (xhr) {
      console.log(xhr);
      callback && callback();
    }
  });
};

BT.httpPost = function (url, data, callback) {
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    timeout: 3000,
    dataType: 'json',
    contentType: 'application/json;charset=UTF-8',
    success: function (data) {
      callback && callback(data);
    },
    error: function (xhr) {
      console.log(xhr);
      callback && callback();
    }
  });
};

BT.wxHeadUrlFix = function(url) {
  var tail = url.substr(-4, 3);
  if(tail !== '.jpg' && tail !== '.png') {
    url += '?a=a.jpg';
  }
  return url;
}

export default extend;
