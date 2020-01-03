var CK = CK || {};

(function () {
  var Item = function (game, parent, y) {
    this.game = game;
    this.group = CK.getGroup(game.width >> 1, y);
    parent.add(this.group);
    this.targetType = CK.TargetType.Item;
    this.skin = CK.getSprite('item');
    this.skin.anchor.set(0.5, 0.5);
    this.group.add(this.skin);
  };

  var p = Item.prototype;

  p.onHit = function () {
    // console.log('item on hit');
    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
    var idx = this.container.indexOf(this);
    this.container.splice(idx, 1);
  };

  p.onAdd = function (arr) {
    this.container = arr;
  };

  p._y = function () {
    return this.group.y;
  };

  p._x = function () {
    return this.group.x;
  };

  p._w = function () {
    return this.skin.width;
  };

  p._h = function () {
    return this.skin.height;
  };

  CK.setAccessor(p);

  CK.Item = Item;
})();
