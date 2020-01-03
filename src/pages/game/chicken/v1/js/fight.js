var CK = CK || {};

(function () {
  var Fight = function () {
    this.chickDict = {};
    this.bulletDict = {};
    this.fireCounter = 0;
    this.hurtCounter = 0;
    this.items = [];
    this.touchEnable = false;
    this.touchTimer = 0;
    this.isRunning = false;
    this.isFirstGame = true;
  };

  var p = Fight.prototype;

  p.preload = function () {
    this.base = this.game.add.group();
  };

  p.create = function () {
    this.addBackGround();
    this.ui = null;
		
    if (!this.ui) {
      this.ui = new CK.FightUI(this.game, this.base, this);	
    }
    this.ui.create();
    this.showEmoji_group = CK.getGroup(0, 0);
    this.base.add(this.showEmoji_group);
    this.chickDict = {};
    this.loadChicks();
    this.addGuide();// 添加新手引导
    this.addTouchLayer();
    this.addEmoji();
    this.registryListener();
    this.ui.ready();
    console.log(this.base.children.length);

    embedExport(embedData.game_index_exposure);
  };

  p.addGuide = function () {
    this.guide_group = CK.getGroup(this.game.width >> 1, 780);
    var guide = CK.getSprite('guide');
    guide.anchor.set(0.5);
    this.guide_group.add(guide);
		
    var clickMc = CK.getSprite('click');
    clickMc.anchor.set(0.5);
    clickMc.x = 0, clickMc.y = 80;
    var fire = clickMc.animations.add('fire1');
    fire.play(20, true);
    this.guide_group.add(clickMc);
    this.base.add(this.guide_group);
  };

  p.addEmoji = function () {
    this.emoji_group = CK.getGroup(this.game.width >> 1, 1206);
    this.base.add(this.emoji_group);
    var posArr = [
      [-147, -40], [-49, -40], [49, -40], [147, -40]
    ];
    for (var i = 0; i < 4; i++) {
      var cc = CK.getSprite('emoji_' + (i + 1));
      cc.anchor.set(0.5);
      [cc.x, cc.y] = posArr[i];
      cc.inputEnabled = true;
      cc['__touch_id'] = i;
    		cc.events.onInputDown.add(function (e) {
    			CK.app.netMgr.send(CK.NetMsgID.emoji, {id: e['__touch_id']});
    		}, this);
    		this.emoji_group.add(cc);
    }
  };

  p.onEmoji = function (data) {
    // console.log('on emoji', data);
    var cc = CK.getSprite('emoji_' + (data.id + 1));
    // console.log(data.id, data.usk);
    cc.anchor.set(0.5);
    cc.scale.set(0.8);
    var sender = this.chickDict[data.usk];
    var rate = [1, -1][sender.index];
    [cc.x, cc.y] = [100 + sender.index * 580, 100];
    this.showEmoji_group.add(cc);
    var tw = CK.getTween(cc);
    var sx = cc.x, sy = cc.y + 100;
    var floats = Math.floor(Math.random() * 100);
    CK.exetw(tw, {x: sx + floats * rate, y: sy + floats}, 300);
    var ta = CK.getTween(cc);
    ta.to({alpha: 0}, 100, null, true, 600, 0, false);
    ta.onComplete.addOnce(function () {
      this.showEmoji_group.remove(cc);
    }, this);
  };

  /** 注册网络响应消息监听 */
  p.registryListener = function () {
    var evt = CK.app.evtMgr;
    evt.on(CK.NetMsgID.clickRsp, this.onTouch, this);
    evt.on(CK.NetMsgID.shootRsp, this.onShoot, this);
    evt.on(CK.NetMsgID.bulletPropRsp, this.onItemShow, this);
    evt.on(CK.NetMsgID.hitBulletPropRsp, this.onItemHit, this);
    evt.on(CK.NetMsgID.hitPlayerRsp, this.onChickHit, this);
		
    evt.on(CK.NetMsgID.win, this.onWin, this);
    evt.on(CK.NetMsgID.lose, this.onLost, this);
    evt.on(CK.NetMsgID.draw, this.onDraw, this);
    evt.on(CK.NetMsgID.start, this.onStart, this);
    evt.on(CK.NetMsgID.agreeRsp, this.onAgree, this);
    evt.on(CK.NetMsgID.playAgainRsp, this.onAgain, this);
    evt.on(CK.NetMsgID.emojiRsp, this.onEmoji, this);
    evt.on(CK.NetMsgID.leaveRsp, this.onLeave, this);
    evt.on('evt_again', this.againReq, this);
    evt.on('evt_restart', this.reMatch, this);
    evt.on('evt_agree', this.agree, this);
    evt.on('evt_netclose', this.onclose, this);

    evt.on('evt_showTip', this.showTip, this);
  };

  p.unRegistry = function () {
    var evt = CK.app.evtMgr;
    evt.remove(CK.NetMsgID.clickRsp, this.onTouch);
    evt.remove(CK.NetMsgID.shootRsp, this.onShoot);
    evt.remove(CK.NetMsgID.bulletPropRsp, this.onItemShow);
    evt.remove(CK.NetMsgID.hitBulletPropRsp, this.onItemHit);
    evt.remove(CK.NetMsgID.hitPlayerRsp, this.onChickHit);
    evt.remove(CK.NetMsgID.win, this.onWin);
    evt.remove(CK.NetMsgID.lose, this.onLost);
    evt.remove(CK.NetMsgID.draw, this.onDraw);
    evt.remove(CK.NetMsgID.start, this.onStart);
    // evt.remove(CK.NetMsgID.emojiRsp, this.onEmoji);
  };

  p.onclose = function () {
    CK.app.evtMgr.remove('evt_netclose', this.onclose);
    window.showResultByGame('lost');
  };

  p.showTip = function () {
    if (!this.isFirstGame) return;
    this.isFirstGame = false;
    CK.app.evtMgr.remove('evt_showTip', this.showTip);

    this.tip = CK.getSprite('tip');
    this.tip.anchor.set(0.5);
    [this.tip.x, this.tip.y] = [this.game.width >> 1, 800];

    this.clickMc = CK.getSprite('click');
    this.clickMc.anchor.set(0.5);
    this.clickMc.x = this.game.width >> 1, this.clickMc.y = 900;
    var fire = this.clickMc.animations.add('fire');
    fire.play(20, true);
    this.base.add(this.tip);
    this.base.add(this.clickMc);
  };

  // 结果弹层同意再战请求
  p.agree = function () {
    CK.app.netMgr.send(CK.NetMsgID.agree, null);
    CK.app.evtMgr.remove('evt_agree', this.agree);
  };

  // 收到对手玩家再战请求
  p.onAgain = function () {
    this.overRsp = CK.NetMsgID.playAgainRsp;
    // window.showInviteByGame();
    CK.app.evtMgr.remove(CK.NetMsgID.playAgainRsp, this.onAgain);
  };

  // 自己或对手同意再战响应
  p.onAgree = function () {
    window.hideResultByGame();
    CK.app.evtMgr.remove(CK.NetMsgID.agreeRsp, this.onAgree);
    var tw = CK.getTween({});
    CK.exetw(tw, {}, 200);
    tw.onComplete.addOnce(function () {
      this.state.start('Fight');
    }, this);
  };

  // 自己或对手离开响应
  p.onLeave = function () {
    // 弹层按钮文本变化为： 换个对手，或者离开
    this.overRsp = CK.NetMsgID.leaveRsp;
    // window.showLeaveByGame();
    CK.app.evtMgr.remove(CK.NetMsgID.leaveRsp, this.onLeave);
  };

  // 对手不敢应战或者离开，换个对手重新进入匹配界面
  p.reMatch = function () {
    window.hideResultByGame();
    CK.app.evtMgr.remove('evt_restart', this.reMatch);
    this.state.start('Match');
  };

  p.onStart = function () {
    this.isRunning = true;
    this.touchEnable = true;
    this.ui.onStart();
  };

  p.againReq = function () {
    // this.state.start('Match');
    CK.app.netMgr.send(CK.NetMsgID.playAgain, null);
    CK.app.evtMgr.remove('evt_again', this.againReq);
  };

  p.getBullet = function (oid, id) {
    var arr = this.bulletDict[oid];
    if (!arr) return null;
    var ls = arr.filter(function (val, idx, ar) {
      return val.id === id;
    });
    return ls[0];
  };

  /** 添加背景 */
  p.addBackGround = function () {
    var bg = this.add.sprite(0, 0, 'bg');
    this.base.add(bg);
  };

  /** 载入双方小鸡 */
  p.loadChicks = function () {
    var users = CK.data.getAllUsers();
    users.forEach(function (val, idx) {
      if (idx >= 2) return;
      var index = (val.id === CK.data.selfId) ? 0 : 1;
      var chick = new CK.Chick(this.base, this.game, index, this, val.rivalId);
      this.chickDict[val.id] = chick;
      chick.onAdd();
    }, this);
    // console.log(this.chickDict);
  };

  /** 添加触摸层 */
  p.addTouchLayer = function () {
    var box = this.game.add.graphics();
    box.beginFill(0xffffff, 0);
    box.drawRect(0, 0, this.game.width, this.game.height);
    box.endFill();
    box.inputEnabled = true;
    this.base.add(box);

	    box.events.onInputDown.add(function (e) {
	    	var myChick = this.chickDict[CK.data.selfId];
	    	if (myChick.isHurt) return;// 自己小鸡受伤时不可以发起跳跃请求
	    	if (!this.touchEnable) return;
	    	this.touchEnable = false;
	    	CK.app.netMgr.send(CK.NetMsgID.click, null);
	    	// 新手引导相关
	    	if (!!this.tip && !!this.tip.parent) {
	    		this.tip.parent.remove(this.tip);
	    	}
	    	if (!!this.clickMc && !!this.clickMc.parent) {
	    		this.clickMc.parent.remove(this.clickMc);
	    	}

	    	if (!!this.guide_group && this.guide_group.parent) {
	    		this.guide_group.parent.remove(this.guide_group);
	    	} 
	    }, this);
  };

  p.onWin = function (data) {
    // console.log(data);
    this.updateTime(data && data.time);
    var winner = this.chickDict[CK.data.selfId];
    winner.onWin('evt_showWin');

    var loser = this.chickDict[CK.data.self.rivalId];
    loser.onLost();
    this.over();
  };

  p.updateTime = function (time) {
    if (!!time || time == 0) {
      this.ui.setOverTime(time);
    }
  };

  p.onLost = function (data) {
    // console.log(data);
    this.updateTime(data && data.time);
    var winner = this.chickDict[CK.data.self.rivalId];
    winner.onWin('evt_showLost');

    var loser = this.chickDict[CK.data.selfId];
    loser.onLost();
    // this.ui.onLost();
    this.over();
  };

  p.onDraw = function (data) {
    this.updateTime(data && data.time);
    var tw = CK.getTween({});
    CK.exetw(tw, {}, 2000);
    tw.onComplete.addOnce(function () {
      this.ui.onDraw();
    }, this);
    // 
    this.over();
  };

  p.over = function () {
    this.isRunning = false;
    this.forEach(this.bulletDict, function (arr, key) {
      arr.forEach(function (val, idx) {
        val.boom();
      });
      this.bulletDict[key] = [];
    }, this);
		
    this.bulletDict = {};
    this.fireCounter = 0;
    this.hurtCounter = 0;
    this.items = [];
    this.touchEnable = false;
    this.touchTimer = 0;
    this.isRunning = false;
    this.unRegistry();
  };
  /**
	 * 接收玩家点击响应
	 * data: uid, y
	 */
  p.onTouch = function (data) {
    // data.uid = CK.data.selfId;
    var chick = this.chickDict[data.usk];
    chick.onJump(data.y);
  };

  /** 接收玩家射击响应 */
  p.onShoot = function (data) {
    data = data.bullets[0];
    var id = data.usk;
    var shooter = this.chickDict[id];
    if (shooter.isHurt) return;
    var rival = this.chickDict[shooter.rivalId];
    var rate = [1, -1][shooter.index];
    var arr = this.bulletDict[id];
    if (!arr) {
      arr = [], this.bulletDict[id] = arr;
    }
    var yArr = data.y;
    yArr.forEach(function (val, idx) {
      if (val.y >= 1110) return;
      var bullet = new CK.Bullet(this.game, this.base, shooter.chick.x + 108 * rate, val.y, shooter, val.id, val.bid);
			
      arr.push(bullet);
			
      // 每颗子弹添加对方小鸡到目标列表，
      bullet.addTargets(rival);

      var rivalBulletList = this.bulletDict[shooter.rivalId];
      if (!rivalBulletList) {
        rivalBulletList = [], this.bulletDict[shooter.rivalId] = rivalBulletList;
      }
      rivalBulletList.forEach(function (val, idx) {
        // 对方所有子弹添加这一颗子弹到目标列表
        val.addTargets(bullet);
        // 添加对方所有子弹到目标列表
        bullet.addTargets(val);
      });
      // 道具添加到子弹目标列表
      this.items.forEach(function (item, i) {
        bullet.addTargets(item);
      });
    }, this);
  };

  /** 命中道具，响应 */
  p.onItemHit = function (data) {
    if (data.code) {
      var tar = this.items[0];
      if (!tar) return;
      tar.onHit();
      var src = this.chickDict[data.usk];
      src.onBuff();
    }
    data.yList.forEach(function (val, idx) {
      var bullet = this.getBullet(data.usk, val.id);
      if (!bullet) return;
      if (data.code) {
        bullet.boom();
      } else {
        bullet.onHitRefused();
        // bullet.destroy();
      }
    }, this);
  };

  /** 命中小鸡响应 */
  p.onChickHit = function (data) {
    // console.log(data);
    if (data.code) {
      var src = this.chickDict[data.shooter.usk];
      // src.setHealth(data.shooter.health);
      var tar = this.chickDict[data.shooted.usk];
      // tar.setHealth(data.shooted.health + 1);
      this.ui.setHealth(data.shooted.usk, data.shooted.health);
      tar.onAttacked();
    } else {
      // console.log("", data.shooter.usk, data.yList);
    }
    // console.log("time: %s begin 子弹", data.time);
    // this.forEach(this.bulletDict, function (val, key) {
    // 	console.log("玩家：%s当前子弹列表：", key.substr(0,5), val);
    // }, this);
    // console.log(data.time, data.yList);
    data.yList.forEach(function (val, idx) {
      var bullet = this.getBullet(data.shooter.usk, val.id);
      if (!bullet) {
        bullet = this.getBullet(data.shooted.usk, val.id);
      }
      if (!bullet) {
        // console.log('找不到玩家: %s的子弹: %s', data.shooter.usk.substr(0, 5), val.id);
        return;
      }
      if (data.code) {
        bullet.boom();
      } else {
        bullet.onHitRefused();
        // console.log("%s的子弹%s未命中对手，被执行销毁", data.shooter.usk.substr(0, 5), val.id);
        // bullet.destroy();
      }
    }, this);
    // console.log("time: %s end 子弹", data.time);
  };

  p.onItemShow = function (data) {
    // console.log(data);
    var item = new CK.Item(this.game, this.base, data.y);
    this.items.push(item);
    item.onAdd(this.items);
    this.forEach(this.bulletDict, function (val, key) {
      if (!val) return;
      val.forEach(function (v, i) {
        v.addTargets(item);
      }, this);
    }, this);
  };

  p.update = function (game) {
    CK.app.update(game);
    var dlt = game.time.elapsed;

    this.forEach(this.chickDict, function (val, key) {
      val.update(dlt);
    }, this);
		
    if (!this.isRunning) return;
    this.ui.update(dlt);
    this.updateFire(dlt);

    this.hitTest(dlt);

    this.touchEnableCheck(dlt);
  };

  /** 开火计时 */
  p.updateFire = function (dlt) {
    if (this.fireCounter >= 1400) {
      var shooter = this.chickDict[CK.data.selfId];
      shooter.shoot();
      if (CK.data.robot) {
        var rival = this.chickDict[shooter.rivalId];
        rival.shoot();
      }
      this.fireCounter = 0;
    } else {
      this.fireCounter += dlt;
    }
  };

  /** 子弹碰撞检测跟随 */
  p.hitTest = function (dlt) {
    this.forEach(this.bulletDict, function (bulletList, key) {
      if (!bulletList) return;
			
      var idStr = [];

      var collideList = [];
      bulletList.forEach(function (bullet, i) {
        if (bullet.update(dlt)) {
          // 只有碰撞小鸡和道具的子弹会请求服务器验证
          if (bullet.collideTarget.targetType !== CK.TargetType.Bullet) {
            collideList.push(bullet);
            idStr.push(bullet.id);
          }
          bullet.collide(bullet.collideTarget);
        }
      });
			
      var stamp = new Date().getTime();
			
      idStr = idStr.join(',');

      var excutor = collideList[0];
			
      if (excutor) {
        bulletList.forEach(function (ib, index) {
          if (ib.id !== excutor.id && ib.uuid === excutor.uuid) {
            ib.invalid();
          }
        });
        var tar = excutor.collideTarget;
        switch (tar.targetType) {
          case CK.TargetType.Chick:
            CK.app.netMgr.send(CK.NetMsgID.hitPlayer, {id: idStr, usk: key, time: stamp});
            break;
          case CK.TargetType.Item:
            CK.app.netMgr.send(CK.NetMsgID.hitBulletProp, {id: idStr, usk: key});
            break;
          default: 
            break;
        }
      }
      var narr = bulletList.filter(function (va, id, arr) {
        return !va.isDel;
      });
      this.bulletDict[key] = narr;
    }, this);
  };

  /** 触摸间隔控制 */
  p.touchEnableCheck = function (dlt) {
    if (this.touchTimer >= 400) {
      this.touchEnable = true;
      this.touchTimer = 0;
    } else {
      this.touchTimer += dlt;
    }
  };

  p.forEach = function (obj, cb, thisObj) {
    if (typeof obj !== 'object') {
      throw TypeError('can not loop an target without object type');
    }
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      cb.call(thisObj, obj[i], i);
    }
  };

  CK.Fight = Fight;
})();
