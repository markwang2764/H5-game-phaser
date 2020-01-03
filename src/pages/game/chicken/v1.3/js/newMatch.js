/**匹配界面控制器-大厅进入 */
var CK = CK || {};

(function () {
	var NewMatch = function () {
		this.haha = 'haha';
	}

	CK.extends(NewMatch, CK.MatchBase);

	var p = NewMatch.prototype;
	var _super = p.__super;

	p.init = function () {
		_super.init.call(this);
		this.counter = 0;
		CK.app.evtMgr.on(CK.NetMsgID.matchRsp, this.onMatched, this);
		CK.app.netMgr.send(CK.NetMsgID.match, {tenter: false});
		this.matchHandler = this.game.time.events.loop(1000, this.timer1, this);
	},

	p.timer1 = function() {
        this.counter++;
        this.matchingText.text = "匹配中" + this.points[this.counter % 4];
    }

	p.doMatch = function () {

		CK.data.removeUserById(CK.data.self.rivalId);
		_super.doMatch.call(this);
		this.addPlayer(this.self_group, CK.data.self);
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

	p.onMatched = function (data) {
		CK.app.evtMgr.remove(CK.NetMsgID.matchRsp, this.onMatched);
		embedExport(embedData.img_matched_expose_exposure);
		data = data.b;
		
		CK.data.self.rivalId = data.usk;
		data.rivalId = CK.data.self.id;
		CK.data.addUser(data);
		
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

	CK.NewMatch = NewMatch;
})()