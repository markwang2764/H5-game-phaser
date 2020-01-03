import '@css/common.less';
import './entry.less';
import JTemp from './template';
import Main from './main';
import CFG_DATA from './data';
import Pop from './pop';
import Ads from './ads';
import Tool from './tool';
import {getItemById} from './config';
import pop from './pop';
import ScrollDom from './scrollDom';
import Guider from './guider';

var aimId = 0;
var moveId = 0;

window.showStep = showStep;
window.showToast = showToast;
window.showGiftBox = showGiftBox;
window.showTimer = showTimer;
window.clickGiftBox = clickGiftBox;
window.clickChangeCoin = clickChangeCoin;
window.showPoor = showPoor;
window.jumpAds = jumpAds;
window.showToastMoney = showToastMoney;
window.updateWeek = updateWeek;

window.store = {
  dsm: BT.getParamUrl('dsm'),
  dcm: BT.getParamUrl('dcm'),
  dpm: BT.getParamUrl('dpm'),
  gameId: BT.getParamUrl('id'),
  sessionKey: CFG.uskA,
  almsAmount: BT.readInt('alms')// 救济金
};
window.CFG = window['CFG'] || {
  host: '//yun.dui88.com'
};

window.CFG.embed = JSON.parse(window.CFG.embed);

function getHtmlByData (sid, data) {
  var jtemp = new JTemp(sid);
  var html = jtemp.build(data);
  return html;
}

(function () {
  if (!/eruda=true/.test(window.location.href)) return;
  var oHead = document.head;
  var oScript = document.createElement('script');
  oScript.type = 'text/javascript';
  oScript.src = 'http://yun.dui88.com/h5-mami/optimize/eruda.min.js';
  oHead.appendChild(oScript);
  oScript.onload = function () { eruda.init(); };
})();

function testScroll () {
  var xings = [];
  for (var i = 0; i < 5; i++) {
    var id = i % 12;
    var obj = CFG_DATA[id + 6];
    // var obj = {name: "白羊座"};
    // obj.img = "asset/mojie-one.png";
    xings.push(obj);
  }
  var html = getHtmlByData('xingzuo', {list: xings});
  $('.result-zuos').html(html);

  var scrollDom = new ScrollDom($('.result-zuo'));
  // scrollDom.update();

  setInterval(() => {
    scrollDom.update();
  }, 40);

  $('.result-mask').show().css('display', 'flex');
   
  $('.result-step').hide();
  $('.result-content').show();
  $('.result-step0').hide();
  $('.result-step1').show();
}

$(function () {
  // testScroll();

  var xings = [];
  for (var i = 0; i < 15; i++) {
    var id = i % 12;
    var obj = CFG_DATA[id + 6];
    xings.push(obj);
  }
  var html = getHtmlByData('xingzuo', {list: xings});
  $('.result-zuos').html(html);

  $('.rule-txt').html(CFG.gameRule);

  var n = 1;
  $('.drag').click(function () {
    showDrag(n);
    Ads.numClick('5.8');
  });

  $('.back').click(function () {
    history.back();
  });

  showDrag(5);

  function showDrag (num) {
    if (num === 1) {
      $('.drag')[0].style.transform = 'rotate(180deg)';
      n = 5;
      $('.last-all').addClass('show');
      $('.last-list')[0].style.height = (40 * n) / 200 + 'rem';
      $('.last').css('height', (40 * n + 80) / 200 + 'rem');
    } else {
      $('.drag')[0].style.transform = 'rotate(0deg)';
      n = 1;
      $('.last-list').scrollTop(0);
      $('.last-all').removeClass('show');
      $('.last-list')[0].style.height = '0';
      $('.last').css('height', 54 / 200 + 'rem');
    }
  }

  $('body').on('touchstart', function (e) {
    var $node = $(e.target).parents('.last');
    if ($node.length === 0) {
      showDrag(5);
    }
  });

  $('.rule-close,.rule-know').click(function () {
    $('.rule-mask').hide();
  });

  $('.help').click(function () {
    $('.rule-mask').show().css('display', 'flex');
    Ads.numClick('2.1');
  });

  $('.float-ads').click(function () {
    Ads.numClick('5.2');
    Ads.getAds((data) => {
      if (data.success) {
        Pop.showGiftBox(data, true);
      } else {
        showToast('手气不佳，宝箱是空的~');
      }
    });
    $(this).hide();
  });
    
  // showReceive(6000);
  $('.toast-mask').hide();
  startEmbed();

  BT.httpGet('/puzzle/getPrize', {
    sessionKey: store.sessionKey,
    gameId: store.gameId,
    dsm: store.dsm
  }, function (data) {
    // CFG.nick_name = CFG.nickName;
    // CFG.headUrl = data.data.headUrl;
    // CFG.amount = data.data.amount;
    // CFG.rewardAmount = data.data.rewardAmount;
    // CFG.prizeEmbed = JSON.stringify(data.data.embed);
    // CFG.firstLogin = data.data.firstLogin;
    // showGamePop(popUserReward);
    // BT.app.evtMgr.emit({id: BT.MsgId.readyStart, type:BT.EventType.INTER});
  });

  BT.app.evtMgr.on(BT.MsgId.loaded, function () {
    if (store.almsAmount > 0) {
      BT.saveInt('alms', 0);
      showReceive(store.almsAmount);
    }
    showGuider();
  }, this);

  // window.addEventListener("pageshow", function(){
  //     window.location.reload();
  // })

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) location.reload(); // 如果检测到页面是从“往返缓存”中读取的，刷新页面
  });
  window.history.pushState('', '', location.href);
});

function showGuider () {
  if (Guider.getState(store.gameId, CFG.nickName)) {
    pop.showGuider();
  }
}

function startEmbed () {
  Ads.numExport('2.1');
  Ads.numExport('5.8');
  // Ads.numExport("5.1");
  Ads.numExport('5.7');
  Ads.numExport('5.6');
}

function updateWeek () {
  $('.last-content').html(getHtmlByData('history', {list: CFG.history || []}));
  setTimeout(() => {
    var txt = $('.last-item').eq(0).html();
    $('.last-week').html(txt.split(' ').pop());
  }, 30);
}

function showToastMoney () {
  var $this = this;
  Ads.numClick('5.6');
  if (CFG.thirdRate) {
    window.CREATE && new window.CREATE.ExchangePop({
      embed: CFG.prizeEmbed,
      exchangeSuccess: function (data) {
        // store.amount = data.amount;
        // $this.score.update();
        BT.app.evtMgr.emit({id: BT.MsgId.setMoney, type: BT.EventType.INTER}, {data: data.amount});
      },
      onClose: function () {

      }
    }).show();

    // window.DB.exposure.singleClk({
    //     data: JSON.stringify(embed.data.st_info_click_get),
    //     callback: () => {}
    // });
  } else {
    // $(".none").show();
    // embed.singleExp(Embed.TYPE_11);
    // embed.singleExp(Embed.TYPE_12);
    // $this.running = false;

    // $(".none-close").one("click", function(){
    //     $(".none").hide();
    //     $this.running = true;
    //     embed.singleClk(Embed.TYPE_11);
    // })
    setTimeout(function () {
      window.location = CFG.moreUrl;
    }, 120);
  }
}

function showGiftBox () {
  Ads.numExport('5.1');
}

function showTimer (num) {
  $('.wait-num').html(num);
}

function jumpAds (url, wait) {
  if (wait) {
    showToast('2秒后跳转广告...');
    setTimeout(() => {
      window.location.href = url;
    }, 2000);
  } else {
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }
}

function clickGiftBox () {
  Ads.numClick('5.1');
  Ads.getAds((data) => {
    if (data.success) {
      Pop.showGiftBox(data);
    } else {
      showToast('糟糕，宝箱是空的~');
    }
  });
}

function clickChangeCoin () {
  Ads.numClick('5.7');
}

function showPoor () {
  BT.app.netMgr.send(BT.MsgId.almsReq);
  BT.app.evtMgr.once(BT.MsgId.almsRsp, (res) => {
    console.log(res);
    // res.almsAmount;
    // res.almsTimes;
    if (res.almsTimes > 0) {
      Ads.getAds((data) => {
        if (data.success) {
          Pop.showRelief(res, data);
        } else {
          Pop.showOtherGame();
          // Pop.showPoor();
        }
      });
    } else {
      // Pop.showPoor();
      Pop.showOtherGame();
    }
  }, this);
}

function showReceive (num) {
  pop.showReceive(num);
}

function showToast (str, noMask) {
  pop.showToast(str, noMask);
}

function showStep (n) {
  $('.result-mask').show().css('display', 'flex');
  aimId = n;
  setTimeout(function () {
    step1();
  }, 30);
  setTimeout(function () {
    step2();
    anime({
      targets: '.result-zhen',
      opacity: 1,
      easing: 'easeInOutSine',
      duration: 300
    });
    Ads.numExport('5.2');
    $('.float-ads').show();
  }, 1200);
  setTimeout(function () {
    step3();
    anime({
      targets: '.result-zhen',
      opacity: 0,
      easing: 'easeInOutSine',
      duration: 300
    });
  }, 6400);
  setTimeout(function () {
    $('.result-mask').hide();
    BT.app.evtMgr.emit({type: BT.EventType.INTER, id: BT.MsgId.lottery}, {id: n + 5});
    var url = BT.readStr('jump');
    if (url) {
      BT.saveStr('jump', '');
      jumpAds(url, true);
    }
  }, 10000);

  $('.float-ads').css({
    'background-image': `url(${CFG.boxImage})`
  });

  console.log(CFG.allRewards);

  var list = CFG.allRewards.sort(function (a, b) {
    return a.amount < b.amount;
  });
  console.log(list[0]);
  if (list[0] && list[0].amount > 0) {
    $('.result-step .result-tip').html(`
        玩家<span class="result-red">【${list[0].nickName}】</span>运筹帷幄，获得本期最高奖励<span class="result-red red-num">${list[0].amount}</span>金币
        `);
  } else {
    $('.result-step .result-tip').html(`本期没有用户猜中，请再接再励哦~`);
  }
}

function step1 () {
  $('.result-mask').show();
  $('.result-step').hide();
  $('.result-step0').show();
  $('.result-content').hide();

  $('.result-mask').attr('class', 'mask result-mask feng');

  $('.result-zuos').css({
    transform: 'translateX(0)'
  });

  $('.result-zuo .result-name').css({
    opacity: 1
  });

  $('.result-zuo').css({
    transform: 'translate(0, 0)',
    scale: 1,
    opacity: 1
  });

  $('.result-list div').css({
    opacity: 0
  });
}

function step2 () {
  $('.result-content').show();
  $('.result-step0').hide();
  $('.result-step1').show();

  moveTo(aimId);
  // window.BT.app.playSound("sod-huadong");
    
  setTimeout(function () {
    window.BT.app.playSound('sod-lunpan');
    var sod = window.BT.app.sods['sod-lunpan'];
    var JSobject = anime({
      targets: sod,
      volume: 0,
      easing: 'linear',
      duration: 800,
      delay: 3000,
      update: function () {
        // console.log(sod.volume);
      }
    });
    window.BT.app.playSound('sod-huadong');
  }, 300);
}

function step3 () {
  window.BT.app.playSound('sod-maojiao');
    
  $('.result-step2').show();

  $('.result-zuo .result-name').css({
    opacity: 0
  });

  var obj = getItemById(aimId);

  if (obj) {
    $('.result-mask').attr('class', 'mask result-mask ' + obj.zuo);
    $('.result-sex').html((obj.gender === 1 ? '傲娇' : '软萌') + obj.sex + '猫');
    $('.result-xiang').html(obj.xing + '星座');
    $('.result-xing').html(obj.name + '座');
  }

  setTimeout(function () {
    BT.app.playSound('sod-paizi');
  }, 60);

  setTimeout(function () {
    BT.app.playSound('sod-paizi');
  }, 360);

  setTimeout(function () {
    BT.app.playSound('sod-paizi');
  }, 720);

  var nodes = document.querySelectorAll('.result-zuo');
  var list = [];
  var aim;
  for (var i = 0; i < nodes.length; i++) {
    if (i == moveId - 1) {
      aim = nodes[i];
    } else {
      list.push(nodes[i]);
    }
  }

  // $(".result-zuo").css("opacity", 0);
  // aim.style.opacity = 1;

  // if(aimId < 4){
  //     aim = nodes[(moveId - 1) % 12 + 12];
  // }
  // else{
  //     aim = nodes[(moveId - 1) % 12];
  // }
  if (aimId === 2) {
    aim = nodes[aimId - 1];
  } else if (aimId > 2) {
    aim = nodes[aimId - 1];
  } else {
    aim = nodes[aimId - 1 + 12];
  }

  $('.result-zuo').css('opacity', 0);
  aim.style.opacity = 1;

  anime({
    targets: aim,
    translateX: 120 / 200 + 'rem',
    translateY: 2 / 200 + 'rem',
    scale: 1.32,
    easing: 'easeInOutSine',
    duration: 900
  });

  // anime({
  //     targets: list,
  //     opacity: 0,
  //     easing: 'easeInOutSine',
  //     duration: 300
  // })

  // anime({
  //     targets: ['.result-btn'],
  //     rotateX: 0,
  //     translateX: 0,
  //     translateY: 0,
  //     scale: 1,
  //     opacity: 1,
  //     easing: 'easeInOutSine',
  //     duration: 900,
  //     delay: function(target, index){
  //         return index * 400;
  //     }
  // })
}

function moveTo (id) {
  if (id < 9) {
    id = id % 12 + 24;
  } else {
    id = id % 12 + 24;
  }
  moveId = id;
  // var aim = (-(30 + (160 + 30) * id) + 596 / 2 + 30 + 160 / 2) / 200 + 'rem';
  var aim = (-(30 + (160 + 30) * id) + 596 / 2 + 30 + 160 / 2) / 200;
  // anime({
  //     targets: ['.result-zuos'],
  //     translateX: aim,
  //     easing: 'easeInOutSine',
  //     duration: 4000,
  //     delay: 500
  // });

  var $div = $('.result-zuos');

  var op = {num: 0};
  anime({
    targets: op,
    num: aim,
    easing: 'easeInOutSine',
    duration: 4000,
    delay: 500,
    update: function () {
      // console.log("num = " + op.num + ", " + op.num % 11.39);
      $div.css('transform', 'translateX(' + op.num % 11.39 + 'rem)');
    }
  });
}
