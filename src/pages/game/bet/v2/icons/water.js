var Water = function () {
	
};

var p = Water.prototype;

p.getRender = function (game, id) {
  var cc = game.make.sprite(0, 0, 'x_' + id);
	
  cc.anchor.set(0.53, 0.6);
  return cc;
};
var t = new Water();
export default t;
