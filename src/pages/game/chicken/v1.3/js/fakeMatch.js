/**匹配界面控制器-大厅进入 */
var CK = CK || {};

(function () {
	var FakeMatch = function () {
		
		this.counter = 0;
		this.points = ['', '.', '..', '...'];
		this.assetsLoaded = false;
		this.isClosed = false;
		this.enterTime = Date.now();

		this.loadCounter = 0;
	}

	var p = FakeMatch.prototype;

	p.init = function () {
		// CK.app.evtMgr.on('evt_fakeMatch', this.rcvFakeMatch, this);
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.stage.disableVisibilityChange = true;
		CK.app.evtMgr.on(CK.NetMsgID.fakeMatchRsp, this.onFakeMatch, this);
		CK.app.evtMgr.on('evt_netclose', this.onclose, this);
	}

	p.preload = function() {
		this.load.crossOrigin = 'anonymous';
		var host = "//yun.dui88.com/h5-mami/webgame/chicken/asset/";
		this.load.image('mbg', host + 'match_bg2.jpg');
		this.load.atlasXML('preload', host + 'preload.png', host + 'preload.xml');
		var users = CK.data.getAllUsers();
		for(var i = 0, j = users.length; i < j; i++) {
			var user = users[i];
			var head_url = CK.assetFixCheck(user.avator);
			
			this.load.image(user.id, head_url);
		}
	},

	// 预备资源加载完毕，布置准备界面
	p.create = function () {
		// 在加载预备资源的同时，启动全部资源加载
		this.doLoad();
		this.setUI();
	}

	p.update = function (game) {
		CK.app.update(game);
		if(!this.isCounting) return;
	}

	p.shutdown = function () {
        this.match.removeAll();
        this.base.destroy();
	}

	p.setUI = function () {
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
		this.counter = 0;
        embedExport("img_matching_expose_exposure", true);
        this.setLoadUI();
        // this.matchHandler = this.game.time.events.loop(1000, this.timer1, this);
	}


	p.doLoad = function() {
		var loader = new Phaser.Loader(this.game);
		loader.crossOrigin = 'anonymous';
		loader.onLoadComplete.removeAll();
		loader.onLoadComplete.addOnce(()=>{
			this.assetsLoaded = true;
		});

		for (var i = CK.res.length - 1; i >= 0; i--) {
			var res = CK.res[i];
			if(res.type === 'image') {
				loader.image(res.name, res.url);
			} else if(res.type === 'spritesheet') {
				loader.spritesheet(res.name, res.url, res.w, res.h, res.frame);
			}
		}
		
		loader.start();
	}

	p.setLoadUI = function () {

		embedExport("img_matching_expose_exposure", true);

		var centx = (this.game.width >> 1),
			centy = 663;

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

		this.matchingText = this.game.make.text(0, 0, "资源加载中", { font: "32px Arial", fill: "#ffffff" });
		this.matchingText.anchor.set(0.5);
		this.matchingText.x = centx;
		this.matchingText.y = centy + 40;
		this.matchingText.scale.set(1.5);
		this.match.add(this.matchingText);

		this.addPlayer(this.self_group, CK.data.self);
		this.addTips(centx, centy);
		
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

	p.loadComplete = function () {
		console.log('load complete');

		var tarX = this.self_group.x + ((this.game.width >> 1) - this.self_group.x) * 2;

		this.rival_group.x = tarX;
		this.rival_group.y = this.self_group.y;
		this.addPlayer(this.rival_group, CK.data.getUserById(this.rivalId));

		this.game.time.events.add(1200, ()=>{
			if(this.assetsLoaded) {
				this.state.start('Fight');
			} else {
				this.turnToLoading();
			}
		})
	}

	p.onFakeMatch = function (data) {
		window.hideResultByGame();
		CK.app.evtMgr.remove(CK.NetMsgID.fakeMatchRsp, this.onFakeMatch);
		data = data.b;
		
		this.rivalId = data.usk;
		CK.data.self.rivalId = data.usk;
		CK.data.addUser({
			userId: data.usk, 
			nickName: data.nickName, 
			rivalId: CK.data.self.id, 
			sex: data.sex,
			headUrl: data.headUrl
		});

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

	p.turnToLoading = function() {
        this.loaderHandler = this.game.time.events.loop(700, this.setPoint, this);
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

	CK.FakeMatch = FakeMatch;
})()