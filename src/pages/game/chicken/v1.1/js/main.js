var CK = CK || {};
CK.STAGE_WIDTH = 750;
CK.STAGE_HEIGHT = CK.STAGE_WIDTH / (window.innerWidth/window.innerHeight);
(function () {
	var Main = function () {
		var game = new Phaser.Game(CK.STAGE_WIDTH, CK.STAGE_HEIGHT, Phaser.CANVAS, "chick", {
			create: this.create.bind(this),
			update: this.update.bind(this)
		});
		this.game = game;
		CK.app = this;
		game.state.add('Boot', CK.Boot);

		game.state.add('Match', CK.Match);
		// game.state.add('Load', CK.Loader);
		game.state.add('Fight', CK.Fight);
		game.state.add('MatchSOW', CK.MatchSOW);

		game.state.add('FakeMatch', CK.FakeMatch);

		// 此处本意为构建一个通用的组加载策略，整体构想如下：
		// 1. 创建一个json文件，配置所有资源名与资源路径
		// 2. 游戏启动时载入配置文件
		// 3. 每个场景不再需要实现preload方法，使用全局状态管理器进行状态切换，包括使用独立loader模块代替所有场景的preload
		// 4. 但是现在来不及了。2018年05月02日19:29:56
		// this.loader = new CK.Loader();

		this.netMgr = new CK.NetManager();
		this.evtMgr = new CK.EventManager();
		
	}

	var p = Main.prototype;

	p.preload = function () {
		
	}

	p.create = function() {
		CK.data.selfId = wsData.uid;

		CK.data.robot = wsData.robot;
		CK.data.addUser({
			userId: wsData.uid, 
			nickName: CFG.nickName, 
			sex: CFG.sex,
			headUrl: CFG.headUrl
		});

		$.get("/common/getChickenGift", {
			usk: wsData.uid
		}, (data)=>{
	        var gift = data;
			if(!!gift && !!gift.code){
				var rival = {
			  		name: gift.nickName,
			  		sex: gift.sex,
			  		header: gift.headUrl
				}

				window.showResultByGame('lost', null, null, true, rival);
				var arr = ['', '保护罩', '子弹数+1'];
	    		var tips = '领取成功！<br>下局游戏将获得【' + arr[gift.code] + '】，12小时内有效。';
				window.showToast(tips);
				this.game.state.start('FakeMatch');
			} else {
				this.game.state.start('Boot');
			}
	    })
	}

	p.update = function (game) {
		var dlt = game.time.elapsed;
		this.netMgr.update(dlt);
		this.evtMgr.update(dlt);
	}

	CK.Main = Main;
})()