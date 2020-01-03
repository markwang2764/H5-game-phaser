var MG = MG || {};

(function (argument) {
	var Loader = function (game) {
		this.game = game;
	}

	var p = Loader.prototype;

	p.boot = function (monsters) {
		//this.game.load.crossOrigin = 'anonymous';

		// this.game.load.image('bg', '//yun.tuisnake.com/h5-mami/webgame/fish/resultbg.png');
		this.game.load.image('bg', '//yun.tuisnake.com/h5-mami/webgame/fish/v4/resultbg4.png');

		this.game.load.image('xianjin', '//yun.tuisnake.com/h5-mami/webgame/fish/v4/xianjin4.png');
		this.game.load.image('hongbao', '//yun.tuisnake.com/h5-mami/webgame/fish/v4/hongbao4.png');
		this.game.load.spritesheet('hand', '//yun.tuisnake.com/h5-mami/webgame/gameroom/img/sprite_gesture.png', 400, 400, 7);

		this.game.load.image('again', '//yun.tuisnake.com/h5-mami/webgame/fish/v4/again4.png');
		this.game.load.image('close', '//yun.tuisnake.com/h5-mami/webgame/fish/v4/close4.png');

		this.game.load.image('bg_monster', '//yun.tuisnake.com/h5-mami/webgame/fish/bg_monster2.png');
		this.game.load.image('light', '//yun.tuisnake.com/h5-mami/webgame/fish/light2.png');
		this.game.load.image('new_gold', '//yun.tuisnake.com/h5-mami/webgame/fish/new_gold2.png');
		this.game.load.image('new_kill', '//yun.tuisnake.com/h5-mami/webgame/fish/new_kill2.png');
		this.game.load.image('newrecord', '//yun.tuisnake.com/h5-mami/webgame/fish/newrecord2.png');
		this.game.load.image('title', '//yun.tuisnake.com/h5-mami/webgame/fish/zhanji2.png');

		var monsters = JSON.parse(monsters);
		var _= this;
		monsters.forEach(function (item, index) {
		_.game.load.image('m' + ( index + 1 ), item.imgUrl);
		})

		this.game.load.spritesheet('coin', '//yun.tuisnake.com/h5-mami/webgame/fish/coin_roll2.png', 83, 80, 8);
		this.game.load.spritesheet('lights', '//yun.tuisnake.com/h5-mami/webgame/fish/light_sheet2.png', 150, 150, 5);
		
		this.game.load.bitmapFont('w_num', '//yun.tuisnake.com/h5-mami/webgame/fish/w_num2.png', '//yun.tuisnake.com/h5-mami/webgame/fish/w_num.xml', null, 0);
		this.game.load.bitmapFont('num', '//yun.tuisnake.com/h5-mami/webgame/fish/num2.png', '//yun.tuisnake.com/h5-mami/webgame/fish/num.xml', null, 0);

	}

	p.load = function (img) {
		this.game.load.image()
	}

	MG.Loader = Loader;
})()