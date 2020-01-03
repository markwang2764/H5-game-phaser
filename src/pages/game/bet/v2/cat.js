import fact from './icons/iconFactory';
import Ads from './ads';

var Cat = function (game, parent, config) {
  this.gender = config.gender;
  this.depart = config.depart;
  this.id = config.id;
  this.parentId = config.parentId;
  this.name = config.name;
  this.isRoot = (this.parentId == null);
  this.game = game;
  this.base = game.add.group();
  parent.add(this.base);

  // 投注相关
  this.pit_all = 0;
  this.pit_self = 0;
};

var p = Cat.prototype;

p.onAdd = function () {
  this.bg_light = this.game.make.sprite(0, 0, 'bg_light');
  this.bg_light.anchor.set(0.5), this.bg_light.scale.set(0.9);
  this.bg_light.visible = false;
  this.base.add(this.bg_light);
  if (!this.isCommon()) {
    var cat = fact.getCat(this.game, this.id, this.name);
    if (cat) this.base.add(cat);
    cat.inputEnabled = true;
    cat.events.onInputDown.add(this.toBet, this);
  }
  if (this.isRoot) {
    [this.base.x, this.base.y] = [195 + 358 * (this.id), 165];
  } else {
    var xArr = [0, 0, 112, 275, 472, 635];
    var yArr = [448, 625, 805];
    if (this.isCommon()) {
      this.wrapper();
      this.base.y = yArr[this.id % 3];
      this.base.x = xArr[this.parentId];
    } else {
      this.base.y = 284;
      this.base.x = xArr[this.id];
    }
  }
  // 下注标签
  var resNmArr = ['bet_all', 'bet_self'];
  var yArr = [-30, -56];

  resNmArr.forEach(function (val, idx) {
    var grp = this.game.make.group();
    var bet = this.game.make.sprite(0, 0, val);
    bet.anchor.set(0.5), bet.scale.x = 1.05;
    grp.add(bet), [grp.x, grp.y] = [60, yArr[idx]], grp.visible = false;
    if (this.id >= 2 && this.id <= 5) {
      grp.y += 25;
    }
    var txt = this.game.make.text(0, 0, '0', {font: '22px Arial', fill: '#ffffff'});
    txt.anchor.set(0.5, 0.5), txt.y += 3, txt.name = 'points';
    grp.add(txt);
    grp.name = val;
    this.base.add(grp);
  }, this);
  // 下注光圈
  var light = this.game.make.sprite(0, 0, 'light');
  light.visible = false;
  light.anchor.set(0.5);
  light.x = 0, light.y = 0;
  this.light = light;
  this.base.add(light);

  // 提示气泡
  // var tip_group = this.game.add.group();
  // tip_group.name = 'tip_group';
  // this.base.add(tip_group);
	
  // var tipBubble = this.game.make.sprite(0, 0, 'tip_bubble');
  // tipBubble.anchor.set(0.5);
  // tipBubble.y = -90, tipBubble.x = 10;
  // tipBubble.name = 'bubble';
  // tip_group.add(tipBubble);

  // var tips = this.game.make.text(0, 0, "", {font: "20px Arial", fill: '#ffffff'});
  // tips.x = -100, tips.y = -120;
  // tips.name = 'tips';
  // tip_group.add(tips);
  // tip_group.visible = false;
};

p.toBet = function () {
  var BT = window.BT;
  if (!BT.app.dataMgr.betEnable) {
    showToast('本期已经截止，请等待开奖~');
    return;
  }
  var num = BT.transCliIdToSvrId(this.id);
  Ads.catExport(num);
  BT.app.netMgr.send(
    BT.MsgId.betReq,
    {
      id: num,
      lev: BT.app.dataMgr.gear
    });
};

p.onBetTip = function (info) {
  var tip_grp = this.base.getByName('tip_group');
	
  var txt = tip_grp.getByName('tips');
  var str = info;
  if (str.length > 11) {
    str = info.substr(0, 11) + '\n' + info.substr(11);
  }
  txt.text = str;
  tip_grp.visible = true;
  var wait = this.game.add.tween({});
  wait.to({}, 4000, null, true, 0, 0, false);
  wait.onComplete.addOnce(function () {
    var tw = this.game.add.tween(tip_grp);
    tw.to({alpha: 0}, 50, null, true, 0, 0, false);
    tw.onComplete.addOnce(function () {
      tip_grp.visible = false;
      tip_grp.alpha = 1;
    }, this);
  }, this);
};

// 响应下注通知
p.onBet = function (id, points) {
  var BT = window.BT;
  if (id === BT.app.dataMgr.selfId) {
    this.light.visible = true;
    var fire = this.light.animations.getAnimation('fire');
    if (!fire) {
      fire = this.light.animations.add('fire');
    }
    if (!fire.isPlaying) {
      fire.onComplete.addOnce(function (sprite, anim) {
        sprite.visible = false;
      }, this);
      fire.play(30, false);	
    }
  }
  // console.log("betId: %s, selfId: %s, self bet: ", id, BT.app.dataMgr.selfId, id === BT.app.dataMgr.selfId);
  if (id === BT.app.dataMgr.selfId) {
    this.pit_self += points;
    if (this.pit_self) {
      var grp = this.base.getByName('bet_self');
      grp.visible = true;
      var txt = grp.getByName('points');
      txt.text = BT.tostring(this.pit_self);
    }
  } else {
    this.pit_all += points;
    if (this.pit_all) {
      var grp = this.base.getByName('bet_all');
      grp.visible = true;
      var txt = grp.getByName('points');
      txt.text = BT.tostring(this.pit_all);
    }
  }
};
// 普通星座判定
p.isCommon = function () {
  return this.id >= 6;
};

// 普通星座猫精灵组装
p.wrapper = function (cc) {
  var boardHeight = 134;

  var grp = this.game.make.group();
  // 盒子
  var box = BT.getBox();
  box.scale.set(1.03, 1), box.anchor.set(0.5, 0.5), box.name = 'box';
  box.y = boardHeight - box.height / 2;
  // 猫
  var cc = this.game.make.sprite(0, 0, 'x_' + this.id);
  cc.name = 'cc', cc.anchor.set(0.5);
  // 盖子
  var heap = this.game.make.image(0, 0, 'heap');
  heap.anchor.set(0.5), heap.scale.set(1.03, 1), heap.name = 'heap';
  heap.y = boardHeight - heap.height / 2 - 1;
  // 星座名字
  var name = this.game.make.text(0, 0, this.name + '座', { font: '24px Arial', fill: '#ffffff' });
  name.anchor.set(0.5), name.name = 'name';
  name.x = box.width / 2, name.y = boardHeight - name.height / 2 + 5;
	
  grp['__height'] = boardHeight;
  grp.add(box), grp.add(cc), grp.add(heap), grp.add(name);

  var renders = fact.getCat(this.game, this.id, grp);
  if (renders) {
    var sp = renders[0];
    var shadow = this.game.make.sprite(0, 0, renders[1]);
    shadow.tint = 0x000000, shadow.alpha = 0.4;
    shadow.anchor.set(sp.anchor.x, sp.anchor.y);
    shadow.y = -6;
    this.base.add(shadow);
    this.base.add(sp);

    sp.inputEnabled = true;
    sp.events.onInputDown.add(this.toBet, this);
  }
};

// 开奖动画
p.showBig = function () {
  var filter = this.game.add.filter('MyShader');
  // var twF = this.game.add.tween(filter);
  // twF.to({saturation: 0.5, intensity: 0.4}, 90, null, true, 0, 0, false);
  // twF.onComplete.addOnce(function () {
  // 	twF.to({saturation: 0.0, intensity: 0.0}, 100, null, true, 0, 0, false);
  // }, this);	
  this.base.filters = [ filter ];
  this.base.blendMode = Phaser.blendModes.NORMAL;
  var tw = this.game.add.tween(this.base.scale);
  tw.to({x: 1.1, y: 1.1}, 100, null, true, 0, 0, false);
  tw.onComplete.addOnce(function () {
    this.base.filters = undefined;
    var tw1 = this.game.add.tween(this.base.scale);
    tw1.to({x: 1, y: 1}, 100, null, true, 0, 0, false);
  }, this);
};

p.show = function (delay) {
  this.startShow = true;
  this.bg_light.visible = true;
  this.bg_light.alpha = 0;
  // 整体放大，光效透明度逐渐增强
	
  if (delay) {
    setTimeout(function () {
      window.BT.app.playSound('sod-lottery1');
    }, delay);
  } else {
    window.BT.app.playSound('sod-lottery1');
  }
	
  var twA = this.game.add.tween(this.bg_light);
  twA.to({alpha: 1}, 100, null, true, delay, 0, false);
  var tw = this.game.add.tween(this.base.scale);
  tw.to({x: 1.2, y: 1.2}, 200, null, true, delay, 0, false);
  tw.onComplete.addOnce(function () {
    // 缩放比例恢复到正常大小
    var tw2 = this.game.add.tween(this.base.scale);
    tw2.to({x: 1, y: 1}, 100, null, true, 0, 0, false);
    tw2.onComplete.addOnce(function () {
      // 恢复后停留1s执行背光渐隐效果
      var emt = this.game.add.tween({});
      emt.to({}, 500, null, true, 0, 0, false);
      emt.onComplete.addOnce(this._afterShow, this);
    }, this);
  }, this); 
};

p._afterShow = function () {
  var tw = this.game.add.tween(this.bg_light);
  tw.to({alpha: 0}, 100, null, true, 0, 0, false);
  tw.onComplete.addOnce(function () {
    this.bg_light.visible = false;
    this.startShow = false;
    BT.app.evtMgr.emit({type: BT.EventType.INTER, id: BT.MsgId.catShowOver}, {id: this.id});
  }, this);
};

p.update = function (dlt) {
  if (this.startShow) {
    this.bg_light.rotation += 0.01;
  }
};

/** 是否在当期被投注 */ 
p.hasBets = function () {
  return (!!this.pit_self || !!this.pit_all);
};

/** 重开投注 */ 
p.restart = function () {
  var betGrpArr = ['bet_self', 'bet_all'];
  betGrpArr.forEach(function (grpNm, idx) {
    var grp = this.base.getByName(grpNm);
    var txt = grp.getByName('points');
    txt.text = 0;
    grp.visible = false;
  }, this);
  this.pit_all = 0;
  this.pit_self = 0;
};

p._x = function () {
  return this.base.x;
};

p._y = function () {
  return this.base.y;
};

p._w = function () {
  return 0;
};

p._h = function () {
  return 0;
};

var setAccessor = function (tar) {
  Object.defineProperties(tar, {
    x: {
      get: tar._x
    },
    y: {
      get: tar._y
    },
    width: {
      get: tar._w
    },
    height: {
      get: tar._h
    }
  });
};

setAccessor(p);

export default Cat;
