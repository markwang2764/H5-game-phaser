import Ads from './ads';
import Tool from './tool';
import Shunt from './shunt';

var shunt = new Shunt();
var Pop = function () {
  
};

var p = Pop.prototype;

/** 救济金 */
p.showRelief = function (relief, data) {
  if (CFG.thirdRate) {
    window.CREATE && new window.CREATE.ExchangePop({
      embed: CFG.prizeEmbed,
      exchangeSuccess: function (data) {
        // store.amount = data.amount;
        console.log(data.amount);
        BT.app.evtMgr.emit({id: BT.MsgId.setMoney, type: BT.EventType.INTER}, {data: data.amount});
      },
      onClose: function () {

      }
    }).show();
    return;
  }
  var $this = this;
  var $mask = $('.jiuji-mask');
  $mask.show().css('display', 'flex');

  $('.jiuji-ads').css({
    'background-image': 'url(' + data.materialUrl + ')'
  });

  $('.jiuji-close').off('click').click(function () {
    $mask.hide();
    Ads.numClick('13.1');
  });

  $('.jiuji-ads').off('click').click(function () {
    $mask.hide();
    Ads.numClick('13.2');

    BT.app.netMgr.send(BT.MsgId.getAlmsReq);
    BT.saveInt('alms', relief.almsAmount);
    BT.app.evtMgr.emit({id: BT.MsgId.updateMoney, type: BT.EventType.INTER}, {data: relief.almsAmount});
    window.jumpAds($this.getTrueUrl(data));
  });

  $('.jiuji-btn').html('免费领取x' + relief.almsTimes).off('click').click(function () {
    $mask.hide();
    Ads.numClick('13.3');

    BT.app.netMgr.send(BT.MsgId.getAlmsReq);
    BT.app.evtMgr.once(BT.MsgId.getAlmsRsp, (res) => {
      console.log(res);
    });

    BT.saveInt('alms', relief.almsAmount);
    BT.app.evtMgr.emit({id: BT.MsgId.updateMoney, type: BT.EventType.INTER}, {data: relief.almsAmount});
    window.jumpAds($this.getTrueUrl(data));
  });

  Ads.numExport('13.1');
  Ads.numExport('13.2');
  Ads.numExport('13.3');
};

/** 游戏引流 */
p.showOtherGame = function(){
  var $this = this;
  var $mask = $('.jiuji-mask');
  $mask.show().css('display', 'flex');

  $(".jiuji-content").addClass("shunt");

  $('.jiuji-close').off('click').click(function () {
    $mask.hide();
    Ads.numClick('13.1');
  });

  $(".jiuji-btn").hide();

  shunt.show();
}

window.showOtherGame = p.showOtherGame;

/** 神秘礼盒 */
p.showGiftBox = function (data, isOver) {
  var $this = this;
  var $mask = $('.shenmi-mask');
  $mask.show().css('display', 'flex');

  $('.shenmi-ads').css({
    'background-image': 'url(' + data.materialUrl + ')'
  });

  $('.shenmi-all').html(data.advertName);

  $('.shenmi-close').off('click').click(function () {
    $mask.hide();
    if (isOver) {
      Ads.numClick('11.1');
    } else {
      Ads.numClick('12.1');
    }
  });

  $('.shenmi-ads').off('click').click(function () {
    $mask.hide();
    if (isOver) {
      Ads.numClick('11.2');
    } else {
      Ads.numClick('12.2');
    }

    window.jumpAds($this.getTrueUrl(data));
  });

  $('.shenmi-liqu').off('click').click(function () {
    $mask.hide();
    if (isOver) {
      Ads.numClick('11.3');
      window.jumpAds($this.getTrueUrl(data));
    } else {
      Ads.numClick('12.3');
      BT.saveStr('jump', $this.getTrueUrl(data));
    }
  });

  if (isOver) {
    Ads.numExport('11.1');
    Ads.numExport('11.2');
    Ads.numExport('11.3');
    $('.shenmi-tip').hide();
  } else {
    Ads.numExport('12.1');
    Ads.numExport('12.2');
    Ads.numExport('12.3');
    $('.shenmi-tip').show();
  }
};

p.getTrueUrl = function (data) {
  if (data.customAd === false) {
    return data.clickUrl + `&dpm=${window.store.dpm}&dcm=${window.store.dcm}&dsm=${window.store.dsm}`;
  }
   
  BT.httpPost('/puzzle/clickPuzzleAdvert', JSON.stringify({
    sessionKey: store.sessionKey,
    gameId: store.gameId,
    advertId: data.advertId,
    actOrderId: data.orderId,
    packageId: data.packageId,
    dcm: store.dcm,
    dpm: store.dpm,
    dsm: store.dsm
  }), (data) => {
        
  });
  return data.clickUrl;
};

/** 金币不足 */
p.showPoor = function () {
  var $mask = $('.poor-mask');
  $mask.show().css('display', 'flex');

  $('.poor-close').off('click').click(function () {
    $mask.hide();
    Ads.numClick('4.2');
  });

  $('.poor-get').off('click').click(function () {
    $mask.hide();
    Ads.numClick('4.3');
    window.location = CFG.moreUrl;
  });

  Ads.numExport('4.2');
  Ads.numExport('4.3');
};

/** 获得金币 */
p.showReceive = function (num) {
  var $mask = $('.receive-mask');
  $mask.show().css('display', 'flex');
  $('.receive-tip').html(num + '金币');
  setTimeout(() => {
    $mask.hide();
  }, 2000);
};

/** 显示提示信息 */
p.showToast = function (str, noMask) {
  var $mask = $('.toast-mask');
  $('.toast').html(str);
  if (noMask) {
    $mask.css('background', 'rgba(0, 0, 0, 0)').show().css('display', 'flex');
  } else {
    $mask.css('background', 'rgba(0, 0, 0, 0.72)').show().css('display', 'flex');
  }
  setTimeout(function () {
    $mask.hide();
  }, 2000);
};

/** 显示引导 */
p.showGuider = function () {
  var $mask = $('.mask');
  var timer = setInterval(() => {
    $mask.hide();
  }, 40);
  var $div = $('.guider-mask');
  $div.show();
  $div.click(function () {
    $div.hide();
    clearInterval(timer);
  });
};

var pop = new Pop();
export default pop;
