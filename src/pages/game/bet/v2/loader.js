
import StaticLoader from './staticLoader';

var Loader = function () {
  this.timer = 0;
  this.counter = 0;

  this.commonLoaded = false;
  this.avatorLoaded = false;
};

var p = Loader.prototype;

p.preload = function () {
  this.addListener();
  this.bg = this.game.add.sprite(0, 0, 'mbg');
  var bgC = this.game.add.graphics(0, 0);

  bgC.beginFill(0xb3a48a, 1);
  bgC.drawRect(0, 0, this.game.width, this.game.height);
  bgC.endFill();

  this.skin_group = this.getGroup(this.game.width >> 1, this.game.height >> 1);

  this.skin = this.getSprite('l_body');
  this.skin.anchor.set(0.5);
  this.skin.scale.set(0.7);
  this.skin_group.add(this.skin);
  this.pointList = [];
  for (var i = 0; i < 3; i++) {
    var cc = this.getSprite('l_point');
    cc.anchor.set(0.5), cc.scale.set(0.7);
    cc['__idx'] = i;
    cc.y = -40;
    cc.x = -30 + i * 30;
    this.skin_group.add(cc);
    this.pointList.push(cc);
  }
  this.shakeFish();

  var style = { font: 'bold 32px Arial', fill: '#ff0', boundsAlignH: 'center', boundsAlignV: 'middle' };
  var text = this.game.add.text(this.game.width >> 1, this.game.height / 2 + 160, '拼命加载中', style);
  text.anchor.set(0.5);
  // this.skin_group.add(text);
};

p.getGroup = function (x, y) {
  var grp = this.game.add.group();
  [grp.x, grp.y] = [x, y];
  return grp;
};

p.getSprite = function (nm) {
  return this.game.make.sprite(0, 0, nm);
};

p.shakeFish = function () {
  var tw = this.game.add.tween(this.skin_group);
  tw.to({y: (this.game.height >> 1) + 30}, 400, null, true, 0, 0, false);
  tw.onComplete.addOnce(function () {
    var ta = this.game.add.tween(this.skin_group);
    // CK.exetw(ta, {y: this.game.height >> 1}, 400);
    ta.to({y: this.game.height >> 1}, 400, null, true, 0, 0, false);
    ta.onComplete.addOnce(function () {
      this.shakeFish();
    }, this);
  }, this);
};

p.create = function () {
  // this.setBackGround();
  this.start();
  this.setPoint();
};

p.onEnter = function (data) {
  BT.app.dataMgr.load(data.players);
  this.state.start('Play');
  // this.state.start('StaticLoader', false, false, data.players);
};

p.update = function (game) {
  BT.app.update(game);
  var dlt = game.time.elapsed;
  if (this.timer >= 700) {
    this.counter += 1;
    this.timer = 0;
    this.setPoint();
  } else {
    this.timer += dlt;
  }
};

p.setPoint = function () {
  var show = this.counter % 4;
  this.pointList.forEach(function (c, idx) {
    if (idx < show) {
      c.visible = true;
    } else {
      c.visible = false;
    }
  });
};

p.start = function () {
  this.load.crossOrigin = 'anonymous';
  var host = window.CFG.host + '/h5-mami/webgame/bet/v2/';
  // yun.dui88.com/h5-mami/webgame/bet/v2/x_by.png
  this.load.image('bg', host + 'bg.png');
  this.load.image('x_0', host + 'x_male.png');
  this.load.image('x_1', host + 'x_female.png');
  this.load.image('x_2', host + 'x_fire.png');
  this.load.image('x_3', host + 'x_dust.png');
  this.load.image('x_4', host + 'x_wind.png');
  this.load.image('x_5', host + 'x_water.png');
  this.load.image('x_6', host + 'x_by.png');
  this.load.image('x_7', host + 'x_sz.png');
  this.load.image('x_8', host + 'x_ss.png');
  this.load.image('x_9', host + 'x_jn.png');
  this.load.image('x_10', host + 'x_cn.png');
  this.load.image('x_11', host + 'x_mj.png');
  this.load.image('x_12', host + 'x_tp.png');
  this.load.image('x_13', host + 'x_sp.png');
  this.load.image('x_14', host + 'x_shz.png');
  this.load.image('x_15', host + 'x_jx.png');
  this.load.image('x_16', host + 'x_tx.png');
  this.load.image('x_17', host + 'x_sy.png');
  this.load.image('lv1', host + 'nx_x2.png');
  this.load.image('lv2', host + 'nx_x4.png');
  this.load.image('lv3', host + 'nx_x12.png');
  this.load.image('free_bubble', host + 'x_free_bubble.png');
  this.load.image('tip_bubble', host + 'x_tips_bubble.png');
  this.load.image('box', host + 'box1.png');
  this.load.image('heap', host + 'heap1.png');
  this.load.script('filter', host + 'myShader.js');
  this.load.image('life', host + 'life.png');
  this.load.image('life_2', host + 'life_2.png');
  this.load.image('bg_tip', host + 'bg_tip.png');
  this.load.image('bg_slide', host + 'bg_slide.png');
  this.load.image('slide', host + 'slide.png');
  this.load.image('coin', host + 'coin.png');
  this.load.image('gift', host + 'gift_box.png');
  this.load.image('bet_all', host + 'bet_all.png');
  this.load.image('bet_self', host + 'bet_self.png');
  this.load.image('bg_light', host + 'asset/guangxiao3.png');
  this.load.image('add', host + 'add.png');
	
  // this.load.image(CK.data.selfId, CK.data.self.avator);
  // this.load.image('m_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/mouth_1.png');
  // this.load.image('m_2', '//yun.dui88.com/h5-mami/webgame/chicken/asset/mouth_2.png');

  this.load.spritesheet('saber', host + 'saber1.png', 270, 272, 10);
  this.load.spritesheet('light', host + 'lights.png', 221, 221, 10);
  this.load.spritesheet('belts', host + 'belts2.png', 200, 200, 5);

  this.load.audio('sod-bg', host + 'bgm2.mp3');
  this.load.audio('sod-huadong', host + '7-huadong.mp3');
  this.load.audio('sod-lunpan', host + 'lunpan2.mp3');
  this.load.audio('sod-maojiao', host + '10-maojiao.mp3');
  this.load.audio('sod-switch', host + '1-switch.mp3');
  this.load.audio('sod-lottery', host + '5-lottery.mp3');
  this.load.audio('sod-lottery1', host + '4-lottery1.mp3');
  this.load.audio('sod-lottery2', host + '4-lottery2.mp3');
  this.load.audio('sod-giftbox', host + '6-giftbox.mp3');
  this.load.audio('sod-bet', host + '11-bet.mp3');
  this.load.audio('sod-paizi', host + 'paizi.mp3');

  this.load.start();
};

p.setBackGround = function () {
  var box = this.game.add.graphics(0, 0);
  box.beginFill(0xb3a48a, 1);
  box.drawRect(0, 0, this.game.width, this.game.height);
  box.endFill();
};

p.addListener = function () {
  this.game.load.onLoadComplete.removeAll();
  this.game.load.onLoadComplete.addOnce(function (e) {
    // console.log(e)
    BT.app.netMgr.send(window.BT.MsgId.enterReq, null);
    var evt = window.BT.app.evtMgr;
    evt.on(BT.MsgId.enterRsp, this.onEnter, this);

    evt.emit({id: BT.MsgId.loaded, type: BT.EventType.INTER});
  }, this);
};

export default Loader;
