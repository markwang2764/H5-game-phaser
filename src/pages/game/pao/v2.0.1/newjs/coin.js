var MG = MG || {};

(function(){
	var Coin = function (parent, param) {
		this.skin = App.game.add.sprite(App.game.width >> 1, App.game.height >> 1, 'coin');
		this.skin.anchor.setTo(0.5, 0.5);
		this.skin.animations.add('roll');
		this.skin.animations.play('roll', 30, true);
		parent.add(this.skin);
		this.vx = param.vx;
		this.vy = param.vy;
		this.acc = param.acc;
		// console.log(this.vx, this.vy, this.acc);
	}

	var p = Coin.prototype;

	p.update = function (dlt) {
		this.skin.x += this.vx * 10;
		this.vy += this.acc * 10;
		this.skin.y += this.vy * 10;
		// console.log(this.skin.x, this.skin.y);
	}

	p.setAlpha = function (alpha) {
		this.skin.alpha = alpha;
	}

	MG.Coin = Coin;
})()