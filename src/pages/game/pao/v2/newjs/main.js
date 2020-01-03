var MG = MG || {};
var App = null;

(function () {
	var Main = function (argument) {
		// if(!!Main._instance)

		this.resultData = argument;
		this.monsters = argument.monsters;

		this.game = new Phaser.Game(750, 1206, Phaser.CANVAS, "result-canvas", {
			preload: this.load.bind(this), 
			create: this.start.bind(this),
			update: this.update.bind(this)
		}, true);

		//this.game = phgame;
		App = this;
		this.coinMgr = new MG.CoinManager(this.game);
		this.loader = new MG.Loader(this.game);
		Main._instance = this;
	}

	var p = Main.prototype;

	p.load = function () {
		//this.game.backgroundColor = "#559900";
		this.loader.boot(this.monsters);
	}

	p.start = function () {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.coinMgr.init(this.resultData);
		// console.log("start");
	}

	p.update = function (game) {
		this.coinMgr.doUpdate(game.time.elapsed);
	}

	MG.Main = Main;

})()