var Dust = function () {
	
};

var p = Dust.prototype;

p.getRender = function (game, id) {
  var cc = game.make.sprite(0, 0, 'x_' + id);
	
  cc.anchor.set(0.5, 0.52);
  return cc;
};
var t = new Dust();
export default t;
