var MG = MG || {};

(function () {
	var OverPage = function () {
		this.game = App.game;
		this.bg_group = null;
		this.li_group = null;
		this.pop_group = null;
		this.stageW = this.game.width;
		this.coinList = [];
		// 金币和击杀数字相关
		this.goldText = this.game.add.bitmapText(100, 200, 'num', 'haha', 34);
		this.killText = this.game.add.bitmapText(100, 200, 'num', 'haha', 34);
		this.runText = false;
		this.gold_max = 0;
		this.kill_max = 0;
		// 弹层数据
		this.amountHighest = false;
		this.killNumHighest = false;
		this.perKillNum = []; // 不同种类怪物的击杀数
		this.perKillNumHighest = []; // 不同种类怪物是否新纪录

		this.goldCounter = 0;
		this.killCounter = 0;

		// 背光大灯
		this.backLight = null;
		this.backLightRollTimer = 0;

		this.data = null;
		// 弹层背光灯
		this.popBackLight = null;


		this.coinMgr = new MG.CoinManager();

	}

	var p = OverPage.prototype;

	/**移除所有动画，所有组，停止主循环跟随 */
	p.destroy = function () {
		// body...
	}

	p.show = function (data) {
		this.data = data;
		this.gold_max = Number(changeMoney(data.gold));
		this.kill_max = data.kill;
		this.perKillNum = data.perKillNum;
		this.perKillNumHighest = data.perKillNumHighest;
		this.amountHighest = data.amountHighest;
		this.killNumHighest = data.killNumHighest;

		this.addGroup();
		var bg = this.createBg();
		// this.setCenter(bg);
		bg.x = -(this.stageW >> 1);
		bg.y = -(this.game.height >> 1);
		this.bg_group.add(bg);

		// let animTime = 1000;
			// let step = parseInt(Math.min(this.gold_max, this.kill_max) / (60 * animTime / 1000 )) || Math.min(this.gold_max, this.kill_max); // 计算步长，保证自增长动画在规定时间内完成
		this.stepGold = this.gold_max / 60;
		this.stepKill = 1;
		
		this.showBackGround(data);
	}

	/**载入序列帧金币，设置金币初始速度与位置 */
	p.loadCoins = function (group) {
		this.coinMgr.loadCoins(group);
	}

	p.update = function (dlt) {
		this.updateText();
		this.updateCoins(dlt);
		this.updateBackLight(dlt);
		this.updataPopBackLight(dlt);
	}

	p.updataPopBackLight = function (dlt) {
		if(!this.popBackLight) return;
		this.popBackLight.rotation += 0.0008 * dlt;
	}


	p.updateBackLight = function (dlt) {
		if(!this.backLight) return;
		this.backLight.rotation += 0.0008 * dlt;
	}

	/**金币序列帧loop */
	p.updateCoins = function (dlt) {
		this.coinMgr.update(dlt);
	}

	/**计分数字更新loop */
	p.updateText = function (dlt) {
		if(!this.runText) return;
		this.goldCounter += this.stepGold;
		this.killCounter += this.stepKill;
		var flag = 0;
		if(this.goldCounter >= this.gold_max){
			this.goldCounter = this.gold_max;
			flag++;
		}
		if(this.killCounter >= this.kill_max){
			this.killCounter = this.kill_max;
			flag++;
		}
		if(flag === 2){
			this.runText = false;
		}
		this.goldText.setText(Number(this.goldCounter).toFixed(2) + "$");
		this.killText.setText(Math.floor(this.killCounter));

		/*
		if(this.goldCounter >= this.gold_max && this.killCounter >= this.kill_max) {
			this.goldText.setText(Number(this.gold_max).toFixed(2) + "$");
			this.killText.setText(this.kill_max);
			this.runText = false;
		} else {
			this.goldText.setText(Number(this.gold_max).toFixed(2) + "$");
			this.killText.setText(Math.floor(this.killCounter));
			let animTime = 1000;
			// let step = parseInt(Math.min(this.gold_max, this.kill_max) / (60 * animTime / 1000 )) || Math.min(this.gold_max, this.kill_max); // 计算步长，保证自增长动画在规定时间内完成
      		let step = Math.min(this.gold_max, this.kill_max) / (60 * animTime / 1000 ); // 计算步长，保证自增长动画在规定时间内完成

			this.goldCounter += step;
			this.killCounter += step;
		}
		*/
	}

	/**显示公共背景板 */
	p.showBackGround = function (data) {
		// 添加背光大灯
		this.addBackLight();
		// 添加标题
		var title = this.game.add.sprite(0, 0, 'title');
		this.bg_group.add(title);
		this.setCenter(title);
		title.y = -300;
		// 添加背景板
		var bg_board = this.game.add.sprite(0,0, 'bg');
		this.setCenter(bg_board);
		bg_board.y = title.height / 2 + title.y + 18 + bg_board.height / 2;

		this.bg_group.add(bg_board);
		this.bg_group.scale.setTo(0.05, 0.05);

		// 在公共背景板弹出动画结束后，根据是否新纪录显示不同的文本动画
		var tw = this.game.add.tween(this.bg_group.scale)
		tw.to({x: 1, y: 1}, 100, Phaser.Easing.Back.InOut, true, 0, 0, false);
		// tw.wait(1000)
		if(!data.new) {
			// 添加增长数字
			this.addGrowText(bg_board);
			this.runText = true;
			tw.onComplete.add(this.tweenOnGrowText, this);
			tw.onComplete.add(this.showMonsterList, this);
		} else {
			// 有金币新纪录（if判断）
			if(this.amountHighest){
        tw.onComplete.add(this.addNewGoldRecord, this);
			} else {// 没有金币新纪录，有击杀数量新纪录
        // 直接显示金币
        this.showGoldText();
        tw.onComplete.add(this.addNewKillRecord, this);
			}
		}

	}

	p.addNewKillRecord = function () {
		var bg = this.addGraphic(0, 0, this.game.width, this.game.height, 0x000000, 0);
		this.pop_group.add(bg);

		var pop = this.game.add.group();
		this.pop_group.add(pop);

		pop.x = this.game.width >> 1;
		pop.y = this.game.height >> 1;

		this.popBackLight = this.game.add.sprite(0, 0, 'light');
		this.popBackLight.anchor.setTo(0.5, 0.5);
		pop.add(this.popBackLight);
		
		var new_kill = this.game.add.sprite(0, 0, 'new_kill');
		new_kill.anchor.setTo(0.5, 0.5);
		pop.add(new_kill);

		this.killText.setText(this.data.kill);
		this.pop_group.add(this.killText);
		this.killText.anchor.setTo(0.5, 0.5);
		this.killText.scale.set(0.1, 0.1);
		this.killText.x = this.game.width >> 1;
		this.killText.y = (this.game.height >> 1);
		var killTw = this.game.add.tween(this.killText.scale);
		killTw.to({x: 4.5, y: 4.5}, 200, Phaser.Easing.Bounce.InOut, true, 200, 0, false);

		pop.scale.set(0, 0);
		var tw = this.game.add.tween(pop.scale);
		tw.to({x: 1, y: 1}, 200, Phaser.Easing.Bounce.InOut, true, 200, 0, false);
		tw.onComplete.add(function () {
			var tt = this.game.add.tween({});
			tt.to({}, 800, null, true, 0, 0, false);
			tt.onComplete.add(function () {
				this.pop_group.remove(pop);	
				this.pop_group.remove(bg);
				var twt = this.game.add.tween(this.killText.scale);
				twt.to({x: 2.5, y: 2.5}, 200, null, true, 0, 0, false);
				// 金币炸完了数字回飘动画
				var twt2 = this.game.add.tween(this.killText);
				twt2.to({x: 455, y: 570}, 200, null, true, 0, 0, false);
				var nrTag = this.game.add.sprite(this.killText.x + 30, this.killText.y, 'newrecord');
				this.pop_group.add(nrTag);
				nrTag.anchor.setTo(0.5, 0.5);
				nrTag.scale.set(0.1, 0.1);
				var twt3 = this.game.add.tween(nrTag.scale);
				twt3.to({x: 1, y: 1}, 200, null, true, 0, 0, false);
				// 金币炸完了标签回飘动画
				var twt4 = this.game.add.tween(nrTag);
				twt4.to({x: 575, y: 560}, 200, null, true, 0, 0, false);
				// twt4.onComplete.add(this.addNewKillRecord, this);
				this.showMonsterList();

			}, this)
			

		}, this);
	};

	p.showKillText = function () {
    this.killText.setText(this.data.kill);
    this.pop_group.add(this.killText);
    this.killText.anchor.setTo(0.5, 0.5);
    this.killText.scale.set(0.1, 0.1);
    this.killText.x = this.game.width >> 1;
    this.killText.y = (this.game.height >> 1);
    // var killTw = this.game.add.tween(this.killText.scale);
    var twt = this.game.add.tween(this.killText.scale);
    twt.to({x: 2.5, y: 2.5}, 200, null, true, 0, 0, false);
    // 金币炸完了数字回飘动画
    var twt2 = this.game.add.tween(this.killText);
    twt2.to({x: 455, y: 570}, 200, null, true, 0, 0, false);
  };

	p.showGoldText = function () {
    this.goldText.setText(this.data.gold);
    this.pop_group.add(this.goldText);
    this.goldText.anchor.setTo(0.5, 0.5);
    this.goldText.scale.set(0.1, 0.1);
    this.goldText.x = this.game.width >> 1;
    this.goldText.y = (this.game.height >> 1) + 80;
    var twt = this.game.add.tween(this.goldText.scale);
    twt.to({x: 2.5, y: 2.5}, 200, null, true, 0, 0, false);
    // 金币炸完了数字回飘动画
    var twt2 = this.game.add.tween(this.goldText);
    twt2.to({x: 455, y: 430}, 200, null, true, 0, 0, false);
  };

	p.addNewGoldRecord = function () {
		// 添加背板
		var bg = this.addGraphic(0, 0, this.game.width, this.game.height, 0x000000, 0.65);
		this.pop_group.add(bg);

		var pop = this.game.add.group();
		this.pop_group.add(pop);

			
		var lights = this.game.add.sprite(this.game.width >> 1, (this.game.height >> 1) + 30, 'lights');
		pop.add(lights);
		lights.anchor.setTo(0.5, 0.5);
		lights.scale.set(4, 4);
		var spark = lights.animations.add('spark');
		lights.animations.play('spark', 15, false);

		var new_gold = this.game.add.sprite(this.game.width >> 1, (this.game.height >> 1) , 'new_gold');
		pop.add(new_gold);
		new_gold.anchor.setTo(0.5, 0.5);
		new_gold.scale.set(0.1, 0.1);
		this.game.add.tween(new_gold.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Bounce.InOut, true, 0, 0, false);
		this.loadCoins(pop);

		this.goldText.setText(this.data.gold);
		this.pop_group.add(this.goldText);
		// this.game.add(this.goldText);
		this.goldText.anchor.setTo(0.5, 0.5);
		this.goldText.scale.set(0.1, 0.1);
		this.goldText.x = this.game.width >> 1;
		this.goldText.y = (this.game.height >> 1) + 80;
		var tw = this.game.add.tween(this.goldText.scale).to({x: 4.5, y: 4.5}, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, false);
		tw.onComplete.add(function () {
			var tt = this.game.add.tween({}).to({}, 200, null, true, 0, 0, false);
			tt.onComplete.add(function () {
				this.pop_group.remove(bg);
				this.pop_group.remove(pop);
				// this.pop_group.remove(new_gold);
				var twt = this.game.add.tween(this.goldText.scale);
				twt.to({x: 2.5, y: 2.5}, 200, null, true, 0, 0, false);
				// 金币炸完了数字回飘动画
				var twt2 = this.game.add.tween(this.goldText);
				twt2.to({x: 455, y: 430}, 200, null, true, 0, 0, false);
				var nrTag = this.game.add.sprite(this.goldText.x + 30, this.goldText.y, 'newrecord');
				this.pop_group.add(nrTag);
				nrTag.anchor.setTo(0.5, 0.5);
				nrTag.scale.set(0.1, 0.1);
				var twt3 = this.game.add.tween(nrTag.scale);
				twt3.to({x: 1, y: 1}, 200, null, true, 0, 0, false);
				// 金币炸完了标签回飘动画
				var twt4 = this.game.add.tween(nrTag);
				twt4.to({x: 545, y: 415}, 200, null, true, 0, 0, false);
				// 如果有击杀数量新纪录的话（if判断）
				if(this.killNumHighest) {
          twt4.onComplete.add(this.addNewKillRecord, this);


				} else {
          // 直接显示击杀数量
          this.showKillText();
          this.showMonsterList();
				}

			}, this);
			
			// this.addNewKillRecord();
		}, this);
	}


	/**添加背景镭射光线 */
	p.addBackLight = function () {
		this.backLight = this.game.add.sprite(0, 0, 'light');

    var mask = this.game.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, this.backLight.width, this.backLight.height * 0.7 / 2 );

		this.bg_group.add(this.backLight);
		this.backLight.anchor.setTo(0.5, 0.5);
		this.backLight.y = -300;
		this.backLight.scale.setTo(0.7, 0.7);

		this.backLight.mask = mask;
	}

	p.addGrowText = function (board) {
		this.bg_group.add(this.goldText);
		this.goldText.setText(0);
		this.goldText.anchor.setTo(0.5, 0.5);
		// 重要参数
		this.goldText.x = 122, this.goldText.y = board.y - 365 ;

		this.goldText.scale.setTo(0.1, 0.1);

		this.bg_group.add(this.killText);
		this.killText.setText(0);
		this.killText.anchor.setTo(0.5, 0.5);
		// 重要参数
		this.killText.x = 83, this.killText.y = board.y - 221 ;

		this.killText.scale.setTo(0.1, 0.1);
	}

	/**显示怪物头像列表放大补间动画 */
	p.showMonsterList = function (data) {
		for (var i = this.perKillNum.length - 1; i >= 0; i--) {
			this.addItem(1, this.perKillNum[i], i, this.perKillNumHighest[i]);
		}

		this.li_group.x = 320, this.li_group.y = 800;
		this.li_group.scale.setTo(0.1, 0.1);
		var t3 = this.game.add.tween(this.li_group.scale);
		t3.onComplete.add(function () {
		  var tt = this.game.add.tween({});
		  // 弹层展示时间
		  tt.to({}, 2000, null, true, 0, 0, false);
		  tt.onComplete.add(function () {
        this.data.callback.call(null);
      }, this);

    }, this);
		t3.to({x: 1, y: 1}, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, false);
	}

	/**自增长动画文字的放大过程补间动画 */
	p.tweenOnGrowText = function () {
		var t1 = this.game.add.tween(this.goldText.scale);
		t1.to({x: 2.5, y: 2.5}, 300, null, true, 0, 0, false);

		var t2 = this.game.add.tween(this.killText.scale);
		t2.to({x: 2.5, y: 2.5}, 300, null, true, 0, 0, false);
	}

	p.addItem = function (type, num, idx, isNewRecord) {
		// body...
		var itemGroup = this.game.add.group();
		
		var mon_bg = this.game.add.sprite(0,0, 'bg_monster');
		itemGroup.add(mon_bg);

		var m = this.game.add.sprite(mon_bg.width / 2 ,  mon_bg.height / 2, 'm' + (idx + 1));
    m.anchor.set(0.5,0.5);
    var sf = 1 / (m.width / mon_bg.width) * 0.75;
    m.scale.set(sf, sf);
		itemGroup.add(m);
		
		var text = this.game.add.bitmapText(100, 200, 'w_num', 'hohhh', 64);
		itemGroup.add(text);

		text.setText('x' + num);
		text.x = mon_bg.x + 10 + mon_bg.width;
		text.y = mon_bg.y;

		if(isNewRecord) {
			var nrTag = this.game.add.sprite(0, 0, 'newrecord');
			itemGroup.add(nrTag);
			nrTag.anchor.setTo(0.5, 0.5);
			nrTag.x = text.x + text.width + 14;
			nrTag.y = text.y + 30;
		}

		itemGroup.x = -120 + (idx % 2) * 250;
		itemGroup.y = -124 + Math.floor(idx / 2) * 120;
		this.li_group.add(itemGroup);
	}

	/**将现实对象锚点设置到中心位置 */
	p.setCenter = function (obj) {
		try{
			obj.anchor.setTo(0.5, 0.5);	
		} catch(e) {
			console.log(e);
		}
		
	}


	p.addGraphic = function (x, y, width, height, color, alpha) {
		var box = this.game.add.graphics(0, 0);
		box.beginFill(color, alpha);
		box.drawRect(x, y, width, height);
		box.endFill();
		return box;
	}

	p.addGroup = function () {
		this.bg_group = this.game.add.group();
		//this.bg_group.anchor.setTo(0.5, 0.5);

		this.bg_group.x = this.stageW >> 1;
		this.bg_group.y = this.game.height >> 1;
		this.li_group = this.game.add.group();
		this.pop_group = this.game.add.group();

		//this.bg_group.addChild(this.li_group);
		//this.bg_group.addChild(this.pop_group);

	}

	p.createBg = function () {
		var view = this.addGraphic(0, 0, this.game.width, this.game.height, 0x000000, 0);
		view.anchor.set(0.5, 0.5);
		return view;
	}

	MG.OverPage = OverPage;
})()