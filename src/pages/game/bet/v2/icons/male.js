var Male = function () {
	
};

var p = Male.prototype;
// BT.extend(Male, BT.Icon);
p.getRender = function (game, id) {
  var cc = game.make.sprite(0, 0, 'x_' + id);
	
  cc.anchor.set(0.5);
  return cc;
};
var t = new Male();
export default t;
