var Sp = function () {
	
};

var p = Sp.prototype;

p.getRender = function (game, id, group) {
  var height = group['__height'];
  var cc = group.getByName('cc');
  var box = group.getByName('box');
  var heap = group.getByName('heap');
  var name = group.getByName('name');
  cc.scale.set(0.32);
  cc.x = cc.width / 2 + 3, cc.y = height - 73;

  var width = Math.max(cc.width, box.width) + 10;
  box.x = width / 2, heap.x = width / 2, name.x = width / 2;

  var rend = game.make.renderTexture(width, height);
  rend.render(group);
  group.destroy(true, true);

  var sp = game.make.sprite(0, 0, rend);
  sp.anchor.set(0.51, 0.46);
  return [sp, rend];
};
var t = new Sp();
export default t;
