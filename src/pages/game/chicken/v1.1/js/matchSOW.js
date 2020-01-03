/**匹配界面控制器-大厅进入 */
var CK = CK || {};

(function () {
	var MatchSOW = function () {
		CK.MatchBase.call(this);
		// 当前场景结束时，会销毁所有base中的所有显示对象，
		// 如果有事件监听在此时响应就会crash，所以需要一个标记控制
		this._destroyed = false;
		this.secondList = [];
	}
	CK.extends(MatchSOW, CK.MatchBase);
	var p = MatchSOW.prototype;
	var _super = p.__super;

	p.init = function () {
		_super.init.call(this);
		this.matchCounter = 0;
		this._destroyed = false;
		this.secondList = [];
        // 添加弹幕显示组
        this.barrage_group = this.game.add.group();
        this.base.add(this.barrage_group);
        this.addlistener();
        this.addOnlineNumber();
        this.addBarrages();
		if(CFG.debug) this.addDebugVersion();
		this.secondList.push(this.timer1);
		this.secondList.push(this.updateOlNum);
        this.matchHandler = this.game.time.events.loop(1000, this.secCall, this);
        
		CK.app.netMgr.send(CK.NetMsgID.onlineNumReq, null);
		
		this.counter = 5;
	},

	p.timer1 = function() {
        this.counter--;
        if(this.counter <= 0) {
        	this.loadComplete();
        } else {
        	this.coolDownText.text = "即将自动开战(" + this.counter + ")";
        }
	}
	
	p.secCall = function () {
		this.secondList.forEach((val)=>{
			val.call(this);
		});
	}

	p.updateOlNum = function () {
		CK.app.netMgr.send(CK.NetMsgID.onlineNumReq, null);
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
        var impTxt = this.game.add.text(0, 0, 'version: chicken-v1.1', {font: "10px Arial", fill: '#1F6AB4'});
        impTxt.x = 10, impTxt.y = 4;
    }

    // 在线人数文本
    p.addOnlineNumber = function() {
        var centx = this.game.width >> 1
        this.onlineTxt = this.game.add.bitmapText(100, 200, 'num_ol', 'haha', 64);
        this.onlineTxt.anchor.set(0.5);
        this.onlineTxt.x = centx - 10;
        this.onlineTxt.y = 240;
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
	
	// 每隔1s更新玩家数量文本
    p.onUpdateOnlineNum = function (data) {
        console.log(data, new Date());
        if(this._destroyed) return;
        var old = parseInt(this.onlineTxt.text);
        if(!data) {
            data = old + Math.floor(Math.random() * 91) + 10;
        }
        this.onlineTxt.text = data;
        var pair = this.base.getByName('pair');
        pair.x = this.onlineTxt.x + this.onlineTxt.width / 2;
    }

    p.addlistener = function () {
        CK.app.evtMgr.on(CK.NetMsgID.matchRsp, this.onMatched, this);
        CK.app.evtMgr.on(CK.NetMsgID.onlineNumRsp, this.onUpdateOnlineNum, this);
    }


	p.shutdown = function () {
        _super.shutdown.call(this);
		this._destroyed = true;
		this.game.time.events.remove(this.matchHandler);
        CK.app.evtMgr.remove(CK.NetMsgID.onlineNumRsp, this.onUpdateOnlineNum);
	}

	p.doMatch = function () {
		var centx = (this.game.width >> 1),
			centy = 663;
		_super.doMatch.call(this);

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
			if(this.stepHandler) {
				this.game.time.events.remove(this.stepHandler);
			}
			this.loadComplete();
		});
		this.coolDownText = this.game.make.text(0, 0, "即将自动开战(5)", { font: "22px Arial", fill: "#ffffff" });
		this.coolDownText.anchor.set(0.5);
		this.coolDownText.x = centx;
		this.coolDownText.y = 1030;
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

	p.loadComplete = function () {

		var button = this.match.getByName('begin');
		button.visible = false;
		this.guide_point.destroy();
		this.secondList.shift();
		this.addPlayer(this.rival_group, CK.data.self);

		_super.loadComplete.call(this);
		this.coolDownText.visible = false;
	}
	CK.MatchSOW = MatchSOW;
})()