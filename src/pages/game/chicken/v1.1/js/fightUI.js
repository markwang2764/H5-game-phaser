var CK = CK || {};

(function () {
	var FightUI = function (game, parent, mgr) {
		this.game = game;
		this.mgr = mgr;
		this.base = CK.getGroup(0, 0);
		parent.add(this.base);
		this.timerText = null;
		this.downCounter = 0;
		this.downCounterTimer = 0;
		this.isTimerStart = false;
		this.userDict = {};

	}

	var p = FightUI.prototype;

	p.destroy = function () {
		this.base.parent.remove(this.base);
	}

	p.update = function (dlt) {
		if(this.downCounterTimer >= 1000) {
			this.downCounter++;
			this.downCounterTimer = 0;
			this.setTime();
		} else if(this.isTimerStart){
			this.downCounterTimer += dlt;
		}
	}

	/**UI初始化*/
	p.create = function () {
		this.addHUD();
		this.addTimeCounter();
		this.addMyTip();
		// this.addGuide();
		var evt = CK.app.evtMgr;
		evt.on('evt_showWin', this.onWin, this);
		evt.on('evt_showLost', this.onLost, this);
		
	}

	p.addMyTip = function () {
		this.mytip_group = CK.getGroup(171, 980);
		var arrow = CK.getSprite('arrow');
		arrow.anchor.set(0.5);

		this.shakeMytip();
		this.mytip_group.add(arrow);
		var my = CK.getSprite('I');
		my.anchor.set(0.5);

		var mytw = CK.getTween(my.scale);
		mytw.to({x: 1.05, y: 1.05}, 200, null, true, 0, -1, false);
		this.mytip_group.add(my);
		this.base.add(this.mytip_group);
	}

	

	p.shakeMytip = function () {
		var atw = CK.getTween(this.mytip_group);
		// CK.exetw(atw, {x: 161, y: 990}, )
		atw.to({x: 161, y: 986}, 500, null, true, 0, 0, false);
		atw.onComplete.addOnce(function () {
			var aat = CK.getTween(this.mytip_group);
			aat.to({x: 171, y: 980}, 500, null, true, 0, 0, false);
			aat.onComplete.addOnce(this.shakeMytip, this);
		}, this);
	}

	/**添加玩家信息UI*/
	p.addHUD = function () {
		var myself = CK.data.self;
		var width = this.game.width;
		var sexArr = [1, 1, 0];
		var users = CK.data.getAllUsers();
		users.forEach(function (val, idx) {
			var grp = CK.getGroup(0, 0);
			// console.log("user: %s sex: %s", val.name, val.sex);
			var idx = sexArr[val.sex];
			if(idx !== 0 && idx !== 1) idx = 1;
			var cc = CK.getSprite('bg_head_' + idx);
			cc.anchor.set(0.5,0.5);
			grp.y = 80;
			var heartStart = 16, rate = 1;
			if(val.id === myself.id){
				grp.x = width * 0.2;
				// heartStart = 12;
				if(val.sex == 2) cc.scale.x = -1;
			} else if(val.id === myself.rivalId) {
				rate = -1;
				grp.x = width * 0.8;
				heartStart = 13;
				if(val.sex == 1 || val.sex == 0) cc.scale.x = -1;
			}
			grp.add(cc);
			var lifeArr = [];
			for(var i = 0; i < 3; i++) {
				var hc = CK.getSprite('heart');
				hc.anchor.set(0.5), hc.scale.set(1.2);
				hc.x = (heartStart + 45 * i) * rate, hc.y = 25;
				hc["__health_id"] = i;
				grp.add(hc);
				lifeArr.push(hc);
			}
			this.userDict[val.id] = lifeArr;
			var style = {
				font: "bold 32px Arial", 
				fill: "#ffffff", 
				// stroke: "#83390f",
				// strokeThickness: 2
			}
			var ret = val.name.match(/[\W]/g);
			var str = val.name;
			if(!!ret && ret.length >= 4 && val.name.length >=7) {
				str = val.name.substr(0, 5) + '..';
			}
			var name = this.game.make.text(0, 0, str, style);
			name.anchor.set(0.5);
    		name.y = -20, name.x = 60 * rate;
    		grp.add(name);

    		var avator = CK.getSprite(val.id);
    		avator.anchor.set(0.5);
    		avator.x = -80 * rate;
    		if(val.id === myself.id) {
    			avator.x = -78 * rate;
    		}
    		avator.y = -7;
    		avator.scale.set(90 / avator.height);
    		
    		var mask = this.game.add.graphics(0, 0);
    		mask.beginFill(0xffffff);
    		mask.drawCircle(avator.x, avator.y, avator.width );
    		mask.endFill();

			avator.mask = mask;
    		grp.add(avator);
    		grp.add(mask);
			this.base.add(grp);
		}, this);
    	// 添加玩家名称和头像

	}

	

	p.setHealth = function (uid, heal) {
		var arr = this.userDict[uid];
		arr.forEach(function (val, idx) {
			if(val["__health_id"] >= heal) {
				val.visible = false;
			}
		});
	}

	/**添加计时板*/
	p.addTimeCounter = function () {
		this.ripe_group = CK.getGroup(this.game.width >> 1, 0);
		this.base.add(this.ripe_group);

		var ripe = CK.getSprite('ripe');
		ripe.anchor.set(0.5, 0);
		ripe.x = 0, ripe.y = -10;
		this.ripe_group.add(ripe);
		this.ripe = ripe;
		var style = {
			font: "bold 32px Arial", 
			fill: "#ffffff", 
			stroke: "#83390f",
			strokeThickness: 6
		}
		this.timerText = this.game.make.text(0, 0, "30", style);
    	this.timerText.anchor.set(0.5);
    	this.timerText.y = 1635;
    	this.timerText.visible = false;
    	this.ripe_group.add(this.timerText);
	}

	p.ready = function () {
		var ready = CK.getSprite('ready');
		var go = CK.getSprite('go');
		ready.anchor.set(0.5, 0.5);
		go.anchor.set(0.5, 0.5);
		ready.alpha = 0, ready.scale.set(1.2, 1.2);
		go.alpha = 0, go.scale.set(1.2, 1.2);
		ready.x = this.game.width >> 1, ready.y = 600;
		go.x = this.game.width >> 1, go.y = 600;
		this.base.add(ready);
		this.base.add(go);
		
		var rt = CK.getTween(ready);
		CK.exetw(rt, {alpha: 1}, 500);
		var scaleTw = CK.getTween(ready.scale);
		CK.exetw(scaleTw, {x: 1, y: 1}, 500);

		var gt = CK.getTween(go);
		var gscaTw = CK.getTween(go.scale);
		scaleTw.onComplete.add(function () {
			this.base.remove(ready);
			CK.exetw(gt, {alpha: 1}, 500);
			CK.exetw(gscaTw, {x: 1, y: 1}, 500);
			gscaTw.onComplete.add(function () {
				this.base.remove(go);
				var ripeTw = CK.getTween(this.ripe_group);
				CK.exetw(ripeTw, {y: -1550}, 500, Phaser.Easing.Bounce.InOut);
				ripeTw.onComplete.add(function () {
					CK.app.netMgr.send(CK.NetMsgID.play, null);
					this.base.remove(this.mytip_group);
					this.base.remove(this.guide_group);
				}, this);
			}, this);
			
		}, this);
	}

	p.onStart = function () {
		this.timerText.visible = true;
		this.isTimerStart = true;
	}

	p.setOverTime = function (time) {
		this.timerText.text = time;
	}

	p.setTime = function () {
		if(this.downCounter >= 30) {
			this.timerText.text = 0;
		} else {
			this.timerText.text = 30 - this.downCounter;
		}
	}

	p.showItem = function (items) {
		var item = items.shift();
		if(!!item) {
			var isp = CK.getSprite('item_' + item);
			isp.anchor.set(0.5);
			isp.x = this.game.width >> 1;
			isp.y = 600;
			var tw = CK.getTween(isp);
			tw.to({alpha: 0}, 300, null, true, 1000, 0, false);
			tw.onComplete.addOnce(()=>{
				isp.destroy();
				this.showItem(items);
			});
		} else {
			return;
		}
	}

	p.onWin = function (data) {
		CK.app.evtMgr.remove('evt_showWin', this.onWin);
		window.showResultByGame('win', this.mgr.overRsp);
		
	}

	p.onLost = function (data) {
		CK.app.evtMgr.remove('evt_showLost', this.onLost);
		window.showResultByGame('lost', this.mgr.overRsp, data);

	}

	p.onDraw = function () {
		this.timerText.text = 0;
		window.showResultByGame('draw', this.mgr.overRsp);

	}

	CK.FightUI = FightUI;
})();