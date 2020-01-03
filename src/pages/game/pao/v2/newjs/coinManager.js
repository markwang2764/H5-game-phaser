var MG = MG || {};

(function () {
	var CoinManager = function (game) {
		this.game = game;
		this.list = [];
		this.coinList = [];
		this.halfCoinList = [];
		this.delay = 0;
		this.isShow = false;
		this.showHalf = false;
	}

	var p = CoinManager.prototype;

	p.init = function (data) {

		var over = new MG.OverPage(this.game);
		this.list.push(over);
		over.show(data);
		

	}

	p.loadCoins = function (parent) {
		
		var paramArr = [
			{id: 1, vx: 1.2, vy: -0.1, acc: 0.01},
      {id: 2, vx: -1, vy: -1, acc: 0.01},
      {id: 3, vx: 0.4, vy: -1, acc: 0.01},
      {id: 4, vx: 0.1, vy: -0.2, acc: 0.01},
      {id: 5, vx: -1.5, vy: -0.4, acc: 0.01},
      {id: 6, vx: -1, vy: -2, acc: 0.01},
      {id: 7, vx: 0.7, vy: -0.3, acc: 0.01},
      {id: 8, vx: 0.9, vy: -2, acc: 0.01},
      {id: 9, vx: -0.6, vy: -0.2, acc: 0.01},
      {id: 10, vx: 1.8, vy: -1, acc: 0.01},

		]

		for (var i = 0; i < paramArr.length; i++) {
			var param = paramArr[i];
			var coin = new MG.Coin(parent, param);
			this.coinList.push(coin);
			var halfCoin = new MG.Coin(parent, param);
			this.halfCoinList.push(halfCoin);
			halfCoin.setAlpha(0);
		}

		this.isShow = true;
	}

	p.doUpdate = function (dlt) {
		this.list.forEach(function (val, idx) {
			val.update(dlt);
		})
	}

	p.update = function (dlt) {
		if(!this.isShow) return;
		this.coinList.forEach(function (val, idx) {
			val.update(dlt);
		});
		if(this.delay >= 100 || this.showHalf){
			this.halfCoinList.forEach(function (val, idx) {
				val.setAlpha(0.4);
				val.update(dlt);
			});
		} else {
			this.delay += dlt;
			if(this.delay >= 100) {
				this.delay = 0, this.showHalf = true;
			}
		}
	}

	p.getBox = function () {
		var box = this.game.add.graphics(0,0);
		box.beginFill(0xff0000, 0.8);
		box.drawCircle(320, 568, 50);
		return box;
	}

	p.getAcoin = function () {
		var coin = this.game.add.sprite(320, 568, 's_coin');
		coin.anchor.setTo(0.5, 0.5);

		return coin;
	}

	p.getPhaser = function () {
		var p = this.game.add.sprite(320, 568, 'phaser');
		p.anchor.setTo(0.5, 0.5);
		return p;
	}

	p.getCoin = function () {
		var coin = this.game.add.sprite(300, 200, 'coin');
		coin.anchor.x = 0.5, coin.anchor.y = 0.5;
		coin.x = 320, coin.y = 568;
	    //  Here we add a new animation called 'walk'
	    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
	    var roll = coin.animations.add('roll');

	    //  And this starts the animation playing by using its key ("walk")
	    //  30 is the frame rate (30fps)
	    //  true means it will loop when it finishes
	    coin.animations.play('roll', 30, true);
	    return coin;
	}

	MG.CoinManager = CoinManager;
})();