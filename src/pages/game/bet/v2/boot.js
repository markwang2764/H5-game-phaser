import Load from './loader';

var Boot = function () {
	
};

var p = Boot.prototype;

p.preload = function () {
  this.game.state.add('Load', Load);
  this.load.crossOrigin = 'anonymous';
  var host = window.CFG.host + '/h5-mami/webgame/chicken/asset/';
  this.load.image('mbg', host + 'match_bg.jpg');
  this.load.image('l_body', host + 'loader_body.png');
  this.load.image('l_point', host + 'loader_point.png');
};

p.create = function () {
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.stage.disableVisibilityChange = true;

  this.state.start('Load');
};

p.update = function (g) {
  BT.app.update(g);
};

export default Boot;
