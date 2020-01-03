/**
 * 获取url中特定字符串的值
 * @param {*} name 字符串key
 * @param {*} path 默认为页面链接地址，也可自己传某段string
 */

import axios from 'axios';
export const getUrlParameter = (name, path = window.location.href) => {
  const result = decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(path) || [undefined, ''])[1].replace(/\+/g, '%20')) || null;
  return result ? result.split('/')[0] : '';
}

/**
 * 是否为android机
 * @returns {boolean}
 */
export const isAndroid = () => {
  return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1; // android??;
}

export const isWeiXin = () => {
  var ua = window.navigator.userAgent.toLowerCase();
  console.log(ua); //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

export const isObjectEmpty = (obj) => {
  let sum = 0 ;
  for (let x in obj) {
    sum ++ ;
  }

  return sum === 0;
}

export const getWxConfig = (url) => axios.get('/youtui/context/getWxConfig', {
  params: {
    sessionKey: getUrlParameter('sessionKey'),
    sourceToken: getUrlParameter('sourceToken'),
    url: url
  }
});