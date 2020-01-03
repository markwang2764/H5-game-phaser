/** 匹配界面控制器 */
var CK = CK || {};

(function () {
  var Match = function () {
    this.timer = 0;	
    this.textTimer = 0;
    this.textCounter = 0;
    this.arr = ['', '.', '..', '...'];
    this.isCounting = true;
    this.isClosed = false;
  };

  var p = Match.prototype;

  p.preload = function () {
    this.isCounting = true;
    this.isClosed = false;
  },

  p.create = function () {
    console.log('user id before: ', Object.keys(CK.data.userDict));
    CK.data.removeUserById(CK.data.self.rivalId);
    console.log('user id after: ', Object.keys(CK.data.userDict));

    embedExport(embedData.img_matching_expose_exposure);

    this.base = this.game.add.group();
    var bg = CK.getSprite('mbg');
    this.base.add(bg);

    this.self_group = CK.getGroup(0, 0);
    this.self_group.x = this.game.width >> 1;
    this.self_group.y = (this.game.height >> 1) - 60;
    this.rival_group = CK.getGroup(0, 0);
    this.base.add(this.self_group);
    this.base.add(this.rival_group);

    this.matchingText = this.game.make.text(0, 0, '匹配中', { font: 'bold 32px Arial', fill: '#83390f' });
    this.matchingText.anchor.set(0.5);
    this.matchingText.x = this.game.width >> 1;
    this.matchingText.y = (this.game.height >> 1) - 240;
    this.matchingText.scale.set(1.5);
    this.base.add(this.matchingText);

    this.addPlayer(this.self_group, CK.data.self);
    if (this.hasMatched) return;
    CK.app.evtMgr.on(CK.NetMsgID.matchRsp, this.onMatched, this);
    CK.app.evtMgr.on('evt_netclose', this.onclose, this);
    CK.app.netMgr.send(CK.NetMsgID.match, null);
    // this.state.start('Fight');

    // var tw = CK.getTween({});
    // CK.exetw(tw, {}, 1000);
    // tw.onComplete.addOnce(function () {
    // 	CK.app.netMgr.socket.close();
    // })
  };

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

    this.closeText = this.game.make.text(0, 0, '网络不稳定，小主请再试试？', { font: 'bold 32px Arial', fill: '#ffffff' });
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
  };

  p.addPlayer = function (group, user) {
    // 添加头像
    var cc = CK.getSprite(user.id);
    cc.anchor.set(0.5);
    cc.scale.set(260 / cc.width);

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
    var name = this.game.make.text(0, 0, '', { font: 'bold 32px Arial', fill: '#83390f' });
    name.anchor.set(0.5);
    name.y = lableY + 40;
    var str = user.name;
    if (user.name.length > 10) {
      str = user.name.substr(0, 10) + '..';
    }
    name.text = str;
    group.add(name);

    if (user.sex) {
      var sex = CK.getSprite('sex_' + user.sex);
      sex.anchor.set(0.5);
      sex.x = -(name.width / 2) - 10;
      sex.y = lableY + 35;
      name.x = sex.x + (sex.width / 2 + name.width / 2) + 5;
      group.add(sex);
    }

    var tips = [
      '小鸡飞行过程中会自动发射炮弹',
      '吃到道具后，下一发炮弹就会多一枚',
      '被攻击后，点击屏幕就能快速飞起',
      '占领高位更有优势',
      '点击小鸡就能飞起来喔',
      '躲避对方的炮弹避免被击中'
    ];

    if (user.id === CK.data.selfId) {
      var tip = this.game.make.text(0, 0, '小贴士：' + tips[Math.floor(Math.random() * 6)], { font: '26px Arial', fill: '#83390f' });
      tip.anchor.set(0.5);
      tip.y = name.y + 60;
      group.add(tip);
    }
  };

  p.onMatched = function (data) {
    CK.app.evtMgr.remove(CK.NetMsgID.matchRsp, this.onMatched);
    embedExport(embedData.img_matched_expose_exposure);
    data = data.b;
    this.isCounting = false;
		
    CK.data.self.rivalId = data.usk;
    CK.data.addUser({
      userId: data.usk, 
      nickName: data.nickName, 
      rivalId: CK.data.self.id, 
      sex: data.sex,
      headUrl: data.headUrl
    });
    this.rivalId = data.usk;
    var tmp = CK.getSprite(data.usk);
    if (!!tmp && tmp.key === data.usk) {
      this.loadComplete();
      return;
    }
    this.load.image(data.usk, data.headUrl);
    this.load.onLoadComplete.removeAll();
    this.game.load.onLoadComplete.add(this.loadComplete, this);
    this.game.load.onFileError.add(function (e) {
      console.log(e);
    });
    	this.load.start();
  };

  p.loadComplete = function () {
    console.log('load complete');
    this.rival_group.alpha = 0;
    this.rival_group.x = this.game.width >> 1;
    this.rival_group.y = this.game.height >> 1;
    this.addPlayer(this.rival_group, CK.data.getUserById(this.rivalId));
    var vs = CK.getSprite('vs');
    vs.y = 300;
    vs.anchor.set(0.5);
    this.rival_group.add(vs);

    var rivalTw = CK.getTween(this.rival_group);
    CK.exetw(rivalTw, {y: 350, alpha: 1}, 200);

    var selfTw = CK.getTween(this.self_group);
    CK.exetw(selfTw, {y: 900}, 200);

    var matchTw = CK.getTween(this.matchingText);
    CK.exetw(matchTw, {alpha: 0, y: 300}, 100);

    matchTw.onComplete.add(function () {
      this.matchingText.text = '匹配成功';

      this.readyText = this.game.make.text(0, 0, '准备开始', { font: 'bold 16px Arial', fill: '#83390f' });
      this.readyText.anchor.set(0.5);
      this.readyText.x = this.game.width >> 1;
      this.readyText.y = 160;
      this.readyText.scale.set(1.5);
      this.base.add(this.readyText);

      var matw = CK.getTween(this.matchingText);			
      CK.exetw(matw, {alpha: 1, y: 100}, 100);
      matw.onComplete.add(function () {
        var tt = CK.getTween({});
        CK.exetw(tt, {}, 1000);
        tt.onComplete.add(function () {
          if (this.isClosed) return;
          this.state.start('Fight');
        }, this);
      }, this);
    }, this);
  };

  p.update = function (game) {
    var dlt = game.time.elapsed;
    CK.app.update(game);
    if (!this.isCounting) return;
    if (this.textTimer >= 1000) {
      this.textCounter++;
      this.textTimer = 0;
      this.matchingText.text = '匹配中' + this.arr[this.textCounter % 4];
    } else {
      this.textTimer += dlt;
    }
  };

  CK.Match = Match;
})();
