var CK = CK || {};

(function () {
	var Chick = function (parent, game, index, mgr, rivalId) {
		this.game = game;
		this.mgr = mgr;
		this.vy = 0;
		this.acc = 0.001;
		this.life = 3;
		this.index = index;
		this.rivalId = rivalId;
		this.chick = game.add.group();
		parent.add(this.chick);
		this.targetType = CK.TargetType.Chick;
		this.wrapperGroup(index);
		this.wrapperComp(index);
		// this.firstGame = true;
	}

	var p = Chick.prototype;

	p.addListen = function () {
		
	}

	/**组装小鸡零部件 */
	p.wrapperGroup = function (index) {
		// 身体
		this.body_group = this.game.add.group();
		this.chick.add(this.body_group);
		var rate = [1, -1][index];
		// 嘴
		this.mouth_group = this.game.add.group();
		this.chick.add(this.mouth_group);
		this.mouth_group.x = rate * 51, this.mouth_group.y = 29;
		// 集气
		this.buildup_group = this.game.add.group();
		this.chick.add(this.buildup_group);
		this.buildup_group.x = rate * 70, this.buildup_group.y = 24;
		// 翅膀
		this.wing_group = this.game.add.group();
		this.chick.add(this.wing_group);
		this.wing_group.x = -rate * 26, this.wing_group.y = 14;
		// 击中烟雾
		this.fog_group = this.game.add.group();
		this.chick.add(this.fog_group);
		this.fog_group.x = rate * 6, this.fog_group.y = 4;
		// 获得道具特效
		this.buff_group = this.game.add.group();
		this.chick.add(this.buff_group);
		this.buff_group.x = rate * 7, this.buff_group.y = 13;
		// 重生烟雾
		this.born_group = this.game.add.group();
		this.chick.add(this.born_group);
		this.born_group.x = rate * 6, this.born_group.y = 4;
		// 喷气烟雾
		this.jet_group = this.game.add.group();
		this.chick.add(this.jet_group);
		this.jet_group.x = rate * 0, this.jet_group.y = 94;
		// 保护罩
		this.cover_group = this.game.add.group();
		this.chick.add(this.cover_group);
		this.cover_group.x = rate * 10, this.cover_group.y = 0;
	}

	p.setCenter = function (sprite) {
		try {
			sprite.anchor.set(0.5, 0.5);
		}catch(e) {
			console.log(e);
		}
	}

	p.wrapperComp = function (index) {
		// 嘴
		this.mouth = CK.getSprite('mouth');
		this.setCenter(this.mouth);
		if(index) this.mouth.scale.x = -1;
		this.mouth.frame = 0;
		this.mouth_group.add(this.mouth);
		// 集气
		this.build_up = CK.getSprite('buildup_' + (index + 1));
		this.setCenter(this.build_up);
		this.buildup_group.add(this.build_up);
		this.build_up.visible = false;
		// 翅膀
		this.wing = CK.getSprite('wing_' + (this.index + 1));
		this.setCenter(this.wing);
		this.wing_group.add(this.wing);
		// 击中烟雾
		this.fog = CK.getSprite('attack');
		this.setCenter(this.fog);
		this.fog_group.add(this.fog);
		this.fog.visible = false;
		// 获得道具特效
		this.buff = CK.getSprite('buff');
		this.setCenter(this.buff);
		this.buff_group.add(this.buff);
		this.buff.visible = false;
		// 重生烟雾
		this.reborn = CK.getSprite('reborn');
		this.setCenter(this.reborn);
		// this.reborn.animations.add('fire');
		this.born_group.add(this.reborn);
		this.reborn.visible = false;
		// 喷气烟雾
		this.jet = CK.getSprite('jet');
		this.setCenter(this.jet);
		this.jet_group.add(this.jet);
		this.jet.visible = false;
		// 保护罩
		this.cover = CK.getSprite('cover');
		this.setCenter(this.cover);
		this.cover_group.add(this.cover);
		this.cover.visible = false;
		// 保护罩破裂
		this.cbreak = CK.getSprite('break');
		this.setCenter(this.cbreak);
		this.cover_group.add(this.cbreak);
		this.cbreak.visible = false;
	}

	p.getBox = function () {
		var box = this.game.add.graphics();
		box.beginFill(0xff0000, 0.45);
		box.drawRect(0, 0, 20, 20);
		box.anchor.set(0.5, 0.5);
		return box;
	}

	p.update = function (dlt) {
		
		var newY = this.chick.y + this.vy * dlt;
		if(newY >= 1080) {
			this.chick.y = 1080;
			if(this.isHurt) {
				this.isHurt = false;
				this.doReborn();
			}
			this.vy = 0;
		} else if(newY <= (this.top + 160)) {
			this.chick.y = this.top + 160;
			this.vy += this.acc * dlt;
		} else {
			this.vy += this.acc * dlt;
			// if(this.vy >= 0 && this.vy <= 0.0016) {
			// 	console.log(this.chick.y - this.clicky, new Date().getTime() - this.clicktime);
			// }
			this.chick.y = newY;
		}
	}

	/**被添加到场景 */
	p.onAdd = function () {
		
		this.chick.x = 100 + 550 * this.index, this.chick.y = 1080;
		this.chick.scale.set(0.5, 0.5);

		this.body = CK.getSprite('chicken_' + this.index);
		
		this.top = this.body.height >> 1;
		this.body.anchor.set(0.5, 0.5);
		// this.body_group.add(this.body);

		this.born();
		var tw = this.game.add.tween(this.chick.scale);
		tw.to({x: 1, y: 1}, 200, Phaser.Easing.Bounce.InOut, true, 100, 0, false);
	}

	/**释放喷气 */
	p.playJet = function () {
		if(this.vy >= -0.02) {
			this.jet.animations.stop(null, false);
			this.jet.visible = false;
			return;	
		}
		this.jet.visible = true;
		var fire = this.getAnimPlayer(this.jet, 'fire');
		// this.jet.animations.add('fire');
		fire.onComplete.add(this.playJet, this);
		fire.play(20, false);
	}

	/**煽动翅膀 */
	p.playWing = function () {
		if(this.vy >= 0) {
			this.wing.animations.stop(null, false);
			this.wing.frame = 0;
			return;	
		}
		var wave = this.getAnimPlayer(this.wing, 'wave');
		// this.wing.animations.add('wave');
	    // anim.onStart.add(animationStarted, this);
	    // anim.onLoop.add(animationLooped, this);
	    wave.onComplete.add(this.playWing, this);

	    wave.play(20, false);
	}

	p.playPress = function () {
		if(this.vy >= 0) {
			return;	
		}
		var tw = CK.getTween(this.body.scale);
		this.body.scale.y = 0.95;
		CK.exetw(tw, {y: 1}, 300, Phaser.Easing.Bounce.InOut);
		tw.onComplete.addOnce(this.playPress, this);
	}

	/**起跳 */
	p.onJump = function (y) {
		// console.log(this.isHurt);
		if(!this.touchEnable) return;
		this.vy = -0.6;
		this.chick.y = y;
		this.clicky = this.chick.y;

		this.clicktime = new Date().getTime();
		this.playWing();
		this.playJet();
		this.playPress();
	}

	/**集气 */
	p.buildup = function () {
		this.build_up.visible = true;
		this.mouth.frame = 1;
		var start = this.getAnimPlayer(this.build_up, 'start');
		// this.build_up.animations.add('start');
		start.onComplete.addOnce(function () {
			this.build_up.animations.stop(null, false);
			this.build_up.visible = false;
			this.mouth.frame = 0;
			this.fire();
		}, this);
		start.play(20, false);
		// this.startTime = new Date().getTime();
	}

	/**集气后开火*/
	p.fire = function () {
		// console.log('集气到开火用时：已测试（400ms）', new Date().getTime() - this.startTime);
		if(this.isRobot()) return;
		CK.app.netMgr.send(CK.NetMsgID.shoot, null);
		// this.mgr.onShoot({bullets:[{usk:"test01", y:[{id:0, y:1106}]}]});
	}

	p.isRobot = function () {
		return (CK.data.robot && this.index === 1);
	}

	/**发射子弹 */
	p.shoot = function () {
		if(this.isHurt) return;

		this.buildup();
	}

	p.onWin = function (eid, gid) {
		this.body_group.removeAll();
		this.body = CK.getSprite('win_' + this.index);
		this.body.anchor.set(0.5, 1);
		this.body.y = this.top - 10;
		// if(!this.index) cc.scale.x = -1;
		this.body_group.add(this.body);
		this.playHappy(eid, gid);
		this.unInstallComps();
	}

	p.onLost = function () {
		this.body_group.removeAll();
		this.body = CK.getSprite('dead');
		// this.setCenter(cc);
		this.body.anchor.set(0.5, 1);
		this.body.y = this.top - 10;
		if(!this.index) this.body.scale.x = -1;
		this.body_group.add(this.body);
		this.playSad();
		this.unInstallComps();
	}

	p.playHappy = function (eid, gid) {
		this.body.scale.y = 0.95;
		var tw = CK.getTween(this.body.scale);
		// CK.exetw(tw, {y: 1}, 400, Phaser.Easing.Bounce.InOut);
		tw.to({y: 1}, 400, Phaser.Easing.Bounce.InOut, true, 0, 3, false);
		tw.onComplete.addOnce(function () {
			// console.log(eid)
			CK.app.evtMgr.emit({type: CK.EventType.INTER, id: eid}, gid);
		}, this);
	}

	p.playSad = function () {
		this.body.scale.y = 0.95;
		var tw = CK.getTween(this.body.scale);
		// CK.exetw(tw, {y: 1}, 400, Phaser.Easing.Bounce.InOut);
		tw.to({y: 1}, 600, Phaser.Easing.Bounce.InOut, true, 0, -1, false);
	}

	/**
	 * 被击中
	 * 1. 播放被击烟雾
	 * 2. 替换小鸡图片
	 * 3. 展示扣血补间动画
	 * 4. 阻止点击事件(jump)
	 * 5. 落地时执行重生逻辑(替换小鸡身体皮肤)
	 */
	p.onAttacked = function () {
		if(!this.life) return;
		this.playOnce(this.fog);
		// 是否处于受伤状态
		this.isHurt = true;
		this.vy = 0.9;
		// 是否阻断触摸
		this.touchEnable = false;
		// 无法被选为攻击目标
		this.attackEnable = false;
		this.life -= 1;
		this.mouth.visible = false;
		this.wing.visible = false;
		this.changeBody('hurt');
		this.showReduce();
	}

	// 保护罩被击中破裂
	p.onHitCover = function () {
		this.cover.visible = false;
		this.cbreak.visible = true;
		var fire = this.cbreak.animations.add('fire');
		fire.play(20, false);
		fire.onComplete.addOnce(()=>{
			this.cbreak.visible = false;
		})
	}

	// 保护罩生效
	p.onCover = function () {
		console.log('小鸡获得保护罩')
		this.cover.visible = true;
		var fire = this.cover.animations.add('fire');
		fire.play(20, false);
	}

	/**死亡*/
	p.dead = function () {
		
	}

	/**展示扣血补间动画*/
	p.showReduce = function () {
		var reduce = CK.getSprite('reduce');
		this.showTip(reduce);
	}

	/**展示buff信息文字*/
	p.showTip = function (tip) {
		this.setCenter(tip);
		this.chick.add(tip);
		tip.y = -this.top - (tip.height >> 1);
		var tw = this.game.add.tween(tip);
		tw.to({alpha: 0}, 80, null, true, 600, 0, false);
		tw.onComplete.add(function () {
			this.chick.removeChild(tip);
		}, this);
	}

	/**替换小鸡图片*/
	p.changeBody = function (name) {
		this.body_group.removeAll();
		var cc = CK.getSprite(name);
		this.setCenter(cc);
		if(!this.index) cc.scale.x = -1;
		this.body_group.add(cc);
	}

	p.onBuff = function () {
		this.playOnce(this.buff);
		var increase = CK.getSprite('b_increace');
		increase.scale.set(0.8);
		increase.y = -30;
		this.showTip(increase);
	}

	p.born = function () {
		this.playOnce(this.reborn);
		this.body_group.removeAll();
		this.body.frame = 3 - this.life;
		this.body_group.add(this.body);
		this.touchEnable = true;
		this.attackEnable = true;
		this.mouth.visible = true;
		this.wing.visible = true;			
	}

	/**重生 */
	p.doReborn = function () {
		// 播放重生烟雾
		this.playOnce(this.reborn, function () {
			if(this.isRobot()) {
				CK.app.netMgr.send(CK.NetMsgID.reborn, null);
			}
		}, this);
		var tw = CK.getTween({});
		CK.exetw(tw, {}, 80);
		tw.onComplete.addOnce(function () {
			if(!!this.life) {
				this.touchEnable = true;
				this.attackEnable = true;
				this.mouth.visible = true;
				this.wing.visible = true;
				if(this.life === 2 && !this.index){
					CK.app.evtMgr.emit({type: CK.EventType.INTER, id: 'evt_showTip'}, null);
				}	
			}
		}, this);
		this.body_group.removeAll();
		if(this.life > 0){
			this.body.frame = 3 - this.life;
			this.body_group.add(this.body);	
		} else {
			this.body = CK.getSprite('dead');
			this.body.anchor.set(0.5, 1);
			this.body.y = this.top - 10;
			if(!this.index) this.body.scale.x = -1;
			this.body_group.add(this.body);
			this.playSad();
			this.unInstallComps();
		}
	}

	p.unInstallComps = function () {
		this.chick.removeAll();
		this.chick.add(this.body_group);
	}

	/**获取指定sprite对象的animation播放器*/
	p.getAnimPlayer = function (sprite, key) {
		var anim = sprite.animations.getAnimation(key);
		if(!anim) {
			anim = sprite.animations.add(key);
		}
		return anim;
	}

	p.playOnce = function (animObj, cb) {
		animObj.visible = true;
		var fire = this.getAnimPlayer(animObj, 'fire');
		fire.onComplete.addOnce(function (sprite, anim) {
			sprite.animations.stop(null, false);
			sprite.visible = false;
			if(!!cb && typeof cb === 'function') {
				cb.call(this);
			}
		}, this);
		fire.play(20, false);
	}

	p._x = function () {
		return this.chick.x;
	}

	p._y = function () {
		return this.chick.y;
	}

	p._w = function () {
		return this.body.width;
	}

	p._h = function () {
		return this.body.height;
	}

	CK.setAccessor(p);

	CK.Chick = Chick;
})()