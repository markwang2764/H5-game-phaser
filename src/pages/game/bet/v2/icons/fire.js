var Fire = function () {
	
};

var p = Fire.prototype;

p.getRender = function (game, id) {
  var cc = game.make.sprite(0, 0, 'x_' + id);
	
  cc.anchor.set(0.5, 0.6);
  return cc;
};
var t = new Fire();
export default t;
