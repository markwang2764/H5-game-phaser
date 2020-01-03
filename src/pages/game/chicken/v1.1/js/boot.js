var CK = CK || {};

(function () {
	var Boot = function () {
		
	}

	var p = Boot.prototype;

	p.init = function () {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.stage.disableVisibilityChange = true;
	}

	p.preload = function () {
		this.load.crossOrigin = 'anonymous';
		// 新的背景图
		// 三个序列帧图，翅膀，光效，羽毛
		// 一张图集
		var host = "//yun.dui88.com/h5-mami/webgame/chicken/asset/";
		this.load.image('mbg', host + 'match_bg2.jpg');
		this.load.atlasXML('preload', host + 'preload.png', host + 'preload.xml');
		this.load.spritesheet('lights', host + 'lights.png', 380, 380, 10);
		this.load.spritesheet('feather', host + 'feather.png', 400, 400, 8);
		this.load.spritesheet('wing_2', host + 'wing_2.png', 67, 91, 6);
		this.load.spritesheet('chick', host + 'chick.png', 200, 200, 2);
		this.load.spritesheet('click', host + 'click.png', 100, 100, 14);
		this.game.load.bitmapFont('num_ol', host + 'num_ol.png', host + 'num_ol.xml', null, 0);
		this.load.image('horn', host + 'horn.png');
		var head_url = CK.assetFixCheck(CK.data.self.avator);
		
		this.load.image(CK.data.selfId, head_url);
	}

	p.create = function () {
		// 单投，需要先发起匹配请求，匹配成功再切换到‘Match’
		if(CK.data.tenter) {
			CK.app.evtMgr.on(CK.NetMsgID.matchRsp, this.onmatch, this);
			CK.app.netMgr.send(CK.NetMsgID.match, {tenter: true});
		} else {
			this.state.start('Match');
		}
	}

	p.onmatch = function (data) {
		data = data.b;
		CK.data.self.rivalId = data.usk;
		CK.data.addUser({
			userId: data.usk, 
			nickName: data.nickName, 
			rivalId: CK.data.self.id, 
			sex: data.sex,
			headUrl: data.headUrl
		});

		if(this.cache.checkImageKey(data.usk)) {
			this.prematch();
			return;
		}

		var loader = new Phaser.Loader(this.game);
		loader.crossOrigin = 'anonymous';
		
		loader.onLoadComplete.removeAll();
		loader.onLoadComplete.addOnce(this.prematch, this);
		var head_url = CK.assetFixCheck(data.headUrl);
		loader.image(data.usk, head_url);
    	loader.start();
	}

	p.prematch = function () {
		this.state.start('MatchSOW');
	}

	p.update = function (g) {
		CK.app.update(g);
	}

	CK.Boot = Boot;
})()