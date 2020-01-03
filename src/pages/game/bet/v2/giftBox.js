var GiftBox = function (game, parent) {
  this.game = game;
  this.gift_group = this.game.add.group();
  this.gift_group.name = 'gbox';
  parent.add(this.gift_group);
};

var p = GiftBox.prototype;

p.onAdd = function () {
  var saber = this.game.make.sprite(0, 0, 'saber');
  saber.name = 'saber';
  saber.anchor.set(0.5, 1);
  saber.y = 75, saber.x = -5;
  this.gift_group.add(saber);
  var box = this.game.make.sprite(0, 0, 'gift');
  box.name = 'gift';
  box.anchor.set(0.5, 1);

  this.gift_group.add(box);
  this.start();
};

p.start = function () {
  this.gift_group.visible = true;
  this.dropped = true;
  this.gift_group.x = 380;
  this.gift_group.y = -100;
  this.drop_step_1();
};

p.restart = function () {
  this.dropped = false;
};

p.destroy = function () {
  this.gift_group.visible = false;
  var saber = this.gift_group.getByName('saber');
  if (!saber) {
    return; 
  }

  var fire = saber.animations.getAnimation('fire');
  if (fire) {
    fire.stop();
  }
};

p.drop_step_1 = function () {
  var tw = this.game.add.tween(this.gift_group);
  tw.to({y: 900}, 200, null, true, 0, 0, false);
  tw.onComplete.addOnce(this.drop_step_2, this);
};

p.drop_step_2 = function () {
  var tw = this.game.add.tween(this.gift_group);
  var twS = this.game.add.tween(this.gift_group.scale);
  tw.to({y: 1200}, 60, null, true, 0, 0, false);
  twS.to({y: 0.3}, 60, null, true, 0, 0, false);
  tw.onComplete.addOnce(function () {
    var saber = this.gift_group.getByName('saber');
    if (!saber) return;
    var fire = saber.animations.getAnimation('fire');
    if (!fire) {
      fire = saber.animations.add('fire');
    }
    if (!fire.isPlaying) {
      fire.play(10, true);
    }
    window.BT.app.playSound('sod-giftbox');
    this.drop_step_3();
  }, this);
};

p.drop_step_3 = function () {
  var tws = this.game.add.tween(this.gift_group.scale);
  tws.to({y: 1}, 60, null, true, 0, 0, false);
  tws.onComplete.addOnce(function () {
    var box = this.gift_group.getByName('gift');
    if (box) {
      box.inputEnabled = true;
      box.events.onInputUp.addOnce(function () {
        // this.gift_group.visible = false;
        window.clickGiftBox();
        this.destroy();
      }, this);
    }

    this.shakeBox();
  }, this);
};

p.shakeBox = function () {
  // 等待时间
  var emTw = this.game.add.tween({});
  emTw.to({}, 1500, null, true, 0, 0, false);
  emTw.onComplete.addOnce(function () {
    // 压缩过程
    var tw = this.game.add.tween(this.gift_group.scale);
    tw.to({y: 0.4}, 60, null, true, 0, 0, false);
    tw.onComplete.addOnce(function () {
      // 弹跳拉伸过程
      var tw2 = this.game.add.tween(this.gift_group);
      tw2.to({y: 1130}, 100, null, true, 0, 0, false);
      var tw21 = this.game.add.tween(this.gift_group.scale);
      tw21.to({y: 1.04}, 100, null, true, 0, 0, false);
      tw2.onComplete.addOnce(function () {
        // 返回压缩过程
        var tw3 = this.game.add.tween(this.gift_group);
        tw3.to({y: 1200}, 100, null, true, 0, 0, false);
        var tw31 = this.game.add.tween(this.gift_group.scale);
        tw31.to({y: 0.8}, 100, null, true, 0, 0, false);
        tw3.onComplete.addOnce(function () {
          // 恢复原始缩放过程
          var tw4 = this.game.add.tween(this.gift_group.scale);
          tw4.to({y: 1}, 100, null, true, 0, 0, false);
          tw4.onComplete.addOnce(function () {
            this.shakeBox();
          }, this);
        }, this);
      }, this);
    }, this);
  }, this);
};

export default GiftBox;
