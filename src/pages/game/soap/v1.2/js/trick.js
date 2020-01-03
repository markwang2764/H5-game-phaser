/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:30:30 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-06-12 22:18:08
 * 道具弹窗
 */
function Trick() {
  this.$div = $(".tooler-mask");
  this.used = localStorage.getItem("used") == 1;
  this.callback = null;
  this.data = null;
  this.tid = 0;
  this.isVideoShow = false;
  this.init();
}

Trick.prototype.init = function () {
  //关闭
  $(".tooler-mask .fangqi").click(() => {
    if (this.isVideoShow) {
      embed.singleClk("mintegralCloseClick");
    } else {
      embed.singleClk("advertCloseClick");
    }
    this.hide();
    game.levelEnd(false);
  })

  //立即使用
  $(".tooler-mask .item-5517198").click(() => {
    if (this.isVideoShow) {
      embed.singleClk("mintegralUseClick");
    } else {
      embed.singleClk("useAdvertClick");
    }
    this.hide();
    this.used = true;

    httpPost("/soap/useProps", JSON.stringify({
      id: store.turnId,
      round: store.turnId,
      level: store.curLevel,
      score: game.power.score,
      sessionKey: store.sessionKey
    }), (data) => {
      //window.location = this.data.clickUrl;
    })

    if (this.isVideoShow) {
      // 1.2 版本显示视频广告
      window.myAd44420 && window.myAd44420.show();
    } else {
      game.useTrick();
      localStorage.setItem("autoJump", 1);

    }

  })

  //点击广告图片
  $(".tooler-mask .item-5458182").click(() => {
    localStorage.setItem("usePageExpose", JSON.stringify(embed.data.usePageExpose));
    localStorage.setItem("turnId", store.turnId);
    embed.singleClk("advertClick");
    game.cache.setState(1, "点击道具弹窗图片");
    this.autoJump();
  })
};

Trick.prototype.reset = function () {
  this.used = false;
  localStorage.setItem("used", 0);
};

Trick.prototype.getIsVideoShow = function () {
  return CFG.gameVersion === '1.2' && mintegralLoaded;
};

Trick.prototype.autoJump = function () {
  //window.location = this.data.clickUrl;
  //var soapPropsRsp = game.cache.resultData.soapPropsRsp;
  //var soapPropsRsp = game.cache.trickData;
  var soapPropsRsp = this.getAdsData();
  if (!soapPropsRsp.luckFlag) {
    httpPost("/puzzle/clickPuzzleAdvert", JSON.stringify({
      sessionKey: store.sessionKey,
      gameId: store.gameId,
      advertId: soapPropsRsp.advertId,
      actOrderId: soapPropsRsp.orderId,
      packageId: soapPropsRsp.packageId,
      dcm: getParamUrl("dcm"),
      dpm: getParamUrl("dpm"),
      dsm: getParamUrl("dsm")
    }), (data) => {
      this.redirect();
    })
  }
  else {
    this.redirect();
  }
};

Trick.prototype.getAdsData = function () {
  var soapPropsRsp = game.cache.trickData;
  if (!soapPropsRsp) {
    if (game.cache.resultData) {
      soapPropsRsp = game.cache.resultData.soapPropsRsp;
    }
  }
  return soapPropsRsp;
}

Trick.prototype.redirect = function () {
  var HOST = HTTP_HOST;
  //var soapPropsRsp = game.cache.trickData;
  var soapPropsRsp = this.getAdsData();
  var url = soapPropsRsp.clickUrl;
  if (url.indexOf(HOST + "/detailPage/redirect") != -1) {
    url = url + (url.indexOf("?") == -1 ? "?" : "&");
    url = url + "dcm=" + getParamUrl("dcm") + "&dpm=" + getParamUrl("dpm") + "&dsm=" + getParamUrl("dsm");
  }

  setTimeout(() => {
    window.location = url;
  }, 30);

  /*
  window.open(url);
  setTimeout(()=>{
      location.reload();
  }, 1800);
  */
};

Trick.prototype.show = function () {
  this.isVideoShow = this.getIsVideoShow();
  var has = false;
  if (store.propsRuleType == 0) {
    has = true;
  }
  else if (store.propsRuleType == 1) {
    var levels = store.levels.split(",");
    if (levels.indexOf(store.curLevel + "") != -1) {
      has = true;
    }
  }

  // this.used = false;//-------------------------------fuck
  // has = true;//-------------------------fuck

  if (this.used) {
    game.levelEnd(false);
  }
  else {
    if (has) {
      // 视频广告不请求券
      if (this.isVideoShow) {
        this.$div.show();
        this.setView();
        embed.updateMintegralEmbed();
        embed.singleExp("mintegralCloseExposure");
        embed.singleExp("mintegralUseExposure");

      } else {
        httpGet("/soap/getProps", {
          sessionKey: store.sessionKey,
          gameId: store.gameId,
          id: store.turnId,
          round: store.turnId,
          directId: store.directId,
          level: store.curLevel,
          dsm: getParamUrl("dsm"),
          dcm: getParamUrl("dcm"),
          dpm: getParamUrl("dpm")
        }, (data) => {
          data = changeJson(data);
          embed.update(data.data.soapyEmbedDto);
          if (data.data.isSuccess) {
            this.data = data.data;
            game.cache.saveTrickData(this.data);
            this.$div.show();
            this.setView();
            embed.singleExp("advertCloseExpose");
            embed.singleExp("advertExpose");
            embed.singleExp("useAdvertExpose");
          }
          else {
            game.levelEnd(false);
          }
        })
      }
    }
    else {
      game.levelEnd(false);
    }
    this.used = true;
  }

  if (this.used) {
    localStorage.setItem("used", 1);
  }
  else {
    localStorage.setItem("used", 0);
  }
};

Trick.prototype.setView = function () {
  if (!this.isVideoShow) {
    $(".item-5458182").css("background-image", `url(${this.data.materialUrl})`);
    $(".item-5528583").html(this.data.advertName);
  }
  $(".now-score .div-num").html(getNumberDivs(game.score.total + ""));
  // $(".now-score .div-num").html(game.score.total);

  var aim;
  var version = CFG.gameVersion;

  if (this.isVideoShow) {
    // 视频广告
    $(".tooler-mask").addClass("v1-2");
    $('.item-wenzi-jump').hide();
    aim = $(".item-5272592 .div-num");
  } else if (version === '1.0') {
    $(".tooler-mask").removeClass("v2 v1-2");
    $('.item-wenzi-jump').show();
    aim = $(".item-5517198 .div-num");
  } else {
    $(".tooler-mask").addClass("v2");
    $('.item-wenzi-jump').show();
    aim = $(".jixu-ma .div-num");
  }

  var $this = this;
  var counter = 8;
  aim.html(getNumberDivs("(" + counter + ")"));
  // aim.html("(" + counter + ")");
  this.tid = setInterval(function () {
    if (--counter < 0) {
      $this.hide();
      game.levelEnd(false);
    }
    else {
      aim.html(getNumberDivs("(" + counter + ")"));
      // aim.html("(" + counter + ")");
    }
  }, 1000);
};

Trick.prototype.hide = function () {
  this.$div.hide();
  clearInterval(this.tid);
};