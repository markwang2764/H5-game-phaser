/** 主界面中，玩家信息展示 */
var SelfUI = function (game, parent) {
  this.game = game;
  this.base = parent;	

  /** 我的余额相关 */ 
  this.pit_counter = 0;
  this.pointsNow = 0;

  // 记录档位表
  this.gearList = [];
  // BT.app.dataMgr.gear = 1;

  window.BT.app.evtMgr.on(BT.MsgId.updateMoney, this.updateMoney, this);
  window.BT.app.evtMgr.on(BT.MsgId.setMoney, this.setMoney, this);
};

var p = SelfUI.prototype;

p.update = function (dlt) {
  if (this.pit_counter >= this.pointsNow) {
    return;
  }
  this.pit_counter += 20;
  if (this.pit_counter >= this.pointsNow) {
    this.pit_counter = this.pointsNow;
  }
  this.leftPoints.text = this.pit_counter;
};

p.updateMoney = function (evt) {
  console.log('evt = ' + evt);
  this.setPoint(this.pointsNow + evt.data);
};

p.setMoney = function (evt) {
  this.setPoint(evt.data);
};

p.onAdd = function () {
  this.left_group = this.game.add.group();
  this.base.add(this.left_group);
  var str1 = this.game.make.text(0, 0, '我的金币余额', {font: '24px Arial', fill: '#ffffff' });
  this.left_group.add(str1);
  str1.alpha = 0.8;
  this.left_group.x = 70, this.left_group.y = 1100;
  var bg_tip = this.game.make.sprite(0, 0, 'bg_tip');
  // bg_tip.anchor.set(0.5);
  bg_tip.alpha = 0.75;
  bg_tip.y = 35, bg_tip.x = 0;
  bg_tip.scale.set(0.4, 0.7);
  this.left_group.add(bg_tip);
  var coin = this.game.make.sprite(0, 0, 'coin');
  coin.anchor.set(0.5);
  this.left_group.add(coin);
  coin.y = 55, coin.x = 20;

  this.leftPoints = this.game.make.text(0, 0, this.pit_counter, {font: '20px Arial', fill: '#ffffff'});
  this.leftPoints.anchor.set(0.5);
  this.leftPoints.y = 58, this.leftPoints.x = 90;
  this.left_group.add(this.leftPoints);

  var add = this.game.make.sprite(0, 0, 'add');
  add.anchor.set(0.5);
  [add.x, add.y] = [186, 57];
  this.left_group.add(add);
  add.inputEnabled = true;
  add.events.onInputUp.add(function () {
    console.log('add coin to');
    window.showToastMoney();
  }, this);

  // 押注金额
  this.bet_group = this.game.add.group();
  this.base.add(this.bet_group);
  this.bet_group.x = 470, this.bet_group.y = 1100;
  var str2 = this.game.make.text(0, 0, '押注金额', {font: '24px Arial', fill: '#ffffff' });
  this.bet_group.add(str2);
  str2.alpha = 0.8;

  var bg_slide = this.game.make.sprite(0, 0, 'bg_slide');
  // bg_slide.anchor.set(0.5);
  bg_slide.alpha = 0.75;
  bg_slide.y = 35, bg_slide.x = 0;
  bg_slide.scale.set(0.9, 0.9);
  this.bet_group.add(bg_slide);
  this.slide_group = this.game.add.group();
  this.bet_group.add(this.slide_group);
  var slide = this.game.make.sprite(0, 0, 'slide');
  this.slide_group.add(slide);
  slide.anchor.set(0.5);
  this.slide_group.y = 58, this.slide_group.x = 40;
  var mount = JSON.parse(CFG.betAmount);
  var mountArr = [mount.first, mount.second, mount.third];
  mountArr.forEach(function (val, idx) {
    var str = this.game.make.text(0, 0, val, {font: '20px Arial', fill: '#ffffff'});
    str.anchor.set(0.5);
    str.y = 58, str.x = 40 + 70 * idx + idx * 5;
    this.bet_group.add(str);
    str.name = val;
    str.inputEnabled = true;

	    str.events.onInputDown.add(this.onSelected, this);
  }, this);
  this.gearList = mountArr;
  this.onSelected(this.bet_group.getByName(mount.first));

  this.setLottery();
};

p.setLottery = function () {
  var style = {
    font: '30px Arial',
    fill: '#ffe115',
    stroke: '#913f1a',
    strokeThickness: 6
  };
  var lottery = this.game.make.text(this.game.world.centerX, 970, '', style);
  lottery.anchor.set(0.5), lottery.name = 'lottery', lottery.visible = false;
  this.base.add(lottery);
};

p.onSelected = function (tar) {
  var dataMgr = BT.app.dataMgr;
  if (dataMgr.gear) {
    window.clickChangeCoin();
    if (this.pointsNow < parseInt(tar.name)) {
      showToast('余额不足，无法切换');
      return;
    }
  }
	
  var mountArr = this.gearList;
  mountArr.forEach(function (val, idx) {
    var str = this.bet_group.getByName(val);
    if (str.name == tar.name) {
      // str.addColor('#96460c', 0);
      str.fill = '#96460c';
      dataMgr.gear = idx + 1;
    } else {
      // str.addColor('#ffffff', 0);
      str.fill = '#ffffff';
    }
  }, this);
  var dis = Math.abs(tar.x - this.slide_group.x);
  if (dis <= 4) {} else {
    var tw = this.game.add.tween(this.slide_group);
    tw.to({x: tar.x}, 200, null, true, 0, 0, false);
    window.BT.app.playSound('sod-switch');
  }
};

/** 余额数字增长 */ 
p.onLottery = function (value) {
  this.pointsNow += value;
  var ltyGrp = this.base.getByName('lottery');
  [ltyGrp.x, ltyGrp.y] = [this.game.world.centerX, 1000];
  ltyGrp.text = '+' + value;
  ltyGrp.alpha = 0, ltyGrp.visible = true;
  var tw = this.game.add.tween(ltyGrp);
  tw.to({alpha: 1}, 1000, null, true, 0, 0, false);
  tw.onComplete.addOnce(() => {
    var wait = this.game.add.tween({});
    wait.to({}, 1000, null, true, 0, 0, false);
    wait.onComplete.addOnce(() => {
      ltyGrp.visible = false;
    });
  });
  ltyGrp.scale.set(0.7);
  var sclTw = this.game.add.tween(ltyGrp.scale);
  sclTw.to({x: 1, y: 1}, 1000, null, true, 0, 0, false);
};

/** 设置余额 */ 
p.setPoint = function (value) {
  this.pointsNow = value;
  this.pit_counter = value;
  this.leftPoints.text = value;
};

/** 判断是否够最低下注 */ 
p.checkCanMinBet = function () {
  if (this.pointsNow >= this.gearList[0]) {
    return true;
  }
  return false;
};

/** 下注 */ 
p.onBet = function (value) {
  this.pointsNow -= value;
  this.pit_counter = this.pointsNow;
  this.leftPoints.text = this.pointsNow;
};

export default SelfUI;
