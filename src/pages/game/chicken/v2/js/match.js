/**匹配界面控制器-大厅进入 */
var CK = CK || {};

(function () {
	var Match = function () {
		
		this.counter = 0;
		this.points = ['', '.', '..', '...'];
		this.assetsLoaded = false;
		this.isClosed = false;
		this.enterTime = Date.now();

		this.loadCounter = 0;
	}

	var p = Match.prototype;

	p.init = function () {
		this.base = this.game.add.group();

        this.add.sprite(0, 0, 'mbg', 0, this.base);
        var block = this.game.add.image(0, 0, 'preload', 'module.png');
		block.anchor.set(0.5);
		block.x = this.game.width >> 1, block.y = 570;
		this.base.add(block);

        this.match = this.game.add.group();
        // this.match.y = 50;
        this.base.add(this.match);

        this.userSys = CK.data;
        this.loadCounter = 0;
		this.counter = 0;

        embedExport(embedData.img_matching_expose_exposure);

        this.doMatch();

        CK.app.evtMgr.on(CK.NetMsgID.matchRsp, this.onMatched, this);
		CK.app.evtMgr.on('evt_netclose', this.onclose, this);
		CK.app.netMgr.send(CK.NetMsgID.match, {tenter: false});
        this.matchHandler = this.game.time.events.loop(1000, this.timer1, this);
		
	},

	p.timer1 = function() {
        this.counter++;
        this.matchingText.text = "匹配中" + this.points[this.counter % 4];
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

		CK.data.removeUserById(CK.data.self.rivalId);

		var centx = (this.game.width >> 1),
			centy = 663;
		// console.log('centx: %s, centY: %s', centx, centy);
		this.self_group = CK.getGroup(0, 0);
		this.self_group.x = centx - 170;
		this.self_group.y = centy - 150;
		this.rival_group = CK.getGroup(0, 0);
		this.match.add(this.self_group);
		this.match.add(this.rival_group);

		var vs = this.game.add.image(0, 0, 'preload', 'vs.png');
		vs.y = centy - 150; vs.x = this.game.width >> 1;
		vs.anchor.set(0.5);
		this.match.add(vs);

		this.matchingText = this.game.make.text(0, 0, "匹配中", { font: "32px Arial", fill: "#ffffff" });
		this.matchingText.anchor.set(0.5);
		this.matchingText.x = centx;
		this.matchingText.y = centy + 40;
		this.matchingText.scale.set(1.5);
		this.match.add(this.matchingText);

		this.addPlayer(this.self_group, CK.data.self);
		this.addTips(centx, centy);
		// this.game.time.events.add(500, ()=>{
			
		// });
		this.addChick(centx, centy);
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
		

		var feather = this.game.add.sprite(0, 0, 'feather');
		feather.animations.add('fire');
		feather.anchor.set(0.5);
		feather.name = 'feather';
		feather.x = centx + 170, feather.y = centy - 350;
		feather.visible = false;
		// var fire = feather.animations.getAnimation('fire');
		// fire.play(10, true);
		this.match.add(feather);


		this.chick_group = this.game.add.group();
		this.match.add(this.chick_group);

		this.chick_group.x = centx + 180;
		this.chick_group.y = centy - 150;
		this.chick_group.alpha = 0;


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
		var str = user.name;
		if(user.id === CK.data.selfId) {
			str = '我'
		} else {
			str = CK.substr(str, 16);
		}
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

	p.onMatched = function (data) {
		console.log('匹配完成服务器耗时：%s 秒', (data.time));
		console.log('匹配完成耗时：%s 秒', (Date.now() - this.enterTime) / 1000);
		CK.app.evtMgr.remove(CK.NetMsgID.matchRsp, this.onMatched);
		embedExport(embedData.img_matched_expose_exposure);
		data = data.b;
		
		CK.data.self.rivalId = data.usk;
		CK.data.addUser({
			userId: data.usk, 
			nickName: data.nickName, 
			rivalId: CK.data.self.id, 
			sex: data.sex,
			headUrl: data.headUrl
		});
		this.rivalId = data.usk;
		this.game.time.events.remove(this.matchHandler);
		if(this.cache.checkImageKey(data.usk)) {
			this.loadComplete();
			return;
		}

		var loader = new Phaser.Loader(this.game);
		loader.crossOrigin = 'anonymous';
		
		loader.onLoadComplete.removeAll();
		loader.onLoadComplete.addOnce(this.loadComplete, this);
		loader.onFileError.add(function (e) {
			console.log(e);
		});
		loader.image(data.usk, data.headUrl);
    	loader.start();
	}

	p.loadComplete = function () {
		console.log('load complete');

		this.rival_group.x = this.game.width + 100;
		this.rival_group.y = this.self_group.y;
		this.addPlayer(this.rival_group, CK.data.getUserById(this.rivalId));

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

	CK.Match = Match;
})()