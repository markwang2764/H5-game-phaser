var Female = function () {
	
};

var p = Female.prototype;

p.getRender = function (game, id) {
  var cc = game.make.sprite(0, 0, 'x_' + id);
	
  cc.anchor.set(0.5);
  return cc;
};
var t = new Female();
export default t;
