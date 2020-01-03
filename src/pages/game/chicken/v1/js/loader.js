var CK = CK || {};

(function () {
  var Loader = function () {
    this.timer = 0;
    this.counter = 0;
  };

  var p = Loader.prototype;

  p.preload = function () {
    this.addListener();
    this.bg = CK.getSprite('mbg');
    var bgC = this.game.add.graphics(0, 0);
    bgC.beginFill(0x000000, 0.75);
    bgC.drawRect(0, 0, this.game.width, this.game.height);
    bgC.endFill();

    this.skin_group = CK.getGroup(this.game.width >> 1, this.game.height >> 1);

    this.skin = CK.getSprite('l_body');
    this.skin.anchor.set(0.5);
    this.skin_group.add(this.skin);
    this.pointList = [];
    for (var i = 0; i < 3; i++) {
      var cc = CK.getSprite('l_point');
      cc.anchor.set(0.5);
      cc['__idx'] = i;
      cc.y = -55;
      cc.x = -30 + i * 30;
      this.skin_group.add(cc);
      this.pointList.push(cc);
    }
    this.shakeFish();
  };

  p.shakeFish = function () {
    var tw = CK.getTween(this.skin_group);
    tw.to({y: (this.game.height >> 1) + 30}, 400, null, true, 0, 0, false);
    tw.onComplete.addOnce(function () {
      var ta = CK.getTween(this.skin_group);
      CK.exetw(ta, {y: this.game.height >> 1}, 400);
      ta.onComplete.addOnce(function () {
        this.shakeFish();
      }, this);
    }, this);
  };

  p.create = function () {
    this.start();
    this.setPoint();
  };

  p.update = function (game) {
    var dlt = game.time.elapsed;
    CK.app.update(game);
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
    this.load.image('bg', '//yun.dui88.com/h5-mami/webgame/chicken/asset/bg1.jpg');
    // this.load.image('match_bg', '//yun.dui88.com/h5-mami/webgame/chicken/asset/match_bg.png');
    this.load.image('bullet_0', '//yun.dui88.com/h5-mami/webgame/chicken/asset/bullet_0.png');
    this.load.image('bullet_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/bullet_1.png');
    this.load.image('hurt', '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_red_6.png');
    this.load.image('reduce', '//yun.dui88.com/h5-mami/webgame/chicken/asset/one.png');
    this.load.image('dead', '//yun.dui88.com/h5-mami/webgame/chicken/asset/dead.png');
    this.load.image('item', '//yun.dui88.com/h5-mami/webgame/chicken/asset/tool.png');
    this.load.image('b_increace', '//yun.dui88.com/h5-mami/webgame/chicken/asset/bullet_incr.png');
    this.load.image('bg_head_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/bg_head_1.png');
    this.load.image('bg_head_0', '//yun.dui88.com/h5-mami/webgame/chicken/asset/bg_head_0.png');
    this.load.image('ripe', '//yun.dui88.com/h5-mami/webgame/chicken/asset/ripe1.png');
    this.load.image('ready', '//yun.dui88.com/h5-mami/webgame/chicken/asset/ready.png');
    this.load.image('go', '//yun.dui88.com/h5-mami/webgame/chicken/asset/go.png');
    this.load.image('arrow', '//yun.dui88.com/h5-mami/webgame/chicken/asset/arrow.png');
    this.load.image('I', '//yun.dui88.com/h5-mami/webgame/chicken/asset/I.png');
    this.load.image('heart', '//yun.dui88.com/h5-mami/webgame/chicken/asset/heart.png');
    this.load.image('win_0', '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_blue_4.png');
    this.load.image('win_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_red_4.png');
    this.load.image('sex_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/sex_1.png');
    this.load.image('sex_2', '//yun.dui88.com/h5-mami/webgame/chicken/asset/sex_2.png');
    this.load.image('vs', '//yun.dui88.com/h5-mami/webgame/chicken/asset/VS.png');
    this.load.image('emoji_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/emoji_1.png');
    this.load.image('emoji_2', '//yun.dui88.com/h5-mami/webgame/chicken/asset/emoji_2.png');
    this.load.image('emoji_3', '//yun.dui88.com/h5-mami/webgame/chicken/asset/emoji_3.png');
    this.load.image('emoji_4', '//yun.dui88.com/h5-mami/webgame/chicken/asset/emoji_4.png');
    this.load.image('tip', '//yun.dui88.com/h5-mami/webgame/chicken/asset/font.png');
    this.load.image('guide', '//yun.dui88.com/h5-mami/webgame/chicken/asset/guide.png');
    this.load.image(CK.data.selfId, CK.data.self.avator);
    // this.load.image('m_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/mouth_1.png');
    // this.load.image('m_2', '//yun.dui88.com/h5-mami/webgame/chicken/asset/mouth_2.png');

    this.load.spritesheet('buildup_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/buildup_1.png', 88, 100, 8);
    this.load.spritesheet('wing_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/wing_1.png', 67, 91, 6);
    this.load.spritesheet('wing_2', '//yun.dui88.com/h5-mami/webgame/chicken/asset/wing_2.png', 67, 91, 6);
    this.load.spritesheet('attack', '//yun.dui88.com/h5-mami/webgame/chicken/asset/attack.png', 190, 175, 6);
    this.load.spritesheet('buff', '//yun.dui88.com/h5-mami/webgame/chicken/asset/buff.png', 204, 260, 10);
    this.load.spritesheet('buildup_2', '//yun.dui88.com/h5-mami/webgame/chicken/asset/buildup_2.png', 88, 92, 8);
    this.load.spritesheet('jet', '//yun.dui88.com/h5-mami/webgame/chicken/asset/jet.png', 74, 115, 6);
    this.load.spritesheet('mouth', '//yun.dui88.com/h5-mami/webgame/chicken/asset/mouth.png', 44, 52, 2);
    this.load.spritesheet('reborn', '//yun.dui88.com/h5-mami/webgame/chicken/asset/reborn.png', 176, 158, 12);

    this.load.spritesheet('chicken_0', '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_0.png', 119, 126, 3);
    this.load.spritesheet('chicken_1', '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_1.png', 119, 126, 3);
    this.load.spritesheet('click', '//yun.dui88.com/h5-mami/webgame/chicken/asset/click.png', 100, 100, 14);
		
    this.load.start();
  };

  p.setBackGround = function () {
    var box = this.game.add.graphics(0, 0);
    box.beginFill(0xb4d9e7, 1);
    box.drawRect(0, 0, this.game.width, this.game.height);
    box.endFill();
  };

  p.addListener = function () {
    this.game.load.onLoadStart.add(function () {
      // var oy = this.skin.y;
      // this.add.tween(this.skin).to({y: oy + 50}, 200, Phaser.Easing.Bounce.InOut, true, 0, -1, false);
    }, this);
    this.game.load.onLoadComplete.removeAll();
    this.game.load.onLoadComplete.add(function () {
      this.state.start('Match');
    }, this);
  };

  CK.Loader = Loader;
})();
