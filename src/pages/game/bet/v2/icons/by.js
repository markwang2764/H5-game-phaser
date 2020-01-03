var By = function () {
	
};

var p = By.prototype;

p.getRender = function (game, id, group) {
  var height = group['__height'];
  var cc = group.getByName('cc');
  var box = group.getByName('box');
  var heap = group.getByName('heap');
  cc.scale.set(0.4);
  cc.x = cc.width / 2 + 5, cc.y = height - 75;

  var width = Math.max(cc.width, box.width);
  box.x = width / 2, heap.x = width / 2;

  var rend = game.make.renderTexture(width, height);
  rend.render(group);
  group.destroy(true, true);

  var sp = game.make.sprite(0, 0, rend);
  sp.anchor.set(0.53, 0.46);
  return [sp, rend];
};
var t = new By();
export default t;
