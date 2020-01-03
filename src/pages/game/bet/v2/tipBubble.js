var TipBubble = function (game, parent) {
  this.game = game;
  var tip_group = this.game.add.group();
  tip_group.name = 'tip_group', this.base = tip_group;
  parent.add(tip_group);
};

var p = TipBubble.prototype;

p.onAdd = function () {
  var tip_group = this.base;

  var tipBubble = this.game.make.sprite(0, 0, 'tip_bubble');
  tipBubble.anchor.set(0.5);
  tipBubble.y = -90, tipBubble.x = 10;
  tipBubble.name = 'bubble';
  tip_group.add(tipBubble);

  var tips = this.game.make.text(0, 0, '', {font: '20px Arial', fill: '#ffffff'});
  tips.x = -100, tips.y = -120;
  tips.name = 'tips';
  tip_group.add(tips);
  tip_group.visible = false;
};

p.onBetTip = function (x, y, info) {
  var tip_grp = this.base;
  [tip_grp.x, tip_grp.y] = [x, y];

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

export default TipBubble;
