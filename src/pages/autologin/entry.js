import './entry.less';

var _fmOpt = {};
var tokenId = 'duiba' + '-' + new Date().getTime() + '-' + Math.random().toString(16).substr(2);
var nameData = {};
var deviceId = 0;
var embed = {};

$(function () {
  CFG = (typeof CFG === 'string') ? JSON.parse(CFG) : CFG;
  deviceId = getSaveData('deviceId');
  setStorage('deviceId', deviceId);
  // setMaskBg();

  addTongDun();
  setTimeout(function () {
    checkUse();
  }, 900);

  var tip = $('.tip');
  var num = 0;
  setInterval(function () {
    if (++num == 4) {
      num = 0;
    }
    tip.html('正在进入游戏大厅' + '...'.substr(0, num) + '   '.substr(0, 4 - num));
  }, 200);

  /*
  $(".sure").click(function () {
      window.DB.exposure.singleClk({data: embed.confirm_submission_click});
      login();
  });

  $(".change").click(function () {
      changeName();
      window.DB.exposure.singleClk({data: embed.click});
  });

  $(".sex").click(function () {
      $(".sex").removeClass("chosed");
      $(this).addClass("chosed");
  });
  */
});

/*
function setMaskBg() {
    let data = CFG.bgUrl || '//yun.dui88.com/h5-mami/adpages/gameroom/v1/bg/pintu.png';
    $('.mask').css('background-image',`url('${data}')`);
}
*/

function getSaveData (key) {
  var data = CFG.deviceId;
  if (data == '0') {
    data = getStorage(key);
  }
  if (!data) {
    data = createUUID(64);
  }
  return data;
}

function createUUID (total) {
  var list = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var aim = [];
  for (var i = 0; i < total; i++) {
    var n = Math.floor(Math.random() * list.length);
    aim.push(list[n]);
  }
  var str = aim.join('');
  return str;
}

/*
function changeName(){
    $.get("/consumer/getNickName", nameData, function(data){
        console.log(data);
        nameData = data;
        $(".name").val(data.nickName);
    });
}
*/

function checkUse () {
  $.post('/consumer/commonLogin', {
    appKey: CFG.appKey || getUrlParameter('appKey'),
    slotId: CFG.slotId || getUrlParameter('slotId'),
    deviceId: deviceId
  }, function (data) {
    embed = data.embed;
    if (data && data.nickName) {
      // 老用户
      var param = {
        redirectUrl: CFG.redirectUrl || getUrlParameter('redirectUrl')
      };
      window.location = urlJsonParam('/consumer/updateConsumerInfo', param);
    } else {
      // 新用户
      /*
      changeName();
      $(".box").show();
      window.DB.exposure.singleExp(embed.exposure);
      window.DB.exposure.singleExp(embed.confirm_submission_exposure);
      $(".dt-mask").remove();
      */
      login();
    }
  });
}

function login () {
  /*
  var sex =  Math.floor(Math.random() * 3);
  var img = "//yun.tuisnake.com/h5-mami/webgame/web-login/header/header" + Math.floor(Math.random() * 4 + 1) + ".png";

  var param  = {
      appKey: CFG.appKey || getUrlParameter("appKey"),
      redirectUrl: CFG.redirectUrl || getUrlParameter("redirectUrl"),
      slotId: CFG.slotId || getUrlParameter("slotId"),
      deviceId: deviceId,
      tokenId: tokenId,
      sex: data.sex,
      nickName: data.nickName,
      img: img
  };
  */

  var param = {
    appKey: CFG.appKey || getUrlParameter('appKey'),
    redirectUrl: CFG.redirectUrl || getUrlParameter('redirectUrl'),
    slotId: CFG.slotId || getUrlParameter('slotId'),
    deviceId: deviceId,
    tokenId: tokenId
  };

  window.location = urlJsonParam('/consumer/updateConsumerInfo', param);
}

function urlJsonParam (url, obj) {
  var list = [];
  for (var i in obj) {
    list.push(i + '=' + encodeURIComponent(obj[i]));
  }
  return url + '?' + list.join('&');
};

function addTongDun () {
  _fmOpt = {
    partner: 'duiba',
    appName: 'tuia_h5',
    token: tokenId,
    fmb: true,
    getinfo: function () {
      return 'e3Y6ICIyLjUuMCIsIG9zOiAid2ViIiwgczogMTk5LCBlOiAianMgbm90IGRvd25sb2FkIn0=';
    }
  };

  var cimg = new Image(1, 1);
  cimg.onload = function () {
    _fmOpt.imgLoaded = true;
  };
  cimg.src = 'https://fp.fraudmetrix.cn/fp/clear.png?partnerCode=duiba&appName=tuia_h5&tokenId=' + _fmOpt.token;
  var fm = document.createElement('script'); fm.type = 'text/javascript'; fm.async = true;
  fm.src = (document.location.protocol == 'https:' ? 'https://' : 'http://') + 'static.fraudmetrix.cn/v2/fm.js?ver=0.1&t=' + (new Date().getTime() / 3600000).toFixed(0);
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(fm, s);
}

/*
function addTongDun() {
    var rid = tokenId;
    if (rid) {
        _fmOpt = {
            partner: 'duiba',
            appName: 'tuia_h5',
            token: rid
        };
        var cimg = new Image(1, 1);
        cimg.onload = function () {
            _fmOpt.imgLoaded = true;
        };
        cimg.src = `https://fp.fraudmetrix.cn/fp/clear.png?partnerCode=${_fmOpt.partner}&appName=${_fmOpt.appName}&tokenId=${_fmOpt.token}`;
        var fm = document.createElement('script');
        fm.type = 'text/javascript';
        fm.async = true;
        fm.src = document.location.protocol + 'static.fraudmetrix.cn/fm.js?ver=0.1&t=' + (new Date().getTime() / 3600000).toFixed(0);
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(fm, s);
    }
}
*/

function getCookie (cname) {
  var name = cname + '=',
    ca = document.cookie.split(';'), i, c,
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
  return '';
}

function setCookie (variable, value, day) {
  var d = new Date();
  d = new Date(d.getTime() + 1000 * 3600 * 24 * day);
  document.cookie = variable + '=' + value + '; expires=' + d.toGMTString() + ';';
}

function setStorage (key, value) {
  if (window.localStorage) {
    if (value == null) {
      localStorage.removeItem(key);
    } else {
      value && localStorage.setItem(key, value);
    }
  } else if (document.cookie) {
    setCookie(key, value, 30);
  } else {}
}

function getStorage (key) {
  if (window.localStorage) {
    return window.localStorage.getItem(key);
  } else if (document.cookie) {
    return $.cookie(key);
  } else {
    return null;
  }
}

function getUrlParameter (name, path) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null;
  }
}
