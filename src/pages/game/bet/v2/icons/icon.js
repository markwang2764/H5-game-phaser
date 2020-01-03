var Icon = function () {
	
};

Icon.prototype.getImage = function (game, id) {
  return game.make.image(0, 0, 'x_' + id);
};
