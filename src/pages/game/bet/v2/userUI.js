
var UserUI = function (game, parent) {
  this.game = game;
  this.base = game.add.group();
  parent.add(this.base);
};

var p = UserUI.prototype;

p.onAdd = function (info) {
  this.userId = info.usk;
  this.index = info.index;
  // 背景白板
  var bg = this.game.make.graphics();
  bg.beginFill(0xffffff, 1);
  var radius = 50, y = 980, x = 110 + 133 * info.index, lifeResNm = 'life';
  var labelY = y + 45;
  if (info.index === 2) {
    radius = 70;
    y = 970, x = 375;
    lifeResNm += '_2';
    labelY = y + 55;
  }
  bg.drawCircle(0, 0, radius);
  bg.endFill();
  this.base.add(bg);
  this.base.y = y, this.base.x = x;

  // 头像
  this.setAvator(info.usk);

  // 昵称
  var name = this.game.make.text(0, 0, info.name, { font: '24px Arial', fill: '#ffffff' });
  name.anchor.set(0.5);
  name.y = bg.y + 45;
  if (info.index === 2) name.y = bg.y + 55;
  name.name = 'name';
  this.setName(name, info.nickName);
  this.base.add(name);

  // 血条
  var life = this.game.make.sprite(0, 0, lifeResNm);
  life.anchor.set(0.5);
  life.y = name.y + 30;
  this.base.add(life);

  this.curPoints = this.game.make.text(0, 0, '0', { font: '21px Arial', fill: '#ffffff' });
  this.curPoints.anchor.set(0.5);
  this.curPoints.y = life.y + 5;
  this.base.add(this.curPoints);

  var light = this.game.make.sprite(0, 0, 'light');
  light.visible = false;
  light.anchor.set(0.5);
  light.x = 0, light.y = 0;
  this.light = light;
  this.base.add(light);
};

p.setName = function (name, nick) {
  var str = nick;
  var ret = str.match(/[\W | \w]/g);
  var idx = nick.length, len = 0;
  if (ret) {
    for (var i = 0, j = ret.length; i < j; i++) {
      var char = ret[i];
      if (char.match(/[\w]/)) {
        len += 1;
      } else {
        len += 2;
      }
      if (len === 8) {
        idx = i + 1;
        break;
      } else if (len > 8) {
        idx = i;
        break;
      }
    }
  }
  str = nick.substr(0, idx);
  if (idx < nick.length) {
    str += '..';
  }
	
  name.text = str;
};

p.setAvator = function (uid) {
  var avator = this.game.make.sprite(0, 0, uid);
  // console.log(avator.key);
  if (avator.key === '__missing') {
    avator = this.game.make.sprite(0, 0, BT.app.dataMgr.selfId);
  }
  avator.anchor.set(0.5);
  avator.name = 'avator';
  var rate = 50;
  if (uid === BT.app.dataMgr.selfId) {
    rate = 70;
  }
  avator.scale.set(rate / avator.width);
  var mask = this.game.add.graphics(0, 0);
  mask.name = 'mask';
  mask.beginFill(0xff0000, 0.4);
  mask.drawCircle(0, 0, avator.width - 4);
  mask.endFill();
  avator.mask = mask;
  this.base.add(avator);
  this.base.add(mask);
};

p.load = function (info) {
  this.userId = info.usk;
  this.setAvator(info.id);
  var nmTxt = this.base.getByName('name');
  this.setName(nmTxt, info.nickName);
  this.curPoints.text = 0;
  this.base.visible = true;
};

p.shinning = function () {
  this.light.visible = true;
  var fire = this.light.animations.add('fire');
  fire.onComplete.addOnce(function (sprite, anim) {
    sprite.visible = false;
  }, this);
  fire.play(30, false);
};

p.onLottery = function (val) {
  // this.curPoints.text = val;
  if (this.userId === BT.app.dataMgr.selfId) {
		
  }
};

/** 每当玩家押注，玩家头像下方需要实时更新投注总额 */
p.onBet = function (val) {
  var old = parseInt(this.curPoints.text);
  this.curPoints.text = old + val;
};

p.hide = function () {
  this.base.visible = false;
  var avt = this.base.getByName('avator');
  if (!avt) {
    this.base.remove(avt);
  }
  var msk = this.base.getByName('msk');
  if (!msk) {
    this.base.remove(msk);
  }
};

/** 重开 */ 
p.restart = function () {
  this.curPoints.text = 0;
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

export default UserUI;
