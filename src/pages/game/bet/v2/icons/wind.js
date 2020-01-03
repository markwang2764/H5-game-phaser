var Wind = function () {
	
};

var p = Wind.prototype;

p.getRender = function (game, id) {
  var cc = game.make.sprite(0, 0, 'x_' + id);
	
  cc.anchor.set(0.5, 0.45);
  return cc;
};
var t = new Wind();
export default t;
