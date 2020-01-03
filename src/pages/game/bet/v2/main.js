import tool from './tool';
import Boot from './boot';
import Play from './play';
import Event from './eventManager';
import DataManager from './dataManager';
import msg from './message';
import net from './net';

var STAGE_WIDTH = 750;
var STAGE_HEIGHT = 1206 || STAGE_WIDTH / (window.innerWidth / window.innerHeight);
var Main = function () {
  var game = new Phaser.Game(STAGE_WIDTH, STAGE_HEIGHT, Phaser.AUTO, 'game', {
    create: this.create.bind(this),
    update: this.update.bind(this)
  });
  this.game = game;
  game.state.add('Boot', Boot);
  game.state.add('Play', Play);
  this.evtMgr = new Event.EventManager();
  this.netMgr = new net();
  this.dataMgr = new DataManager();
  this.dataMgr.selfId = CFG.uskA;
  this.sods = {};
};

var p = Main.prototype;

p.create = function () {
  $('.ui').hide();
  // this.game.time.desiredFps = 30;
  this.game.state.start('Boot');
  // this.game.enableStep();
};

p.update = function (game) {
  var dlt = game.time.elapsed;

  this.evtMgr.update(dlt);
  this.netMgr.update(dlt);
};

p.playSound = function (key, loop) {
  var sod = this.sods[key];
  if (!sod) {
    sod = this.game.add.audio(key, 0.72, loop);
    sod.allowMultiple = true;
    this.sods[key] = sod;
  }
  sod.volume = 0.72;
  sod.play();
};

var app = new Main();
window.BT.app = app;
export default app;
