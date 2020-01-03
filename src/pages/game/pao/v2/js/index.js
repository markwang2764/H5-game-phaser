var w = window.innerWidth;
var h = 1206;
var game;
var store;
var embed;
var scale = 0;
var guider;
var inRank = true;

document.addEventListener('touchmove', function (e) {
  if (!inRank) {
    e.preventDefault();
  }
}, {passive: false});

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

window.dataTemplate = function (sid, data) {
  var jtemp = new JTemp(sid);
  var html = jtemp.build(data);
  return html;
}

window.getParamUrl = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null;
  }
}

window.httpGet = function (url, data, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    data: data,
    timeout: 3000,
    dataType: 'json',
    success: function (data) {
      callback && callback(data);
    },
    error: function (xhr, status) {
      console.log(xhr);
      console.log(status);
      // if (status === 'abort') {
      //   return;
      // }
      callback && callback();
    }
  })

}

window.httpPost = function (url, data, callback) {
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    timeout: 3000,
    dataType: 'json',
    success: function (data) {
      callback && callback(data);
    },
    error: function (xhr, status) {
      console.log(xhr);
      console.log(status);
      callback && callback();
    }
  })
}

function onExitGame() {
  $('.index-page').show();
  $('.game-page').hide();
}

function onEnterGame() {
  $('.index-page').hide();
  $('.game-page').show();
  if (store.gameReady) {
    game.replay();
  } else {
    setPlayerInfo();
    addEvent();
    inRank = false;
  }


  /*
  if(document.referrer == "" || document.referrer.indexOf("/direct/index") == -1){
      var gid = getParamUrl("id");
      if(getCookie("pop" + gid) == 1){
          console.log("普通登录弹层已显示过");
      }
      else{
          popUserReward();
          setCookie("pop" + gid, 1, 1);
      }
  }
  */
}

window.onload = function () {
  $(".toast-mask").hide();
  embed = new Embed();
  embed.init(function (suc) {
    console.log("embed data init");
    addIndexEvent();

    scale = window.innerWidth / 750;
    //if (window.innerHeight / window.innerWidth > 1206 / 750) {
    $(".stage, .bg, .mask").css("height", window.innerHeight + "px");
    $(".bottom").css("top", window.innerHeight - 164 * scale + 3 + "px");
    $(".info-ico,.btn-rank2,.btn-rule2").css({
      "top": window.innerHeight - 234 * scale + "px",
      "opacity": 1
    });
    //}

    store = new Store(function () {
      guider = new Guider();
      phgameInit();
      initGameScene();
    })

    showGamePop(popUserReward);
  });

  tryInitNewWall();
}
var store = null;
var newWallInitialized = false;
var createNewData = [];
var registry = null;

function tryInitNewWall() {
  store = new Store();
  getAnnoucement(function (ann) {
    newWallInitialized = true;
    initRegistry(ann);
    initNewsWall();
    setInterval(update, 30);
  });
  console.log('try to initialize new wall.');
}

function getAnnoucement(cb) {
  httpGet('/fish/getWinPublic', {}, function (data) {
    for (var i = 0; i < data.length; i++) {
      let obj = {};
      obj.announcement = data[i];
      obj.values = [];
      createNewData.push(obj)
    }
    // fix数据不存在或者数据只有一条时报错
    if (createNewData.length > 0) {
      if (createNewData.length === 1) {
        createNewData = createNewData.concat(createNewData);
      }
      cb && cb(createNewData);
    }
  });
}

function initRegistry(ann) {
  let ann2 = [];
  ann.forEach(function (item) {
    let e = {
      announcement: item.announcement,
      values: item.values
    };
    ann2.push(e);
  });

  registry = {
    luckWall: [],
    notify: []
  };
  let lw;
  let lastNotify;
  if (ann2.length > 1) {
    lw = ann2.slice(0, ann2.length - 1);
    lastNotify = ann2[ann2.length - 1];  // 最后一项为固定公告
    registry.luckWall = lw;
    registry.notify = [lastNotify]; // 将通知插入在第二条
  }
}


var wallList = [];
var curNews = null;
/**消息墙初始化标记 */
var isStarted = false;
var newsList = [];
var totalNewsNum = 0;

function initNewsWall() {
  let lwNum = registry.luckWall.length,
    notifyNum = registry.notify.length;
  totalNewsNum = lwNum + notifyNum;
  newsList = generateContent(lwNum, notifyNum);
  // 文字显示区域的宽度
  var showWidth = $(".new-tell").width() - $(".wall-ico-box").width();

  $(".new-wall").forEach(function (val, idx) {
    var wall = new NewWall(val, idx, showWidth);
    wall.changeContent(newsList[idx]);
    wallList.push(wall);
  });
  // 构造环形链表
  constructCircleList(wallList);
  curNews = wallList[0];
  isStarted = true;
}


var isMoveOff = false;
var isSlideOff = false;
var dlt = -0.5, s_counter = 0, m_counter = 0, nextNewsIdx = 0;

function update() {
  if (!isStarted) return;
  if (!curNews) return;
  if (isSlideOff) {
    if (m_counter < 50) {// 向左移动到头之后，停留1.5秒再向上滚动
      m_counter++;
    } else {
      wallList.forEach(function (val, idx) {
        if (!isMoveOff) {
          if (val.moveOff(dlt)) isMoveOff = true;
        } else if (s_counter >= 50) {// 向上滚动到指定位置之后，停留1.5秒，重置
          s_counter = 0, m_counter = 0;
          curNews.changeContent(newsList[nextNewsIdx]);
          if (++nextNewsIdx >= totalNewsNum) nextNewsIdx = 0;
          curNews = curNews.next;
          isMoveOff = false, isSlideOff = false;
        } else {
          s_counter++;
        }
      })
    }
  } else if (curNews.slideOff(dlt)) {
    isSlideOff = true;
  }
}


function constructCircleList(list) {
  if (!list instanceof Array) {
    console.warn('origin list is not an instance of Array!');
    return false;
  }
  for (var i = 0, j = list.length; i < j; i++) {
    if (i !== j - 1) {
      list[i]['next'] = list[i + 1];
    } else {
      list[i]['next'] = list[0];
    }
  }
  return true;
}

function generateContent(lwNum, nNum) {
  var lw = registry.luckWall;
  var notify = registry.notify;
  var list = [];
  for (var i = 0; i < lwNum; i++) {
    var tmp = {type: 1, content: lw[i].announcement, data: lw[i].values};
    list[i] = tmp;
  }
  for (var i = 0; i < nNum; i++) {
    list.push({type: 2, content: notify[i].announcement, data: notify[i].values});
  }
  return list;
}

var wallIconArr = ['', 'lucky.png', 'tell.png'];

function NewWall(div, idx, showWidth) {
  this.div = div;
  this.stepHeight = $(div).height(); // 默认行高
  // div.style.width = window.innerWidth + 'px';
  var container = $(div).find('.word-container')[0];
  container.style.width = showWidth + 'px';
  this.iconDiv = $(div).find('.wall-ico')[0];
  this.txtDiv = $(container).find(".wall-word")[0];
  this.showWidth = showWidth - 18;
  [this.offX, this.offY] = [0, this.stepHeight * idx];
  this.length = this.txtDiv.offsetWidth;
  this.move(this.div, 'translateY(' + this.offY + "px)");
  this.move(this.txtDiv, 'translateX(' + this.offX + 'px)');
}

NewWall.prototype.changeContent = function (content) {
  this.txtDiv.innerHTML = this.customInnerHtml(content.content, content.data);

  var list = this.txtDiv.innerHTML.split(/\[\d+\]/);
  var match = this.txtDiv.innerHTML.match(/\[(\d+)\]/);
  var id = parseInt(match[1]);
  var dataDom = [];
  var url = id == "1000" ? store.boss.imgUrl : store.monsters[id - 1].imgUrl;
  dataDom.push('<img src=' + url + ' />')
  var str = this.txtDiv.innerHTML.placeHolder(/\[\d+\]/, dataDom)
  this.txtDiv.innerHTML = str;

  this.length = this.txtDiv.offsetWidth;
  // this.iconDiv.style.backgroundImage = "url(//yun.tuisnake.com/h5-mami/adpages/gameroom/v1/" + wallIconArr[content.type] + ")";
}

String.prototype.placeHolder = function (holder, values) {
  let s = this;
  values.forEach(function (item) {
    s = s.replace(new RegExp(holder), function () {
      return item;
    });
  });
  return s;
};
NewWall.prototype.customInnerHtml = function (str, data) {

  if (!data.length) return str;
  //   if (str.indexOf('%s') < 0) return str;

  let dataDom = [];
  data.forEach(function (val, idx) {
    dataDom.push('<span class="tell-num">' + val + '</span>');
  });

  //     str = str.placeHolder('%s', dataDom)
  return str;
};

NewWall.prototype.moveOff = function (dlt) {
  if (this.offY <= (-1 * this.stepHeight)) {
    this.offY += this.stepHeight * wallList.length;
    this.offX = 0;
    this.move(this.div, this.getMoveStr('Y'));
    this.move(this.txtDiv, this.getMoveStr('X'));
    return true;
  } else {
    this.offY += dlt;
    this.move(this.div, this.getMoveStr('Y'));
    return false;
  }
}

NewWall.prototype.slideOff = function (dlt) {
  if (this.offX + this.length <= this.showWidth) {
    return true;
  } else {
    this.offX += dlt;
    this.move(this.txtDiv, this.getMoveStr('X'));
    return false;
  }
};

NewWall.prototype.getMoveStr = function (property) {
  return 'translate' + property + '(' + this['off' + property] + 'px)';
}

NewWall.prototype.move = function (div, eleStr) {
  div.style.transform = eleStr;
};


function initGameScene() {
  game = new Game(scale);
  game.init();
}

function addEvent() {
  $(".modes").hide();
  game.ready();

  $(".bg").css("background-image", "url(" + store.background + ")");

  $(".arena").click(function () {
    $(".modes").hide();
    embed.singleClk(Embed.TYPE_1);
    game.ready();
  });

  $(".infinite").click(function () {
    $(".modes").hide();
    embed.singleClk(Embed.TYPE_2);
    game.ready();
  });

  // $(".get").click(function () {
  //   embed.singleClk(Embed.TYPE_4);
  //   window.location = store.moreUrl;
  // })

  $('.new-add').show().on('click', function () {
    embed.singleClk(Embed.TYPE_4);
    if (CFG.thirdRate) {
      game.running = false;
      phready = false;
      window.CREATE && new window.CREATE.ExchangePop({
        embed: CFG.prizeEmbed,
        exchangeSuccess: function (data) {
          store.amount = data.amount;
          game.amount.update();
        },
        onClose: function () {
          game.running = true;
          phready = true;
        }
      }).show();
    } else {
      window.location = store.moreUrl;
    }
  });

  $('.top').on('click', function () {
    console.log('top click')
  })

  $(".rank-take, .rank-pic").click(function () {
    if (store.rankData.lottery && store.rankData.lottery.imgurl) {
      if ($(this).hasClass("rank-take")) {
        embed.singleClk(Embed.TYPE_7);
      }
      else {
        embed.singleClk(Embed.TYPE_6);
      }

      if (navigator.userAgent.indexOf('Android') > -1) {
        window.location = store.rankData.lottery.androidDownloadUrl;
      }
      else {
        window.location = store.rankData.lottery.iosDownloadUrl;
      }
    }
    else {
      // 按钮我知道了事件
      embed.singleClk(Embed.TYPE_10);
      $(".rank").hide();
      onExitGame();
      // $(".rank").hide();
      // //game.ready();
      // //$(".modes").show();
      // game.replay();
    }
  })

  $(".none-get").click(function () {
    embed.singleClk(Embed.TYPE_12);
    window.location = store.moreUrl;
  })

  $(".mask").on("touchmove", function (e) {
    var $this = $(e.target).parents(".info-scroll");
    if ($this.length == 0) {
      e.preventDefault();
    }
  })

  //embed.singleExp(Embed.TYPE_2);
  embed.singleExp(Embed.TYPE_3);
  embed.singleExp(Embed.TYPE_4);

  /*
  var jumpInto = false;
  if (jumpInto) {
      $(".modes").hide();
      game.ready();
  }
  else {
      embed.singleClk(Embed.TYPE_10);
      $(".rank").hide();
      //game.ready();
      //$(".modes").show();
      game.replay();
  }
  */
}

/**
 * 首页事件
 */
function addIndexEvent() {
  embed.singleExp(Embed.TYPE_1);
  embed.singleExp(Embed.TYPE_13);
  embed.singleExp(Embed.TYPE_15);

  $('.index-page .btn-start').on('click', function () {
    embed.singleClk(Embed.TYPE_1);
    onEnterGame();
  });

  $('.index-page .btn-rank2').on('click', function (ev) {
    var ev = ev || event;
    ev.stopPropagation();
    embed.singleClk(Embed.TYPE_13);
    showIndexRank();
  });

  $('.index-page .btn-rule2').on('click', function (ev) {
    var ev = ev || event;
    ev.stopPropagation();
    embed.singleClk(Embed.TYPE_15);
    game.info.show();
  });

  $('.index-page .indexrank-close').on('click', function (ev) {
    var ev = ev || event;
    embed.singleClk(Embed.TYPE_14);
    ev.stopPropagation();
    $('.indexrank').hide();
  });
}

function setIndexRank(data) {
  setIndexRankList(data);
  setIndexRankMe(data);
}

/**
 * 数字显示转换,不进行四舍五入
 * @param amount
 * @returns {*}
 */
function convertNumber(amount) {
  if (amount >= 1e8) {
    amount = (parseFloat(amount) / 1e8).toFixed(2)
    return amount.substring(0, amount.length - 1) + '亿'
  } else if (amount >= 1e5) {
    amount = (parseFloat(amount) / 1e4).toFixed(2)
    return amount.substring(0, amount.length - 1) + '万'
  } else {
    return amount;
  }
}

function getSexClass(sexType) {
  if (sexType == 1) {
    return 'male'
  } else if (sexType == 2) {
    return 'female'
  } else {
    return ''
  }
}

function getRankClass(idx) {
  if (idx === 0) {
    return 'first'
  } else if (idx === 1) {
    return 'second'
  } else if (idx === 2) {
    return 'third'
  } else {
    return '';
  }
}

function setIndexRankMe(data) {

  var $meItem = $('.indexrank .indexrank-item.me')
  // 初始化
  $meItem.removeClass('first second third');
  $meItem.removeClass('male female');
  $meItem.find('.item-rank').html('');
  $meItem.find('.item-amount-wrap').html('');
  $meItem.removeClass('empty');

  if (data.rank) {
    var rankText = data.rank <= 3 ? '' : data.rank;

    var rank = getRankClass(data.rank - 1)
    $meItem.addClass(rank)

    $meItem.find('.item-amount-wrap')
      .append('<div class="item-coin"></div>')
      .append('<div class="item-amount"></div>')

    $meItem.find('.item-amount').html(convertNumber(data.amount))
    $meItem.find('.item-rank').html(convertNumber(rankText));
  } else {
    // 当前用户未参与过游戏
    $meItem.addClass('empty');
    $meItem.find('.item-rank').append('<div class="rank-empty-text">无</div>');
    $meItem.find('.item-amount-wrap').append('<div class="rank-empty-text">开始你的第1次炮炮堂之旅吧</div>');

  }

  $meItem.find('.item-name').html(data.userName)
  $meItem.find('.item-avatar').attr('src', data.img)

  $meItem.find('.item-gender').addClass(getSexClass(data.sex));

}


function setIndexRankList(data) {
  var $rankList = $('.indexrank .indexrank-list');
  $rankList.html('');

  var list = data.leaderboards || [];

  // 没有得分记录
  if (list.length === 0) {
    // 显示前三条为空座
    for (var i = 0; i < 3; i++) {
      let rank = getRankClass(i);

      var itemEl =
        `<div class="indexrank-item ${rank}">
        <div class="item-rank">${convertNumber(i < 3 ? '' : i + 1)}</div>
        <div class="item-right-container">
          <div class="rank-empty">宝座空缺，快来登顶吧~</div>
        </div>
      </div>`
      $rankList.append(itemEl)
    }

  } else {
    list.forEach(function (item, index) {
      let sex = getSexClass(item.sex);
      let rank = getRankClass(index);

      var itemEl =
        `<div class="indexrank-item ${rank}">
        <div class="item-rank">${convertNumber(index < 3 ? '' : index + 1)}</div>
        <div class="item-right-container">
          <img class="item-avatar" src="${item.img}">
          <div class="item-right">
            <div class="item-name-wrap">
              <div class="item-name">${item.userName}</div>
              <div class="item-gender ${sex}"></div>
            </div>
            <div class="item-amount-wrap">
              <div class="item-coin"></div>
              <div class="item-amount">${convertNumber(item.amount)}</div>
            </div>
          </div>
        </div>
      </div>`;
      $rankList.append(itemEl)

    })
  }

}


function getIndexRank() {
  httpGet('/fish/getRankList', {gameId: getUrlParameter('id')}, function (data) {
    setIndexRank(data);
  });
}

function showIndexRank() {
  embed.singleExp(Embed.TYPE_14);
  $('.indexrank').show();
  getIndexRank();
}

function setPlayerInfo() {
  var $playInfo = $('.player-info');

  $playInfo.find('.amount').html(convertNumber(CFG.amount))
  $playInfo.find('.name').html(CFG.nick_name)
  $playInfo.find('.avatar').attr('src', CFG.headUrl).addClass(CFG.sex == 2 ? 'female' : '')
  $playInfo.find('.gender').addClass(getSexClass(CFG.sex));
}

function popUserReward() {
  var expdata = null;
  var clkdata = null;
  var loginType = 0;
  var embedData = JSON.parse(CFG.prizeEmbed);
  if (CFG.firstLogin == 0) {
    loginType = 3;
    expdata = embedData.st_info_exposure_normal_choose_game;
    clkdata = embedData.st_info_click_normal_choose_game;
  }
  else if (CFG.firstLogin == 1) {
    loginType = 2;
    expdata = embedData.st_info_exposure_first_choose_game;
    clkdata = embedData.st_info_click_first_choose_game;
  }
  else if (CFG.firstLogin == 2) {
    loginType = 1;
    expdata = embedData.st_info_exposure_daily_choose_game;
    clkdata = embedData.st_info_click_daily_choose_game;
  }
  window.addEventListener("message", function (event) {
    if (event.data === "showpop") {
      document.getElementById("pop").contentWindow.postMessage(JSON.stringify({
        loginType: loginType,
        userHeader: CFG.headUrl,
        userName: CFG.nick_name,
        inHall: false,
        amount: CFG.amount,
        rewardMoney: CFG.rewardAmount
      }), "*");
      $("#pop").show();

      window.DB.exposure.singleExp(JSON.stringify(expdata));
    }
    else if (event.data === "hidepop") {
      $("#pop").remove();
      window.DB.exposure.singleClk({data: JSON.stringify(clkdata)});
    }
  })

  $("body").append();
  var $div = $('<iframe id="pop"></iframe>');
  $div.css({
    position: "fixed",
    "z-index": 8,
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    border: "none",
    display: "none"
  });
  $div.attr("src", "//yun.dui88.com/h5-mami/webgame/user-pop/index.html");
  $div.appendTo($("body"));
}

function getCookie(cname) {
  var name = cname + "=",
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
  return "";
}

function setCookie(variable, value, day) {
  var d = new Date();
  d = new Date(d.getTime() + 1000 * 3600 * 24 * day);
  document.cookie = variable + '=' + value + '; expires=' + d.toGMTString() + ';';
}