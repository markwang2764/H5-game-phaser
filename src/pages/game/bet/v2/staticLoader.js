
var StaticLoader = function (game, players) {
  // console.log(players);
  this.players = players;
};

var p = StaticLoader.prototype;

p.preload = function () {
  this.addListener();
  this.load.crossOrigin = 'anonymous';
  // var host = window.CFG.host + '/h5-mami/webgame/chicken/asset/';
  // for(var i = 0; i < this.players.length; i++){
  //     this.load.image(this.players[i].uskA, this.players[i].header);
  // }
};

p.create = function () {
  console.log('加载完成');
};

p.update = function () {

};

p.render = function () {

};

p.addListener = function () {
  this.game.load.onLoadComplete.removeAll();
  this.game.load.onLoadComplete.add(function () {
    this.state.start('Play');
  }, this);
};

export default StaticLoader;
