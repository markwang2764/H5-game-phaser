/**匹配界面控制器-大厅进入 */
var CK = CK || {};

(function () {
	var MatchSOW = function () {
		
		this.counter = 0;
		this.points = ['', '.', '..', '...'];
		this.assetsLoaded = false;
		this.isClosed = false;
		this.enterTime = Date.now();

		this.loadCounter = 0;
	}

	var p = MatchSOW.prototype;

	p.init = function () {
		this.base = this.game.add.group();

        this.add.sprite(0, 0, 'mbg', 0, this.base);
        var block = this.game.add.image(0, 0, 'preload', 'module.png');
		block.anchor.set(0.5);
		block.x = this.game.width >> 1, block.y = 570;
		this.base.add(block);

        this.match = this.game.add.group();
        this.base.add(this.match);

        this.userSys = CK.data;
        this.loadCounter = 0;
		this.counter = 5;

        embedExport(embedData.img_matching_expose_exposure);

        this.doMatch();

        // CK.app.evtMgr.on(CK.NetMsgID.matchRsp, this.onMatched, this);
		CK.app.evtMgr.on('evt_netclose', this.onclose, this);
		// CK.app.netMgr.send(CK.NetMsgID.match, {tenter: false});
        this.matchHandler = this.game.time.events.loop(1000, this.timer1, this);
		
	},

	p.timer1 = function() {
        this.counter--;
        if(this.counter <= 0) {
        	this.onstart();
        } else {
        	this.coolDownText.text = "即将自动开战(" + this.counter + ")";
        }
    }


	p.shutdown = function () {
        this.match.removeAll();
        this.base.destroy();
        CK.hideTask();
	}

	p.preload = function() {
		this.load.crossOrigin = 'anonymous';
		this.isClosed = false;
	},

	p.create = function () {
		CK.showTask('match');
		this.startLoad();
	}

	p.startLoad = function () {
		this.load.onLoadComplete.removeAll();
		this.load.onLoadComplete.addOnce(()=>{
			this.assetsLoaded = true;
		});
		for (var i = CK.res.length - 1; i >= 0; i--) {
			var res = CK.res[i];
			if(res.type === 'image') {
				this.load.image(res.name, res.url);
			} else if(res.type === 'spritesheet') {
				this.load.spritesheet(res.name, res.url, res.w, res.h, res.frame);
			}
		}
		
		this.load.start();
	}

	p.doMatch = function () {

		// CK.data.removeUserById(CK.data.self.rivalId);

		embedExport(embedData.img_matching_expose_exposure);

		var centx = (this.game.width >> 1),
			centy = 663;
		
		this.self_group = CK.getGroup(0, 0);
		this.self_group.x = centx - 170;
		this.self_group.y = centy - 150;
		this.rival_group = CK.getGroup(0, 0);
		this.match.add(this.self_group);
		this.match.add(this.rival_group);

		var vs = this.game.add.image(0, 0, 'preload', 'vs.png');
		vs.y = centy - 150; vs.x = centx;
		vs.anchor.set(0.5);
		this.match.add(vs);

		this.matchingText = this.game.make.text(0, 0, "", { font: "32px Arial", fill: "#ffffff" });
		// 
		this.matchingText.anchor.set(0.5);
		this.matchingText.x = centx;
		this.matchingText.y = centy + 40;
		this.matchingText.scale.set(1.5);
		this.match.add(this.matchingText);

		var button = this.game.add.image(0, 0, 'preload', 'begin.png');
		button.anchor.set(0.5);
		button.x = centx, button.y = 950;
		button.name = 'begin';
		this.match.add(button);

		var point = this.game.add.sprite(0, 0, 'click');
		point.anchor.set(0.5);
		point.x = centx + 150, point.y = 950;
		this.guide_point = point;
		var fire = point.animations.add('fire');
		fire.play(20, true);


		button.inputEnabled = true;
		button.events.onInputUp.add((e)=> {
			// button.visible = false;
			
			if(this.stepHandler) {
				this.game.time.events.remove(this.stepHandler);
			}
			this.onstart();
		});



		this.coolDownText = this.game.make.text(0, 0, "即将自动开战(5)", { font: "22px Arial", fill: "#ffffff" });
		this.coolDownText.anchor.set(0.5);
		this.coolDownText.x = centx;
		this.coolDownText.y = 1030;
		// this.coolDownText.visible = false;
		// this.coolDownText.scale.set(1.5);
		this.match.add(this.coolDownText);

		this.bubble_group = this.game.add.group();
		this.bubble_group.visible = false;
		this.match.add(this.bubble_group);
		this.bubble_group.x = 300, this.bubble_group.y = 400;

		var bubble = this.game.add.image(0, 0, 'preload', 'bubble.png');
		bubble.anchor.set(0.5);
		this.bubble_group.add(bubble);
		var say = this.game.add.text(0, 0, '', {font: '32px Arial', fill: "#83390f"});
		say.anchor.set(0.5);
		say.y = -10, say.name = 'say';
		this.bubble_group.add(say);

		this.game.time.events.add(300, ()=>{
			this.addPlayer(this.self_group, CK.data.getUserById(CK.data.self.rivalId));

			this.matchingText.text = '他在等你一起吃鸡';
			this.stepHandler = this.game.time.events.add(1000, ()=>{
				var text = this.bubble_group.getByName('say');
				text.text = '我等的花都谢了';
				this.bubble_group.visible = true;
				this.stepHandler = this.game.time.events.add(1000, ()=>{
					text.fontSize = 30;
					text.text = '大吉大利，谁先吃鸡？';
				})
			})
		})
		
		this.addTips(centx, centy);
		this.game.time.events.add(500, ()=>{
			this.addChick(centx, centy);
		})
		this.addlights(centx, centy);
	}

	p.addlights = function (centx, centy) {
		var light = this.game.add.sprite(0, 0, 'lights');
		light.animations.add('fire');
		light.anchor.set(0.5);
		light.visible = false;
		light.name = 'light';
		light.x = centx + 170, light.y = centy - 150;
		this.match.add(light);
	}

	p.addChick = function (centx, centy) {
		this.chick_group = this.game.add.group();
		this.match.add(this.chick_group);

		this.chick_group.x = centx + 180;
		this.chick_group.y = centy - 150;
		this.chick_group.alpha = 0;
		var feather = this.game.add.sprite(0, 0, 'feather');
		feather.animations.add('fire');
		feather.anchor.set(0.5);
		feather.name = 'feather';
		feather.x = centx + 170, feather.y = centy - 350;
		feather.visible = false;
		this.match.add(feather);

		var body = this.game.add.sprite(0, 0, 'chick');
		body.anchor.set(0.5), body.frame = 0, body.name = 'body';
		this.chick_group.add(body);
		var wing = this.game.add.sprite(0, 0, 'wing_2');
		wing.scale.x = -1;
		wing.anchor.set(0.5);
		wing.x = -20;
		wing.y = 20;
		this.chick_group.add(wing);
		wing.name = 'wing';// 小鸡被击飞时停掉anim
		var run = wing.animations.add('fire');
		run.play(20, true);

		this.chickJump();
		var tw = CK.getTween(this.chick_group);
		CK.exetw(tw, {alpha: 1}, 200);

	}

	p.chickJump = function () {

		var oldY = this.chick_group.y;
		this.jumpTw = CK.getTween(this.chick_group);
		CK.exetw(this.jumpTw, {y: oldY - 30}, 200);
		this.jumpTw.onComplete.addOnce(()=>{
			CK.exetw(this.jumpTw, {y: oldY}, 200);
			this.jumpTw.onComplete.addOnce(()=>{
				this.chickJump();
			});
		});
	}

	p.addPlayer = function (group, user) {
		// 添加头像
		var cc;
		if(this.cache.checkImageKey(user.id)) {
			cc = CK.getSprite(user.id);
		} else {
			cc = CK.getSprite(CK.data.selfId);
		}
		
		cc.anchor.set(0.5);
		cc.scale.set(120 / cc.width);

		var bgC = this.game.add.graphics(0, 0);
		bgC.beginFill(0xffffff);
		bgC.drawCircle(cc.x, cc.y, cc.width + 10);
		bgC.endFill();
		group.add(bgC);

		var mask = this.game.add.graphics(0, 0);
		mask.beginFill(0xffffff);
		mask.drawCircle(cc.x, cc.y, cc.width);
		mask.endFill();

		cc.mask = mask;
		
		group.add(cc);
		group.add(mask);

		var lableY = cc.height / 2 + 10;
		var name = this.game.make.text(0, 0, '', { font: "28px Arial", fill: "#ffffff" });
		name.anchor.set(0.5);
		name.y = lableY + 40;
		var str = CK.substr(user.name, 16);
		name.text = str;
		group.add(name);

		if(!!user.sex) {
			var sex = this.game.add.image(0, 0, 'preload', 'sex_' + user.sex + '.png');
			sex.anchor.set(0.5);
			sex.x = (cc.width >> 1) - 10;
			sex.y = (cc.height >> 1) - 100;
			group.add(sex);
		}

	}

	p.addTips = function (centx, centy) {
		var tips = [
			"小鸡飞行过程中会自动发射炮弹",
			"吃到道具后，下一发炮弹就会多一枚",
			"被攻击后，点击屏幕就能快速飞起",
			"占领高位更有优势",
			"点击小鸡就能飞起来喔",
			"躲避对方的炮弹避免被击中"
		];

		var tip = this.game.make.text(0, 0, "小贴士：" + tips[Math.floor(Math.random() * tips.length)], { font: "26px Arial", fill: "#1F6AB4" });
		tip.anchor.set(0.5);
		tip.x = centx;
		tip.y = centy + 140;
		this.match.add(tip);
	}

	p.onstart = function () {
		console.log('load complete');

		var button = this.match.getByName('begin');
		button.visible = false;
		this.guide_point.destroy();
		this.game.time.events.remove(this.matchHandler);

		this.rival_group.x = this.game.width + 100;
		this.rival_group.y = this.self_group.y;
		this.addPlayer(this.rival_group, CK.data.self);

		var tarX = this.self_group.x + ((this.game.width >> 1) - this.self_group.x) * 2;

		var rivalTw = CK.getTween(this.rival_group);
		CK.exetw(rivalTw, {x: tarX}, 100);

		var light = this.match.getByName('light');
		light.visible = true;
		var fire = light.animations.getAnimation('fire');
		fire.play(20, false);


		var body = this.chick_group.getByName('body');
		body.frame = 1, body.scale.set(1.05);

		this.jumpTw.stop();
		var chkTw = CK.getTween(this.chick_group);
		CK.exetw(chkTw, {x: -100, y: 100, rotation: -6}, 400);

		var feather = this.match.getByName('feather');
		feather.visible = true;
		var f_fire = feather.animations.getAnimation('fire');
		f_fire.play(10, false);

		
		this.matchingText.text = "匹配成功";	
		this.coolDownText.visible = false;

		this.game.time.events.add(1200, ()=>{
			if(this.assetsLoaded) {
				this.state.start('Fight');
			} else {
				this.turnToLoading();
			}
		})
	}

	p.update = function (game) {

		CK.app.update(game);
		if(!this.isCounting) return;
	}

	p.turnToLoading = function() {
        this.loaderHandler = this.game.time.events.loop(700, this.setPoint, this);
    }

    p.shake = function() {
        var grp = this.loader.getByName('loader');
        var tw = this.game.add.tween(grp);
		tw.to({y: (this.game.height >> 1) + 30}, 400, null, true, 0, 0, false);
		tw.onComplete.addOnce(()=> {
            var ta = this.game.add.tween(grp);
            ta.to({y: this.game.height >> 1}, 400, null, true, 0, 0, false);
			ta.onComplete.addOnce(()=>{
				this.shake();
			});
		});
    }

    p.setPoint = function() {
        if(this.assetsLoaded) {
            this.game.time.events.remove(this.loaderHandler);
            this.state.start('Fight');
            return;
        }
        var show = this.loadCounter % 4;
        this.loadCounter++;
        this.matchingText.text = "资源加载中" + this.points[show];
    }

    p.onclose = function () {
		CK.app.evtMgr.remove('evt_netclose', this.onclose);
		this.isClosed = true;
		this.close_group = CK.getGroup(this.game.width >> 1, this.game.height + 100);
		this.base.add(this.close_group);
		var bgC = this.game.add.graphics(0, 0);
		bgC.beginFill(0x000000, 0.85);
		bgC.drawRect(-(this.game.width >> 1), -50, this.game.width, 100);
		bgC.endFill();
		bgC.anchor.set(0.5);
		this.close_group.add(bgC);

		this.closeText = this.game.make.text(0, 0, "网络不稳定，小主请再试试？", { font: "bold 32px Arial", fill: "#ffffff" });
		this.closeText.anchor.set(0.5);
		this.closeText.x = 0;
		this.closeText.y = 0;
		this.closeText.scale.set(1);
		this.close_group.add(this.closeText); 

		var tw = CK.getTween(this.close_group);
		CK.exetw(tw, {y: this.game.height >> 1}, 300);
		tw.onComplete.addOnce(function () {
			var tt = CK.getTween({});
			CK.exetw(tt, {}, 1800);
			tt.onComplete.addOnce(function () {
				var ta = CK.getTween(this.close_group);
				CK.exetw(ta, {alpha: 0}, 300);
				ta.onComplete.addOnce(function () {
					this.base.remove(this.close_group);
				}, this);
			}, this);
		}, this);
	}

	CK.MatchSOW = MatchSOW;
})()