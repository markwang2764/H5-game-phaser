import State from "./State";
import gameCfg from "./Config";
import UserModel from "./UserModel";
import UserData from "./UserData";
import NetMsgId from './NetMsgId'

/**
 * 玩家匹配界面
 */
export default class Match extends State {
    constructor() {
        super();
        this.counter = 0;
        this.points = ['', '.', '..', '...'];
        this.assetsLoaded = false;
        this.netClosed = false;
        this.loaderPoints = [];
        this.headLoadCount = 0;
        this.loadCounter = 0;
    }

    private points: string[];
    private userSys: UserData;
    private counter: number;
    private loadCounter: number;
    private assetsLoaded: boolean;
    private netClosed: boolean;
    private loaderPoints: any[];
    // 玩家头像可能会有加载失败的情况，此时需要重试几次
    private headLoadCount: number;

    private base: Phaser.Group;
    private match: Phaser.Group;
    private loader: Phaser.Group;
    private matchingText: Phaser.Text;
    private matchHandler: Phaser.TimerEvent;
    private loaderHandler: Phaser.TimerEvent;
    private headLoader: Phaser.Loader;

    public init(): void {

        this.headLoadCount = 0;
        this.counter = 0;
        this.loadCounter = 0;
        
        this.base = this.game.add.group();
        var bg = this.add.sprite(0,  0, 'mbg', 0, this.base);
        this.loader = this.game.add.group();
        this.match = this.game.add.group();
        this.base.add(this.loader);
        this.base.add(this.match);
        this.loader.visible = false;

        this.userSys = GAME.data.getById(0);

        GAME.embed.embedExport(GAME.embed.data.img_matching_expose_exposure);
        this.doMatch();
        GAME.event.once(NetMsgId.matchRsp, this.onMatched, this);
		GAME.event.once(NetMsgId.netClose, this.onNetClosed, this);
        GAME.net.send(NetMsgId.matchReq, null);
        this.matchHandler = this.game.time.events.loop(1000, this.timer, this);
    }

    public shutdown(): void {
        this.loader.removeAll();
        this.match.removeAll();
        this.base.destroy();
    }

    public preload(): void {
        this.load.crossOrigin = 'anonymous';
    }
    public create(): void {
        this.load.onLoadComplete.removeAll();
        this.load.onLoadComplete.addOnce(()=>{
            this.assetsLoaded = true;
        })
        this.load.atlasXML('assets', gameCfg.ASSET_HOTS + 'assets1.png', gameCfg.ASSET_HOTS + 'assets.xml');
        this.load.audio('hit', gameCfg.ASSET_HOTS + 'hit.mp3');
        this.load.audio('win', gameCfg.ASSET_HOTS + 'win.mp3');
        this.load.audio('lost', gameCfg.ASSET_HOTS + 'lost.mp3');
        this.load.spritesheet('emoji', gameCfg.ASSET_HOTS + 'emoji_sheet.png', 368, 368, 4);
        this.load.spritesheet('click', gameCfg.ASSET_HOTS + 'click1.png', 100, 100, 14);
        this.load.start();
    }

    private onMatched(data: any): void {
        console.log('on matched: ', data);
        GAME.embed.embedExport(GAME.embed.data.img_matched_expose_exposure);
        data = data.b;
        this.userSys.self.rivalId = data.usk;
        data.rivalId = this.userSys.selfId;
        this.userSys.add(data);

        this.game.time.events.remove(this.matchHandler);
        if(this.cache.checkImageKey(data.usk)) {
            this.onMatchFire();
            return;
        }
        this.headLoader = new Phaser.Loader(this.game);
        this.headLoader.crossOrigin = 'anonymous';
        this.tryLoadAvator(data.usk);
    }

    private tryLoadAvator(uid: string): void {
        
        
        this.headLoader.onLoadComplete.removeAll();
        this.headLoader.onLoadComplete.addOnce(()=>{
            if(this.headLoadCount >= 3 || this.cache.checkImageKey(uid)) {
                this.onMatchFire();
            } else {
                this.headLoadCount++;
                this.tryLoadAvator(uid);
            }
        });
        var head_url = GAME.tool.wxHeadUrlFix(this.userSys.getUserById(uid).avator);
        this.headLoader.image(uid, head_url);
        this.headLoader.start();
    }

    private onMatchFire(): void {
        var rival_group = this.match.getByName('rival');
        rival_group.alpha = 0;
		rival_group.x = this.game.width >> 1;
		rival_group.y = this.game.height >> 1;
		this.addPlayer(rival_group, this.userSys.getUserById(this.userSys.self.rivalId));
		var vs = this.game.add.image(0, 0, 'preload', 'vs.png');
		vs.y = 300;
		vs.anchor.set(0.5);
		rival_group.add(vs);

        var rivalTw = this.game.add.tween(rival_group);
        rivalTw.to({y: 350, alpha: 1}, 200, null, true, 0, 0, false);

        var self_group = this.match.getByName('self');
        var selfTw = this.game.add.tween(self_group);
        selfTw.to({y: 900}, 200, null, true, 0, 0, false);

        var matchTw = this.game.add.tween(this.matchingText);
        matchTw.to({alpha: 0, y: 300}, 100, null, true, 0, 0, false);

		matchTw.onComplete.addOnce(()=>{
			this.matchingText.text = "匹配成功";

			var readyText = this.game.make.text(0, 0, "准备开始", { font: "bold 24px Arial", fill: "#83390f" });
			readyText.anchor.set(0.5);
			readyText.x = this.game.width >> 1;
			readyText.y = 160;
			this.base.add(readyText);

            var matw = this.game.add.tween(this.matchingText);
            matw.to({alpha: 1, y: 100}, 100, null, true, 0, 0, false);		

			matw.onComplete.addOnce(()=>{
                this.game.time.events.add(1000, ()=>{
                    if(this.netClosed) return;
                    if(this.assetsLoaded) {
                        this.state.start('Play');
                    } else {
                        this.turnToLoading();
                    }
                })
			});
		});
    }

    private onNetClosed(): void {
        this.netClosed = true;
    }

    public update(): void {
        super.update();
    }
    private timer(): void {
        this.counter++;
        this.matchingText.text = "匹配中" + this.points[this.counter % 4];
    }

    private doMatch(): void {

        var matchingText = this.make.text( 0, 0, "匹配中", { font: "bold 48px Arial", fill: "#83390f" });
		matchingText.anchor.set(0.5);
        matchingText.x = gameCfg.STAGE_WIDTH >> 1;
        matchingText.y = (gameCfg.STAGE_HEIGHT >> 1) - 240;
        matchingText.name = 'matching';
        this.matchingText = matchingText;
        this.match.add(matchingText);

        var self_group = this.game.make.group();
        self_group.name = 'self';
		self_group.x = this.game.width >> 1;
        self_group.y = (this.game.height >> 1) - 60;
        this.match.add(self_group);
        
        var rival_group = this.game.make.group();
        rival_group.name = 'rival';
        this.match.add(rival_group);


		this.addPlayer(self_group, this.userSys.self);
        this.addTips(self_group);
    }

    private addPlayer(group: Phaser.Group, user: UserModel): void {
        // 添加头像
        var cc;
        if(this.cache.checkImageKey(user.id)) {
            cc = this.game.make.image(0, 0, user.id);
        } else {
            cc = this.game.make.image(0, 0, this.userSys.selfId);
        }
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
		var name = this.game.add.text(0, 0, '', { font: "bold 32px Arial", fill: "#83390f" });
		name.anchor.set(0.5);
		name.y = lableY + 40;
		var str = user.name;
		if(user.name.length > 10){
			str = user.name.substr(0, 10) + '..';
		}
        name.text = str;
        name.name = 'name';
		group.add(name);

		if(!!user.sex) {
			var sex = this.game.make.image(0, 0, 'preload','sex_' + user.sex + '.png');
			sex.anchor.set(0.5);
			sex.x = -(name.width / 2) - 10;
			sex.y = lableY + 35;
			name.x = sex.x + (sex.width / 2 + name.width / 2) + 5;
			group.add(sex);
		}
    }

    private addTips(grp: Phaser.Group): void {
        var tips = [
			"点击屏幕开始扎心",
            "相同时间内扎得更多的人获胜喔",
            "一颗心最多被扎40针，拼手速的时候来啦",
            "扎的时候不要碰到小球哦~"
        ];
        var tip = this.game.add.text(0, 0, "小贴士：" + tips[Math.floor(Math.random() * tips.length)], { font: "26px Arial", fill: "#83390f" });
        tip.anchor.set(0.5);
        var name = grp.getByName('name');
        tip.y = name.y + 60;
        grp.add(tip);
    }

    private turnToLoading(): void {
        this.match.visible = false;
        this.loader.visible = true;

        var bgC = this.game.add.graphics(0, 0);
		bgC.beginFill(0x000000, 0.35);
		bgC.drawRect(0, 0, this.game.width, this.game.height);
		bgC.endFill();
        this.loader.add(bgC);

        var skin_group = this.game.add.group();
        skin_group.name = 'loader';
        this.loader.add(skin_group);
        [skin_group.x, skin_group.y] = [this.game.width >> 1, this.game.height >> 1];

		var body = this.add.image(0, 0, 'preload', 'loader_body.png');
		body.anchor.set(0.5);
		skin_group.add(body);

		for(var i = 0; i < 3; i++) {
			var cc: any = this.add.image(0, 0, 'preload', 'loader_point.png');
			cc.anchor.set(0.5);
			cc['__idx'] = i;
			cc.y = -55;
			cc.x = -30 + i * 30;
            skin_group.add(cc);
			this.loaderPoints.push(cc);
		}
        this.shake();
        this.loaderHandler = this.game.time.events.loop(700, this.setPoint, this);
    }

    private shake(): void {
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

    private setPoint(): void {
        if(this.assetsLoaded) {
            this.game.time.events.remove(this.loaderHandler);
            this.state.start('Play');
            return;
        }
        var show = this.loadCounter % 4;
        this.loadCounter++;
		this.loaderPoints.forEach(function (c, idx) {
			if(idx < show){
				c.visible = true;
			} else {
				c.visible = false;
			}
		})
    }

    
}