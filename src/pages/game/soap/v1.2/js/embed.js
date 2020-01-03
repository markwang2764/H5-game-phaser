function Embed() {
  this.data = null;
}

Embed.prototype.init = function (callback) {
  httpGet("/soap/getIndexEmbed", {
    appId: getParamUrl("appId"),
    slotId: getParamUrl("slotId"),
    openId: getParamUrl("openId"),
    gameId: store.gameId,
    directId: store.directId,
    dsm: getParamUrl("dsm")
  }, (data) => {
    if (data) {
      data = changeJson(data);
      this.data = data.data;
    }
    callback && callback();
  })
};

Embed.prototype.update = function (obj) {
  console.log("update embed data");
  for (var i in obj) {
    if (obj[i]) {
      this.data[i] = obj[i];
    }
  }
};

Embed.prototype.singleExp = function (key) {
  if (!this.data) {
    console.log("埋点未初始化");
    return;
  }
  var obj = this.data[key];
  if (!obj) {
    console.log("对应埋点数据不存在");
    return;
  }
  window.DB.exposure.singleExp(JSON.stringify(obj));
}

Embed.prototype.singleClk = function (key) {
  if (!this.data) {
    console.log("埋点未初始化");
    return;
  }
  var obj = this.data[key];
  if (!obj) {
    console.log("对应埋点数据不存在");
    return;
  }
  var obj = this.data[key];
  window.DB.exposure.singleClk({data: obj});
}

/*
Embed.prototype.singleExp = function(type){
    if(!this.data){
        console.log("没有埋点数据");
        return;
    }
    var item;
    switch(type){
        case Embed.MA_SHANG:
            item = this.data.startPuzzleExpose;
            break;
        case Embed.LIANG_LING:
            item = this.data.getRewardLightExpose;
            break;
        case Embed.HUI_LING:
            item = this.data.getRewardBlackExpose;
            break;
        default:
            item = null;
            break;
    }
    window.DB.exposure.singleExp(JSON.stringify(item));
};

Embed.prototype.singleClk = function(type){
    if(!this.data){
        console.log("没有埋点数据");
        return;
    }
    var item;
    switch(type){
        case Embed.GUI_ZE:
            item = this.data.gameRuleClick;
            break;
        case Embed.JIANG_PIN:
            item = this.data.myPrizeClick;
            break;
        case Embed.MA_SHANG:
            item = this.data.startPuzzleClick;
            break;
        case Embed.HUI_LING:
            item = this.data.getRewardBlackClick;
            break;
        case Embed.WAN_CHENG:
            item = this.data.finishPuzzleClick;
            break;
        case Embed.LIANG_LING:
            item = this.data.getRewardLightClick;
            break;
        case Embed.XIA_GUAN:
            item = this.data.nextGameClick;
            break;
        default:
            item = null;
            break;

    }
    window.DB.exposure.singleClk({data: item});
};
*/

Embed.prototype.expOtherAds = function () {
  if (this.data.advertExpose) {
    var list = [];
    for (var i in this.data.advertExpose) {
      list.push(i + "=" + encodeURIComponent(this.data.advertExpose[i]));
    }
    var url = this.data.advertExpose.domain4Web + this.data.advertExpose.url + "?" + list.join("&");
    httpGet(url, {}, function () {
    });
  }
};

Embed.prototype.toJson = function (item) {
  if (item && typeof item === 'object') {
    item = JSON.stringify(item);
  }
  return item;
};

/**
 * 插入视频广告埋点
 */
Embed.prototype.updateMintegralEmbed = function () {
  let exposureBase = JSON.parse(this.toJson(this.data.gameRuleExpose));
  let clickBase = JSON.parse(this.toJson(this.data.gameRuleClick));

  let turnId = store.curLevel; // 当前关卡等级

  let mintegral_close = {
    dpm: exposureBase.dpm.split('.').splice(0, 2).join('.') + '.5.11',
    dcm: exposureBase.dcm.split('.').splice(0, 2).join('.') + '.2.' + turnId
  };

  let mintegral_use = {
    dpm: exposureBase.dpm.split('.').splice(0, 2).join('.') + '.5.13',
    dcm: exposureBase.dcm.split('.').splice(0, 2).join('.') + '.2.' + turnId
  };

  // 退出复活关页面按钮
  this.data.mintegralCloseExposure = $.extend(true, {}, exposureBase, mintegral_close);
  this.data.mintegralCloseClick = $.extend(true, {}, clickBase, mintegral_close);

  // 使用复活关页面按钮
  this.data.mintegralUseExposure = $.extend(true, {}, exposureBase, mintegral_use);
  this.data.mintegralUseClick = $.extend(true, {}, clickBase, mintegral_use);

};

