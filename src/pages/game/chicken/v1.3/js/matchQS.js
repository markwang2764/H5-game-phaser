/**匹配界面控制器-趣晒分享版 */
var CK = CK || {};
(function () {
    var MatchQs = function () {
        CK.MatchBase.call(this);

        this._destroyed = false;
    }
    CK.extends(MatchQs, CK.MatchBase);
    var p = MatchQs.prototype;
    var _super = p.__super;

    /**
     * 基类：初始化base组容器，渲染基础背景，添加数据系统引用，添加事件监听，初始化匹配过程动画
     * 子类：添加额外事件监听 
     */
    p.init = function () {
        _super.init.call(this);
        this._destroyed = false;
        // 添加弹幕显示组
        this.barrage_group = this.game.add.group();
        this.base.add(this.barrage_group);
        this.addlistener();
        this.addOnlineNumber();
        this.addBarrages();
        if(CFG.debug) this.addDebugVersion();
        this.matchHandler = this.game.time.events.loop(1000, this.timer1, this);
        this.onlineHandler = this.game.time.events.loop(1000, ()=>{
            CK.app.netMgr.send(CK.NetMsgID.onlineNumReq, null);
        }, this);
        CK.app.netMgr.send(CK.NetMsgID.match, {tenter: false});
    }

    p.addBarrages = function() {
        $.get('/common/getChickenBarrage', (data)=>{

            this.game.time.events.add(1000, ()=>{
                for(var i = data.length - 1; i >= 0; i--) {
                    var barr = this.createBarrage(data[i]);
                    this.barrage_group.add(barr);
                    var srcy = Math.floor(Math.random() * 800) + 100;
                    barr.y = srcy;
                    var tarx = -barr.width;
                    var btw = this.game.add.tween(barr);
                    var delay = Math.floor(Math.random() * 1000);
                    var duration = Math.floor(Math.random() * 101) + 2900;
                    btw.to({x: tarx}, duration, null, true, delay, 0, false);
                    btw.onComplete.add((sp)=>{
                        sp.destroy();
                    });
                }
            });
        });
    }

    // 创建一条弹幕现实对象
    p.createBarrage = function(tipObj) {
        var group = this.game.add.group();
        var cir = this.game.add.graphics(0, 0);
        cir.beginFill(0xE2E9ED, 1);
        cir.drawCircle(30, 30, 60);
        cir.endFill();
        group.add(cir);

        var tailcir = this.add.graphics(0, 0);
        tailcir.beginFill(0xE2E9ED, 1);
        tailcir.drawCircle(0, 0, 40);
        tailcir.endFill();
        group.add(tailcir);

        var rect = this.add.graphics(0, 0);
        rect.beginFill(0xE2E9ED, 1);
        rect.drawRect(0, 10, 200, 40);
        rect.endFill();
        rect.x = 20;
        group.add(rect);

        // 添加小喇叭
        var horn = this.add.sprite(0, 0, 'horn');
        horn.anchor.set(0.5);
        horn.x = 30, horn.y = 30;
        group.add(horn);

        var conts = tipObj.cont,
            names = tipObj.names,
            _float = 60;
        for(var i = 0; i < conts.length; i++) {
            if(!!conts[i]) {
                var contslice = this.game.add.text(0, 0, conts[i], {font: "30px Arial", fill: "#0087f3"});
                contslice.anchor.set(0.5);
                contslice.x = _float + contslice.width / 2;
                contslice.y = 33;
                _float += contslice.width;
                group.add(contslice);
            }
            var nm = names.shift();
            if(!!nm) {
                var name = this.game.add.text(0, 0, nm, {font:"30px Arial", fill: "#f66900"});
                name.anchor.set(0.5);
                name.x = _float + name.width / 2;
                name.y = 33;
                _float += name.width;
                group.add(name);
            }
        }
        rect.width = _float;
        tailcir.x = rect.x + rect.width;
        tailcir.y = 30;
        var render = this.game.make.renderTexture(tailcir.x + 60, 60);
        render.render(group);
        group.destroy(true, true);
        var sp = this.add.sprite(0, 0, render);
        sp.x = this.game.width + 20;
        return sp;
    }

    p.addDebugVersion = function(){
        var impTxt = this.game.add.text(0, 0, 'version: matchQS', {font: "10px Arial", fill: '#1F6AB4'});
        impTxt.x = 10, impTxt.y = 4;
    }

    // 在线人数文本
    p.addOnlineNumber = function() {
        var centx = this.game.width >> 1
        this.onlineTxt = this.game.add.bitmapText(100, 200, 'num_ol', 'haha', 64);
        this.onlineTxt.anchor.set(0.5);
        this.onlineTxt.x = centx - 10;
        this.onlineTxt.y = 240;
        // this.onlineTxt.text = 1231456;
        this.base.add(this.onlineTxt);

        var pair = this.game.add.text(0, 0, '对', {
            font: "38px Arial",
            fill: "#BED9F5",
            stroke: "#5D8ECA",
            strokeThickness: 6
        });
        var offx = this.onlineTxt.x + this.onlineTxt.width / 2;
        [pair.x, pair.y] = [offx, 225];
        pair.name = 'pair';
        this.base.add(pair);
        
        var playing = this.game.add.text(0, 0, '正在一起玩', {
            font: "32px Arial",
            fill: "#BED9F5",
            stroke: "#5D8ECA",
            strokeThickness: 6
        });
        playing.anchor.set(0.5);
        [playing.x, playing.y] = [centx, 300];
        this.base.add(playing);
        CK.app.netMgr.send(CK.NetMsgID.onlineNumReq, null);
    }

    p.addlistener = function () {
        CK.app.evtMgr.on(CK.NetMsgID.matchRsp, this.onMatched, this);
        CK.app.evtMgr.on(CK.NetMsgID.onlineNumRsp, this.onUpdateOnlineNum, this);
    }

    p.timer1 = function() {
        this.counter++;
        this.matchingText.text = "匹配中" + this.points[this.counter % 4];
    }

    // 每隔1s更新玩家数量文本
    p.onUpdateOnlineNum = function (data) {
        console.log(data);
        if(this._destroyed) return;
        var old = parseInt(this.onlineTxt.text);
        if(!data) {
            data = old + Math.floor(Math.random() * 91) + 10;
        }
        this.onlineTxt.text = data;
        var pair = this.base.getByName('pair');
        pair.x = this.onlineTxt.x + this.onlineTxt.width / 2;
    }

    p.doMatch = function () {
        _super.doMatch.call(this);
        this.addPlayer(this.self_group, CK.data.self);
    }

    p.addTips = function (centx, centy) {
		var tips = [
			"点击屏幕小鸡就能飞起来哦",
            "与对手嘴炮互射，活到最后的人获胜",
            "死亡后立即点击屏幕就可以重新起飞",
            "底部的表情包可以挑衅对手哦",
		];
		var tip = this.game.make.text(0, 0, "小贴士：" + tips[Math.floor(Math.random() * tips.length)], { font: "26px Arial", fill: "#1F6AB4" });
		tip.anchor.set(0.5);
		tip.x = centx;
		tip.y = centy + 140;
		this.match.add(tip);
	}

    p.onMatched = function (data) {
        CK.app.evtMgr.remove(CK.NetMsgID.matchRsp, this.onMatched);
        this.game.time.events.remove(this.matchHandler);
		embedExport(embedData.img_matched_expose_exposure);
		data = data.b;
		
		CK.data.self.rivalId = data.usk;
		data.rivalId = CK.data.self.id;
        CK.data.addUser(data);
        
		if(this.cache.checkImageKey(data.usk)) {
			this.loadComplete();
		} else {
            var loader = new Phaser.Loader(this.game);
            loader.onLoadComplete.removeAll();
            loader.onLoadComplete.addOnce(this.loadComplete, this);
            loader.crossOrigin = 'anonymous';
            loader.image(data.usk, data.headUrl);
            loader.start();
        }
    }
    
    p.loadComplete = function () {

		this.rival_group.x = this.game.width + 100;
		this.rival_group.y = this.self_group.y;
		this.addPlayer(this.rival_group, CK.data.getUserById(CK.data.self.rivalId));

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
    
    // 移除所有显示对象，计时器监听，讲道理也应该移除所有本界面的事件监听
    p.shutdown = function () {
        _super.shutdown.call(this);
        this.game.time.events.remove(this.onlineHandler);
        this._destroyed = true;
        CK.app.evtMgr.remove(CK.NetMsgID.onlineNumRsp, this.onUpdateOnlineNum);
    }
    CK.MatchQs = MatchQs;
})();