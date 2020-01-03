/**
 * 获取url中特定字符串的值
 * @param {*} name 字符串key
 * @param {*} path 默认为页面链接地址，也可自己传某段string
 */
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
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  //调用：accAdd(arg1,arg2)
  //返回值：arg1加上arg2的精确结果
  export const accAdd = (arg1, arg2) => {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }

    m = Math.pow(10, Math.max(r1, r2))

    return (accMul(arg1, m) + accMul(arg2, m)) / m
  }
   //说明：javascript的减法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
  //调用：accSub(arg1,arg2)
  //返回值：arg1减上arg2的精确结果
  export const accSub = (arg1, arg2) => {
    return accAdd(arg1, -arg2);
  }
  //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
  //调用：accMul(arg1,arg2)
  //返回值：arg1乘以arg2的精确结果
  export const accMul = (arg1, arg2) => {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {}
    try {
      m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  }
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
  //调用：accDiv(arg1,arg2)
  //返回值：arg1除以arg2的精确结果
export const accDiv = (arg1, arg2) => {
    var t1 = 0,
    t2 = 0,
    r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split(".")[1].length
    } catch (e) {}
    r1 = Number(arg1.toString().replace(".", ""))
    r2 = Number(arg2.toString().replace(".", ""))
    return (r1 / r2) * Math.pow(10, t2 - t1);
}