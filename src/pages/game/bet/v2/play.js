import config from './config';
import Cat from './cat';
import UserUI from './userUI';
import SelfUI from './selfUI';
import GiftBox from './giftBox';
import {getItemById} from './config';
import TipBubble from './tipBubble';
import pool from './objectPool';

var dura = 50;
window.roundId = 0;

var Play = function () {
  this.catDict = {};
  this.userDict = {};

  /** 开奖相关 */
  this.lty_handler = null;
  this.lty_counter = 0;

  /** 个人信息面板 */
  this.selfUI = null;

  /** 开奖时收集动画播放完毕事件 */
  this.showOverCounter = 0;

  /** 房间可用座位号，玩家自己永远是2号 */
  this.seatList = [0, 1, 3, 4]; 

  /** 主循环控制器 */
  this.started = false;

  // 投注剩余时间计时器
  this.betTimer = 0;
  this.betLeftTime = 0;

  /** 开奖重复请求标记 */ 
  this.ltyReqHandler = null;

  /** 礼盒掉落计时器 */ 
  this.adv_timer = 0;
  this.adv_status = 0;

  /** 当前游戏状态 */ 
  this.status = 1;

  /** 首次进入游戏 */ 
  this.isFirst = true;

  /** 心跳计时器 */ 
  this.heartTimer = 0;
};

var p = Play.prototype;

p.preload = function () {
};

p.addLoadListener = function (cb) {
  this.game.load.onLoadComplete.removeAll();
  this.game.load.onLoadComplete.addOnce(cb, this);
};

p.create = function () {
  // this.game.lockRender = true;
  $('.ui').show();
  this.load.crossOrigin = 'anonymous';
	
  var players = BT.app.dataMgr.getUsers();
	
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var head_url = BT.wxHeadUrlFix(player.headImg);
    this.load.image(player.usk, head_url);
  }
  this.addLoadListener(this.start);
  this.load.start();
};

p.start = function () {
  this.base = this.game.add.group();

  this.setBackGround();
	
  this.loadCats();
  this.loadUsers();
	
  this.addSelfInfo();
  this.addListener();
  this.tipBubble = new TipBubble(this.game, this.base);
  this.tipBubble.onAdd();
  // 查询投注剩余时间，当前房间状态等信息
  BT.app.netMgr.send(BT.MsgId.startReq);
  this.started = true;
  window.BT.app.playSound('sod-bg', true);
};
// 添加事件监听
p.addListener = function () {
  var evt = window.BT.app.evtMgr;
  evt.on(BT.MsgId.lottery, this.onShowLottery, this);
  evt.on(BT.MsgId.catShowOver, this.lottery, this);
  evt.on(BT.MsgId.bet, this.toBet, this);
  evt.on(BT.MsgId.tipBubble, this.onShowTipBubble, this);

  evt.on(BT.MsgId.addPlayerRsp, this.onOtherEnter, this);
  evt.on(BT.MsgId.betRsp, this.onBet, this);
  evt.on(BT.MsgId.betLimitRsp, this.onBetLimitRsp, this);
  evt.on(BT.MsgId.betLowRsp, this.onBetLowRsp, this);
  evt.on(BT.MsgId.betStatusRsp, this.onBetStatusRsp, this);
  evt.on(BT.MsgId.betErrorRsp, this.onBetErrorRsp, this);
  evt.on(BT.MsgId.leaveRsp, this.onPlayerLeaves, this);
  evt.on(BT.MsgId.startRsp, this.onStatusRsp, this);
  evt.on(BT.MsgId.lotteryRsp, this.onLottery, this);
};

/** 显示投注提示气泡 */ 
p.onShowTipBubble = function (param) {
  var cat = this.catDict[param.id];
  this.tipBubble.onBetTip(cat.x, cat.y, param.tip);
};

p.getNoWin = function (list) {
  var obj = {};
  for (var i = 0; i < list.length; i++) {
    var n = list[i];
    if (!obj[n]) {
      obj[n] = {
        last: i + 1
      };
    }
  }

  var id = 1;
  var last = 1;
  var has = false;
  for (var i = 1; i <= 12; i++) {
    if (!obj[i]) {
      id = i;
      last = 50;
      has = true;
    }
  }
	
  if (!has) {
    id = 1;
    last = 1;
    for (var i in obj) {
      if (last < obj[i].last) {
        last = obj[i].last;
        id = i;
      }
    }
  }
	
  var item = getItemById(id);
  if (item) {
    var tip = item.name + '座已经' + last + '次未出现了，赶紧试试吧！';
    BT.app.evtMgr.emit({type: BT.EventType.INTER, id: BT.MsgId.tipBubble}, {id: item.id, tip: tip});
  } else {
    console.log('异常: ' + id);
  }
};

p.update = function (game) {
  BT.app.update(game);
	
  if (!this.started) return;
  var dlt = game.time.elapsed;
  this.timer(dlt);
  this.heartBeat(dlt);

  BT.forEach(this.catDict, function (val, key) {
    val.update(dlt);
  }, this);
  // 个人面板有数字增长效果，所以需要跟随主循环
  this.selfUI.update(dlt);

  this.giftBoxCheck(dlt);
};

p.heartBeat = function (dlt) {
  if (this.heartTimer >= 1000) {
    this.heartTimer = 0;
    BT.app.netMgr.send(BT.MsgId.addPlayerReq);
  } else {
    this.heartTimer += dlt;
  }
};

/** 礼盒掉落检测 */ 
p.giftBoxCheck = function (dlt) {
  if (this.adv_timer >= 5000 && this.adv_status && !this.status) {
    var gbox = this.base.getByName('gbox');
    if (gbox) {
      return;
    }
    this.dropBox();
  } else {
    this.adv_timer += dlt;
  }
};

/** 投注倒计时 */
p.timer = function (dlt) {
  // console.log(dlt);
  this.focusMiss();
  if (this.betLeftTime <= 0) return;
	
  if (this.betTimer >= 1000) {
    this.betTimer = 0;
    this.betLeftTime--;
    this.setTime();
  } else {
    this.betTimer += dlt;
  }
};

p.focusMiss = function () {
  var now = new Date().getTime();
  if (this.last) {
    var elapsed = now - this.last;
    if (elapsed >= 1000) { // 暂时只考虑失焦时间大于1秒的情况，这个步长太短的话可能会影响性能
      var sec = Math.floor(elapsed / 1000);
      if (this.betLeftTime > sec) {
        this.betLeftTime -= sec;
      } else if (this.betLeftTime <= 0) { // 说明是在开奖过程中离开的
        this.restart();
      } else {
        this.betLeftTime = 0;
        this.setTime();
      }
    }
  } 
  this.last = now;
};

p.setBackGround = function () {
  // 添加背板
  var bg = this.game.make.sprite(0, 0, 'bg');
  this.base.add(bg);

  // 添加倍数标签
  var resArr = ['lv1', 'lv2', 'lv3'], yArr = [200, 310, 395], valArr = CFG.returnTimes;
  if (typeof valArr === 'string') {
    valArr = JSON.parse(valArr);
  }
	
  resArr.forEach(function (val, idx) {
    var lv = this.game.make.sprite(this.game.width >> 1, yArr[idx], val);
    var style = { font: '20px Arial', fill: '#ffcc43'};
    // if(idx >= 2) style.fill = '#ffd6aa';
    var lvLabel = this.game.make.text(this.game.width >> 1, yArr[idx] + 2, 'x' + valArr['lev' + (idx + 1)], style);
    lvLabel.anchor.set(0.5);
    this.base.add(lv);
    this.base.add(lvLabel);
    lv.anchor.set(0.5);
  }, this);
};

/** 载入所有猫信息 */
p.loadCats = function () {
  config.forEach(function (val, idx) {
    var cat = new Cat(this.game, this.base, val);
    this.catDict[val.id] = cat;
    cat.onAdd();
  }, this);
};

/** 此方法仅提供进入房间时，当前房间内所有玩家信息的初始化 */
p.loadUsers = function () {
  // 这里应该使用enter_room接口发来的玩家数据
  var users = BT.app.dataMgr.getUsers();

  // console.log('进入房间时所有玩家信息',users);

  var ui = new UserUI(this.game, this.base);
  var my = BT.app.dataMgr.self;
  my.index = 2;
  ui.onAdd(my);
  this.userDict[2] = ui;
  // this.playerNum = users.length;
  for (var i = users.length - 1; i >= 0; i--) {
    if (users[i].usk === BT.app.dataMgr.selfId) continue;
    this.addPlayer(users[i]);
  }
  // console.log('初始化后玩家信息：', this.userDict);
  // console.log('当前剩余座位：', this.seatList);
};

/** 当有玩家进入房间时调用 */
p.addPlayer = function (info) {
  var index = this.seatList.shift();
  if (index === undefined || index === null) {
    console.warn('无剩余座位，添加玩家失败');
    return;
  }

  var ui = this.userDict[index];
  info.index = index;
  if (!ui) {
    ui = new UserUI(this.game, this.base);
    ui.onAdd(info);
    this.userDict[index] = ui;
  } else {
    ui.load(info);
  }
};

/** 设置倒计时时间 */ 
p.setTime = function () {
  if (this.betLeftTime === 0) {
    BT.app.dataMgr.betEnable = false;
    console.log('请求开奖，本期是：%s', this.curNum);
    BT.app.netMgr.send(BT.MsgId.lotteryReq, {number: this.curNum});
  }
  window.showTimer(this.betLeftTime);
};

// 房间状态信息查询响应
p.onStatusRsp = function (data) {
  console.log('房间状态信息查询响应，当前状态：%s', data.status);
  var list = [];
  for (var i = 0; i < data.winIdHis.length; i++) {
    list.push(getItemById(data.winIdHis[i]));
  }
  CFG.history = list;

  CFG.advertStatus = data.advertStatus;
  CFG.noWin = this.getNoWin(data.winIdHis);
  this.selfUI.setPoint(data.balance);
	
  updateWeek();
  // 当前为第几期投注，开奖查询时使用
  this.curNum = data.number;

  window.roundId = data.number;
  // 首次请求响应，服务器处于开奖状态
  if (this.isFirst && data.status) {
    this.betLeftTime = 0;
    this.isFirst = false;
    this.curNum = data.number;
    this.setTime();
    return;
  }
  this.isFirst = false;
  if (data.status && !this.restartReqHandler) {
    this.startReqRepeat();
    return;
  }
  if (this.restartReqHandler) {
    clearInterval(this.restartReqHandler);
    this.restartReqHandler = null;
  }
	
  BT.app.dataMgr.betEnable = true;
  this.betLeftTime = 30 - Math.floor((data.now - data.time) / 1000);
	
  this.adv_status = data.advertStatus;
  this.status = data.status;
  this.adv_timer = 0;
	
  this.setTime();
  showToast('请开始竞猜', true);
};

/** 如果查询重开结果失败，需要每隔1s重复查询重开结果 */ 
p.startReqRepeat = function () {
  this.restartReqHandler = setInterval(() => {
    BT.app.netMgr.send(BT.MsgId.startReq);
  }, 1000);
};

/** 接收到自己的投注响应时发射事件：BT.MsgId.bet */
p.toBet = function () {
  BT.app.evtMgr.remove(BT.MsgId.bet, this.toBet);
};

// 押注失败（超过每日上限）
p.onBetLimitRsp = function (data) {
  showToast(data.msg.split(' ').join('<br>'));
};

// 押注失败（余额不足）
p.onBetLowRsp = function (data) {
  // showToast("押注失败（余额不足）");
  if (this.selfUI.checkCanMinBet()) {
    showToast('余额不够，请切换押注金额');
  } else {
    showPoor();
  }
};

// 押注失败（开奖状态）
p.onBetStatusRsp = function (data) {
  showToast('本期已经截止，请等待开奖~');
};

// 押注失败（系统异常）
p.onBetErrorRsp = function (data) {
  showToast('押注失败（系统异常）');
};

/** 其他玩家进入房间 */ 
p.onOtherEnter = function (data) {
  var data = data.player;
  // 服务器会广播一个多余的信息，其中仅包含玩家自身信息
  if (data.usk === BT.app.dataMgr.selfId) {
    return;
  }
  if(this.cache.checkImageKey(data.usk)) {
    this.addPlayer(data);
    return;
  }
  // var tmp = this.game.make.sprite(data.usk);
	
  // if (!!tmp && tmp.key === data.usk) {
    
  // }
  var head_url = BT.wxHeadUrlFix(data.headImg);
  this.load.image(data.usk, head_url);

  this.load.onFileComplete.removeAll();
  this.load.onFileComplete.addOnce(function (e) {
    this.addPlayer(data);
  }, this);

  this.load.onFileError.removeAll();
  this.load.onFileError.addOnce(function (e) {

  });
	
  this.load.start();
};

/** 玩家离开房间时调用 */
p.onPlayerLeaves = function (data) {

  var uid = data.usk;
  var ui = this.getUserById(uid);
  if (!ui) {
    console.warn('房间不存在玩家：%s', data.usk);
    return;
  }
  this.seatList.push(ui.index);
  this.seatList.sort(function (a, b) {
    return a >= b;
  });
  ui.hide();
};

/** 初始化玩家余额信息，初始化投注档位组件 */
p.addSelfInfo = function () {
  this.selfUI = new SelfUI(this.game, this.base);
  this.selfUI.onAdd();
};

/** 下注 */
p.onBet = function (data) {
  // 这个标识：BT.app.dataMgr.betEnable只有在投注倒计时结束时才会置为false
  // 此时请求开奖结果并在弹层展示
  if (!BT.app.dataMgr.betEnable) {
    return;
  }
  var user = this.getUserById(data.usk);
  if (!user) return;
	
  window.BT.app.playSound('sod-bet');
  user.onBet(data.amount);

  if (user.userId === BT.app.dataMgr.selfId) {
    BT.app.evtMgr.emit({type: BT.EventType.INTER, id: BT.MsgId.bet});
    this.selfUI.onBet(data.amount);
    this.adv_timer = 0;
  }

  var cat = this.catDict[BT.transSvrIdToCliId(data.id)];
  cat.onBet(data.usk, data.amount);
	
  // return;

  var group = pool.getObj(this.game, 'group');
  this.base.add(group);
	
  for (var i = 0; i < 5; i++) {
    var coin = pool.getObj(this.game, 'coin');

    coin.visible = true, coin.alpha = 1;

    coin['__index_id'] = i;
    coin.x = user.x + (10 - i * 5), coin.y = user.y;
		
    group.add(coin);
    var tw = this.game.add.tween(coin);
	
    tw.to({x: cat.x, y: cat.y}, 100, null, true, i * 30, 0, false);
    tw.onComplete.addOnce(function (sprite, anim) {
      this.step_5(sprite, sprite['__index_id']);
    }, this);
  }
};

/** 开奖结果响应 */ 
p.onLottery = function (data) {
  if (!data.code && !this.ltyReqHandler) {
    this.startLotteryReqRepeat();
    return;
  } else if (!data.code) {
    return;
  }
  if (this.ltyReqHandler) {
    clearInterval(this.ltyReqHandler);
    this.ltyReqHandler = null;
  }
  this.status = 1;
  var gbox = this.base.getByName('gbox');
  if (gbox) { gbox.destroy(); }
  // if(!!this.giftBox) {
  // 	this.giftBox.destroy();
  // }
  this.rewards = data.rewards;
  this.winBetId = data.winBetId;
  CFG.allRewards = data.rewards;
  console.warn(data);
  showStep(data.winBetId);
  // setTimeout(function () {
  // 	BT.app.evtMgr.emit({type: BT.EventType.INTER, id: BT.MsgId.lottery}, {id: data.winBetId + 5});	
  // }, 10000);
};

/** 如果查询开奖结果失败，需要每隔1s重复查询开奖结果 */ 
p.startLotteryReqRepeat = function () {
  this.ltyReqHandler = setInterval(() => {
    BT.app.netMgr.send(BT.MsgId.lotteryReq, {number: this.curNum});
  }, 1000);
};

/** 弹层动画结束后调用 */
p.onShowLottery = function (param) {
  var bigArr = this.getTreeNodes(param.id);
  bigArr.forEach(function (val, idx) {
    val.show(100 * idx);
  });
};

/** 获取中奖树节点 */ 
p.getTreeNodes = function (cid) {
  var lty_cat = this.catDict[cid];
  if (!lty_cat) return [];
  var lty_depart = this.catDict[lty_cat.parentId];
  var lty_root = this.catDict[lty_depart.parentId];
  return [lty_root, lty_depart, lty_cat];
};

/** 开奖金币动画，要等待三个猫展示动画都结束以后再发金币 */
p.lottery = function (param) {
  this.showOverCounter++;
  if (this.showOverCounter < 3) {
    return;
  }
  this.showOverCounter = 0;

  var param = {
    id: BT.transSvrIdToCliId(this.winBetId), 
    users: []
  };

  this.curRewards = {};
  this.rewards.forEach(function (val, idx) {
    var ui = this.getUserById(val.usk);
    if (!!ui && !!val.amount) {
      param.users.push(ui.index);
      this.curRewards[ui.index] = val.amount;
    }
  }, this);
	
  var nodes = this.getTreeNodes(param.id);

  var userIdList = param.users;
  this._beforeLottery(userIdList);
  // 如果自己中奖了，播放烟花粒子特效
  if (userIdList.indexOf(2) >= 0) {
    this.playParticale();
    this.selfUI.onLottery(this.curRewards[2]);
  }
  nodes.forEach(function (cat, idx) {
    if (!cat.hasBets() || !userIdList.length) {
      return;
    }
    cat.showBig();
    var tw = this.game.add.tween({});
    tw.to({}, 200 * idx + 10, null, true, 0, 0, false);
    tw.onComplete.addOnce(function () {
      userIdList.forEach(function (uidx, i) {
        this.coinFly(cat.id, uidx);
      }, this);
      window.BT.app.playSound('sod-lottery2');
    }, this);
  }, this);

  var twOut = this.game.add.tween({});
  twOut.to({}, 2000, null, true, 0, 0, false);
  twOut.onComplete.addOnce(function () {
    this.restart();
  }, this);
};

p.restart = function () {
  console.log('游戏重新开始');
  BT.forEach(this.catDict, function (cat, id) {
    cat.restart();
  }, this);
  BT.forEach(this.userDict, function (ui, idx) {
    ui.restart();
  }, this);
  if (this.giftBox) {
    this.giftBox.restart();
  }
	
  BT.app.netMgr.send(BT.MsgId.startReq);
};

p._beforeLottery = function (userIdList) {
  if (!(userIdList instanceof Array)) {
    userIdList = [];
  }
};

p.getUserById = function (id) {
  for (var prop in this.userDict) {
    if (!this.userDict.hasOwnProperty(prop)) continue;
    var user = this.userDict[prop];
    if (user.userId === id) {
      return user;
    }
  }
};

/** 创建一个金币飞行动画，飞行路线从指定的猫到指定的玩家 */ 
p.coinFly = function (cid, idx) {
  // var group = this.game.add.group();
  var group = pool.getObj(this.game, 'group');
  var cat = this.catDict[cid];
  var user = this.userDict[idx];
  this.base.add(group);
  for (var i = 0; i < 5; i++) {
    // var coin = this.game.make.sprite(0, 0, 'coin');
    var coin = pool.getObj(this.game, 'coin');
    coin.visible = true, coin.alpha = 1;
    coin.scale.set(0.4);
    coin['__index_id'] = i;
    coin.x = cat.x + (10 - i * 5), coin.y = cat.y;
    group.add(coin);
    this.step_1(coin, i, {x: user.x, y: user.y}, user);
  }
};

p.step_1 = function (coin, i, u, user) {
  var tw1 = this.game.add.tween(coin);
  tw1.to({y: coin.y - 30}, dura, null, true, i * 50, 0, false);
  var tw11 = this.game.add.tween(coin.scale);
  tw11.to({x: 0.8, y: 0.8}, dura, null, true, i * 50, 0, false);
  tw1.onComplete.addOnce(function () {
    this.step_2(coin, i, u, user);
  }, this);
};

p.step_2 = function (coin, i, u, user) {
  var tw2 = this.game.add.tween(coin);
  var tw21 = this.game.add.tween(coin.scale);
  tw2.to({y: coin.y + 30, x: coin.x + 8 - 10 * i}, dura, null, true, i * 50, 0, false);
  tw21.to({x: 1.5, y: 1.5}, dura, null, true, i * 20, 0, false);
  tw2.onComplete.addOnce(function () {
    this.step_3(coin, i, u, user);
  }, this);
};

p.step_3 = function (coin, i, u, user) {
  var tw3 = this.game.add.tween(coin);
  tw3.to({y: coin.y - 30}, dura, null, true, i * 10, 0, false);
  tw3.onComplete.addOnce(function () {
    this.step_4(coin, i, u, user);
  }, this);
};

p.step_4 = function (coin, i, u, user) {
  var tw4 = this.game.add.tween(coin);
  tw4.to({x: u.x, y: u.y}, 200, null, true, i * 50, 0, false);
  tw4.onComplete.addOnce(function () {
    if (coin['__index_id'] === 0) {
      if (user) {
        user.shinning();
      }
    }
    this.step_5(coin, i);
  }, this);
};

p.step_5 = function (coin, i) {
  var tw5 = this.game.add.tween(coin);
  tw5.to({alpha: 0}, 30, null, true, i * 50, 0, false);
  tw5.onComplete.addOnce(function () {
    // 每组最后一个金币已经到达终点，准备回收金币所在group
    if (coin['__index_id'] === 4) {
      var grp = coin.parent;
      if (grp) {
        grp.removeAll();
        if (grp.parent) {
          grp.parent.remove(grp);
        }
        pool.recycle(grp);
      }
    }
    pool.recycle(coin);
  });
};

p.dropBox = function () {
  if (CFG.advertStatus === 1) {
    // return;
    this.giftBox = new GiftBox(this.game, this.base);
    this.giftBox.onAdd();
    // if(!this.giftBox) {
			
    // } else {
    // 	this.giftBox.start();
    // }
    window.showGiftBox();
  }
};

p.playParticale = function () {
  var xArr = [-50, this.game.width + 50];
  var rates = [1, -1];
  xArr.forEach(function (val, idx) {
    var rate = rates[idx];
    var emitter = this.game.add.emitter(val, -60);
    emitter.bounce.setTo(0.5, 0.5);
    emitter.setXSpeed(1200 * rate, 1800 * rate);
    emitter.setYSpeed(-100, 2000);
    emitter.setScale(0.4, 1);
    emitter.setAlpha(0.4, 1);
    emitter.setRotation(40, 180);
    emitter.gravity = 2000;
    emitter.width = 800;
    emitter.makeParticles('belts', [0, 1, 2, 3, 4, 5], 50, 5, false);
		
    this.game.time.events.add(2000, function () {
      emitter.destroy();
    }, this);
    if (idx) {
      this.game.time.events.add(200, function () {
        emitter.start(false, 5000, 10); 
      }, this);
    } else {
      emitter.start(false, 5000, 10); 
    }
  }, this);
};

export default Play;
