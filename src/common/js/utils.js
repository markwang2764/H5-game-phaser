/**
 * @note    公共工具类
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-01
 * @des
 */
import Promise from 'promise-polyfill';
require('@lib/cookie/1.0.0/index');

const fixed = (num, frac) => {
  var str = num.toString();
  var arr = str.split('.');
  var integer = arr[0],
    tail = arr[1];
  if (!tail) tail = '';
  if (tail.length < frac) {
    for (var i = 0, j = frac - tail.length; i < j; i++) {
      tail += '0';
    }
  } else {
    tail = tail.substr(0, frac);
  }
  return integer + '.' + tail;
};

const trimZero = str => {
  if (str.substr(-1) == '0') {
    str = str.substr(0, str.length - 1);
    return trimZero(str);
  } else {
    return str;
  }
};

const tostring = num => {
  var wan = num / 10000;
  if (!Math.floor(wan)) return Math.floor(num) + '';
  var yi = num / 100000000;
  var orig = fixed(wan, 1);
  var unit = '万';
  if (!!Math.floor(yi)) {
    // 超过亿
    unit = '亿';
    orig = fixed(yi, 1);
  }
  var arr = orig.split('.');
  var integer = arr[0],
    tail = arr[1];
  tail = trimZero(tail);
  return integer + (!!tail ? '.' + tail : '') + unit;
};

/**
 * GET接口请求
 * @param url
 * @param data
 * @param success
 * @param error
 */
const httpGet = ({ url, data, success, error }) => {
  $.ajax({
    url: url,
    type: 'GET',
    data: {
      sessionKey: getUrlParameter('sessionKey'),
      sourceToken: getUrlParameter('sourceToken'),
      sourceUserId: getUrlParameter('sourceUserId'),
      ...data
    },
    timeout: 3000,
    dataType: 'json',
    success: function(data) {
      success && success(data);
    },
    error: function(xhr) {
      error && error();
    }
  });
};

/**
 * POST接口请求
 * @param url
 * @param data
 * @param success
 * @param error
 * @param type
 * @param contentType
 */
const httpPost = ({ url, data, success, error, type = 'json', contentType = 'application/x-www-form-urlencoded' }) => {
  $.ajax({
    url: url,
    type: 'POST',
    data: {
      sessionKey: getUrlParameter('sessionKey'),
      sourceToken: getUrlParameter('sourceToken'),
      sourceUserId: getUrlParameter('sourceUserId'),
      ...data
    },
    timeout: 3000,
    dataType: type,
    contentType: contentType,
    success: function(data) {
      success && success(data);
    },
    error: function(xhr) {
      error && error();
    }
  });
};

const httpGetPromise = ({ url, data }) =>
  new Promise((resolve, reject) => {
    httpGet({
      url: url,
      data: {
        sessionKey: getUrlParameter('sessionKey'),
        sourceToken: getUrlParameter('sourceToken'),
        sourceUserId: getUrlParameter('sourceUserId'),
        ...data
      },
      success: data => {
        resolve(data);
      },
      error: err => {
        reject(err);
      }
    });
  });

/**
 * POST接口请求promise
 * @param url
 * @param data
 * @param type
 * @param contentType
 */
const httpPostPromise = ({ url, data, type = 'json', contentType = 'application/x-www-form-urlencoded' }) =>
  new Promise((resolve, reject) => {
    httpPost({
      url: url,
      data: {
        sessionKey: getUrlParameter('sessionKey'),
        sourceToken: getUrlParameter('sourceToken'),
        sourceUserId: getUrlParameter('sourceUserId'),
        ...data
      },
      success: data => {
        resolve(data);
      },
      error: err => {
        reject(err);
      }
    });
  });

String.prototype.getLength = function() {
  return this.replace(/[^\x00-\xff]/gi, 'aa').length;
};

/**
 * 保留字符数 + 省略号，字符串：游客12345678，如保留六位，则取前十个字符
 * @param str
 * @param n
 */
const reserveStr = (str, n) => {
  /**
   * 保留字符数
   * @param str
   * @param n
   */
  function subTextStr(str, n) {
    if (str.getLength() > n) {
      str = str.substring(0, str.length - 1);
      return subTextStr(str, n);
    }
    return str;
  }

  str = subTextStr(str, 2 * (n + 1));

  if (str.getLength() > 2 * n) {
    str = subTextStr(str, 2 * (n - 1)) + '...';
  }

  return str;
};

/**
 * 公用缓存set方法
 * @param {*} key
 * @param {*} value
 */
const setStorage = (key, value) => {

  // 支持localStorage
  if (window.localStorage) {
    if (value == null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  }
  // 支持sessionStorage
  // else if (window.sessionStorage){
  //   if (value == null) {
  //     sessionStorage.removeItem(key);
  //   } else {
  //     value && sessionStorage.setItem(key, value);
  //   }
  // }
  // 支持cookie
  // 默认一天失效
  else if (document.cookie) {
    $.cookie(key, value, { expires: 1, path: '/' });
  }
  // 都不支持
  else {
  }
};

/**
 * 公用缓存get方法
 * @param {*} key
 */
const getStorage = key => {
  // 支持localStorage
  if (window.localStorage) {
    return window.localStorage.getItem(key);
  }
  // 支持sessionStorage
  // else if (window.sessionStorage){
  //   return sessionStorage.getItem(key);
  // }
  // 支持cookie
  else if (document.cookie) {
    return $.cookie(key);
  }
  // 都不支持
  else {
    return null;
  }
};

/**
 * 获取url中特定字符串的值
 * @param {*} name 字符串key
 * @param {*} path 默认为页面链接地址，也可自己传某段string
 */
const getUrlParameter = (name, path = window.location.href) => {
  const result =
    decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(path) || [undefined, ''])[1].replace(/\+/g, '%20')) || null;
  return result ? result : '';
};

/**
 * 是否为android机
 * @returns {boolean}
 */
const isAndroid = () => {
  return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1 || navigator.userAgent.indexOf('Adr') > -1; // android??;
}

const isWeiXin = () => {
  var ua = window.navigator.userAgent.toLowerCase();
  console.log(ua); //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
  if (ua.match(/MicroMessenger/i) == 'micromessenger' || getUrlParameter('wxdebug')) {
    return true;
  } else {
    return false;
  }
};

const embedClick = (item, cb) => {
  if (item && typeof item === 'object') {
    item = JSON.stringify(item);
  }
  window.DB.exposure.singleClk({ data: item, callback: cb });
};

const embedExposure = item => {
  if (item && typeof item === 'object') {
    item = JSON.stringify(item);
  }
  window.DB.exposure.singleExp(item);
};

const sendCustomAdvertLog = (data, sessionKey) => {
  let dsm = getUrlParameter('dsm');
  let dpm = getUrlParameter('dpm');
  let dcm = getUrlParameter('dcm');

  httpPost({
    url: '/puzzle/clickPuzzleAdvert',
    data: JSON.stringify({
      sessionKey: sessionKey,
      dsm: dsm,
      dpm: dpm,
      dcm: dcm,
      gameId: getUrlParameter('id'),

      advertId: data.advertId,
      actOrderId: data.orderId,
      packageId: data.packageId
    }),
    contentType: 'application/json;charset=UTF-8',
    success: data => {}
  });
};

/**
 * @param sessionKey
 * @param data 券数据
 * @returns {string}
 */
const getAdvertClickUrl = (data, sessionKey = CFG.sessionKey) => {
  let dsm = getUrlParameter('dsm');
  let dpm = getUrlParameter('dpm');
  let dcm = getUrlParameter('dcm');

  if (data.customAd) {
    sendCustomAdvertLog(data, sessionKey);
  }

  return data.clickUrl + `${data.clickUrl.indexOf('?') > -1 ? '&' : '?'}dpm=${dpm}&dcm=${dcm}&dsm=${dsm}`;
};

const isObjectEmpty = obj => {
  let sum = 0;
  for (let x in obj) {
    sum++;
  }

  return sum === 0;
};

/**
 *
 * 精确解析url，包括协议头，host，port，path等
 * @param {*} url
 * @returns
 * {
 * url:'',
 * scheme:'',
 * slash:'',
 * host:'',
 * path:'',
 * query:'',
 * hash:''
 * }
 */
function exactParseUrl(url) {
  // 解析url
  let parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
  let tamp = parse_url.exec(url),
    result = {},
    fields = ['ur1', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];

  fields.forEach(function(key, index) {
    result[key] = tamp[index] ? tamp[index] : '';
  });

  return result;
}

/**
 *解析全部的参数，返回一个Object
 *
 * @returns
 */
function parseUrlParams() {
  var paramsArr = decodeURIComponent(location.search)
      .replace(/amp;/g, '')
      .split('&'),
    result = {};
  // 删除？
  paramsArr[0] = paramsArr[0].substr(1);
  for (var i = 0, j = paramsArr.length; i < j; i++) {
    var valArr = paramsArr[i].split('=');
    result[valArr[0]] = decodeURIComponent(valArr[1]);
  }

  return result;
}

/**
 * 格式化url，添加参数
 *
 * @param {*} url
 * @param {*} params
 * @returns
 */
const formatUrl = (url, params) => {
  let keys = Object.keys(params);
  let base = url.indexOf('?') > -1 ? `${url}&` : `${url}?`;
  return keys.reduce((acc, v, i) => {
    if (i === 0) {
      return (acc += `${v}=${params[v]}`);
    } else {
      return (acc += `&${v}=${params[v]}`);
    }
  }, base);
};

// requestAnimationFrame 兼容
const requestAnimFrame = (function() {
  return function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

const appendUrlParameter = (url, k, v) => {
  if (url.indexOf('?') > -1) {
    return `${url}&${k}=${v}`;
  } else {
    return `${url}?${k}=${v}`;
  }
};

const isAppDownload = () => {
  return isAndroid() && !isWeiXin() && !getUrlParameter('appPreview');
};

const toDownloadUrl = url => {
  if (url) {
    setTimeout(() => {
      window.location.href = url;
    }, 120);
  } else {
    console.error('重定向url为空');
  }
};

const deleteInvalidKey = object => {
  Object.keys(object).forEach(v => {
    //过滤掉 undefined,null,NaN
    if (typeof object[v] === 'undefined' || (!object[v] && typeof object[v] !== 'undefined' && object[v] !== 0) || isNaN(object[v])) {
      delete object[v];
    }
  }, {});
  return object;
};

export {
  fixed,
  trimZero,
  tostring,
  httpGet,
  httpPost,
  httpGetPromise,
  httpPostPromise,
  reserveStr,
  setStorage,
  getStorage,
  getUrlParameter,
  isAndroid,
  isWeiXin,
  embedClick,
  embedExposure,
  getAdvertClickUrl,
  isObjectEmpty,
  exactParseUrl,
  parseUrlParams,
  formatUrl,
  requestAnimFrame,
  appendUrlParameter,
  isAppDownload,
  toDownloadUrl,
  deleteInvalidKey
};
