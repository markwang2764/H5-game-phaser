var CK = CK || {};

(function () {
  var Boot = function () {
		
  };

  var p = Boot.prototype;

  p.preload = function () {
    this.load.image('mbg', '//yun.dui88.com/h5-mami/webgame/chicken/asset/match_bg.jpg');
    this.load.image('l_body', '//yun.dui88.com/h5-mami/webgame/chicken/asset/loader_body.png');
    this.load.image('l_point', '//yun.dui88.com/h5-mami/webgame/chicken/asset/loader_point.png');
  };

  p.create = function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.stage.disableVisibilityChange = true;

    this.state.start('Load');
  };

  p.update = function (g) {
    CK.app.update(g);
  };

  CK.Boot = Boot;
})();
