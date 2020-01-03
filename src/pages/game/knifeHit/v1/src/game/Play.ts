import State from "./State";
import NetMsgId from "./NetMsgId";
import gameCfg from "./Config";
import Knife from "./Knife";
import UserData from "./UserData";
import UserModel from "./UserModel";

/**
 * 游戏界面
 */
export default class Play extends State {
    constructor() {
        super();
        this.hasInitialized = false;
        this.knifes = [];
        this.shootEnable = true;
        this.timeCounter = 30;
        this.isRunning = true;
        this.startTime = 0;
        this.debug = false;
    }

    private hasInitialized: boolean;
    private knifes: Knife[];
    private shootEnable: boolean;
    private userSys: UserData;
    private timeCounter: number;
    private isRunning: boolean;
    private startTime: number;
    private debug: boolean;
    
    private timeHandler: Phaser.TimerEvent;
    private knife_group: Phaser.Group;
    private base: Phaser.Group;
    private wood: Phaser.Image;
    private self_knife: Phaser.Image;
    private rival_knife: Phaser.Image;
    private timerTxt: Phaser.Text;
    private emoji: Phaser.Sprite;
    private wood_grp: Phaser.Group;
    private clickFrame: Phaser.Sprite;
    
    public init(): void {
        console.log('play init');
        this.register();
        this.userSys = GAME.data.getById(0);
        if(this.hasInitialized) {
            this.base.visible = true;
        } else {
            this.base = this.game.add.group();
            this.knife_group = this.game.add.group();
        }
        this.timeCounter = 20;
        this.addItem();
        this.isRunning = true;
        this.shootEnable = true;
        
    }

    public create(): void {
        console.log('play create');
        this.stage.backgroundColor = 0x522B20;
        
        GAME.net.send(NetMsgId.startReq, null);
    }

    public update(): void {
        super.update();
        if(!this.isRunning) return;
        if(this.debug) {
            
            this.wood_grp.rotation += gameCfg.rotationSpeed;
        } else {
            this.wood.rotation += gameCfg.rotationSpeed;

        }
        this.knifes.forEach((knife)=>{
            
            if(!this.debug) {
                knife.update(this.wood);

            }

        });
        
    }

    public shutdown(): void {
        this.base.removeAll();
    }

    private gameOver(): void {
        this.game.time.events.remove(this.timeHandler);
        this.isRunning = false;
    }

    /**
     * 刷新倒计时
     */
    private updateTime(): void {
        this.timeCounter--;
        if(this.timeCounter < 0) {
            this.timeCounter = 0;
            GAME.net.send(NetMsgId.resultReq, null);
        }
        this.timerTxt.text = this.timeCounter.toString();
    }

    private updateScore(dlt: number): void {
        var self_grp= this.base.getByName('self');

        var self_bar = self_grp.getByName('self_bar');
        self_bar.scale.x = 0.57 + dlt * 0.011;

        var slide: Phaser.Graphics = self_grp.getByName('slide');
        slide.x = self_bar.width - 2;
        
        var desc: Phaser.Text = self_grp.getByName('desc');
        if(dlt > 0) {
            desc.stroke = '#bd2e37';
            desc.text = '领先' + dlt + '针';
        } else if(dlt < 0) {
            desc.stroke = '#2fa2cd';
            desc.text = '落后' + Math.abs(dlt) + '针';
        } else {
            desc.stroke = '#2fa2cd';
            desc.x = self_bar.width;
            desc.text = '旗鼓相当';
        }

        if(!!dlt) {
            if((self_bar.width - 80) > desc.width){
                desc.x = self_bar.width / 2 + 20;
            } else {
                desc.x = 80 + desc.width / 2;
            }
        }
    }

    private updateEmoji(total: number): void {
        this.emoji.frame = 0;
        this.game.time.events.add(200, ()=>{
            if(total <= 10) {
                this.emoji.frame = 1;
            } else if(total <= 20) {
                this.emoji.frame = 2;
            } else {
                this.emoji.frame = 3;
            }
        })
    }

    private addItem(): void {

        var centerx = gameCfg.STAGE_WIDTH >> 1,
            centery = gameCfg.STAGE_HEIGHT >> 1;
        // 添加木桩，心脏，表情
        this.addWoodItem(centerx, centery);
        // 添加已发射飞刀量表
        this.addKnifeCounterItem(centerx, centery);
        // 添加玩家信息UI
        this.addUserInfo(centerx, centery);
        // 添加倒计时标签
        this.addTimeItem(centerx, centery);
        // 初始化缓动飞刀对象
        var knife = this.game.add.image(gameCfg.STAGE_WIDTH >> 1, 900, 'assets', 'knife_0.png');
        knife.anchor.set(0.5), knife.visible = false;
        this.self_knife = knife;
        this.rival_knife = this.game.add.image(gameCfg.STAGE_WIDTH >> 1, 900, 'assets', 'knife_1.png');
        this.rival_knife.anchor.set(0.5);
        this.rival_knife.visible = false;

        // 初始化表情精灵
        var emoji = this.game.add.sprite(0, 0, 'emoji');
        emoji.anchor.set(0.5);
        emoji.x = centerx, emoji.y = centery;
        emoji.frame = 1;
        this.emoji = emoji;
        this.base.add(this.emoji);

        // 初始化点击引导精灵
        var click = this.game.add.sprite(centerx, 900, 'click');
        click.anchor.set(0.5);
        click.name = 'click';
        // click.animations.play('fire', 20, true);
        var fire = click.animations.add('fire');
        fire.play(20, true);
        this.base.add(click);
        this.clickFrame = click;
        var guide = this.game.add.image(centerx, 970, 'assets', 'guide.png');
        guide.anchor.set(0.5);
        guide.name = 'guide';
        this.base.add(guide);

    }

    private addUserInfo(centerx: number, centery: number): void {
        var users = [this.userSys.getUserById(this.userSys.self.rivalId), this.userSys.self];

        users.forEach((model: UserModel, index: number)=>{
            var ugrp = this.game.add.group();
            this.base.add(ugrp);
            ugrp.x = !!index ? 100 : 650;
            ugrp.y = 80;
            var snm = !!index ? 'red' : 'blue';

            var bar = this.game.add.image(0, 0, 'assets', 'life_' + snm + '.png');
            bar.anchor.set((1 - index), 0.5);
            bar.y = 20;
            ugrp.add(bar);
            if(index) {
                bar.name = 'self_bar';
                bar.scale.x = (centerx - ugrp.x) / bar.width;
                var slide = this.game.add.graphics(0, 0);
                slide.beginFill(0xffffff, 1);
                slide.drawRect(0, 0, 5, bar.height);
                slide.x = bar.width - 2;
                slide.y = -10;
                slide.endFill();
                slide.name = 'slide';
                ugrp.add(slide);

                var style = {
                    font:"36px Arial", 
                    fill:"#ffffff", 
                    stroke: "#2fa2cd",
                    strokeThickness: 6
                }
                var desc = this.game.add.text(bar.width, -5, '旗鼓相当', style);
                desc.anchor.x = 0.5;
                desc.name = 'desc';
                ugrp.add(desc);
                ugrp.name = 'self';
            } else {
                bar.scale.x = 1.05;
                ugrp.name = 'rival';
            }

            var stroke = this.game.add.image(0, 0, 'assets', 'stroke_avator_' + snm + '.png');
            stroke.anchor.set(0.5);
            ugrp.add(stroke);

            var avator;
            if(this.cache.checkImageKey(model.id)) {

                avator = this.game.add.sprite(0, 0, model.id);
            } else {
                avator = this.game.add.sprite(0, 0, this.userSys.selfId);
            }
            avator.anchor.set(0.5);
            avator.scale.set(110 / avator.width);
            var mask = this.game.add.graphics(0, 0);
            mask.beginFill(0xffffff, 1);
            mask.drawCircle(0, 0, avator.width);
            mask.endFill();
            avator.mask = mask;
            ugrp.add(avator);
            ugrp.add(mask);

            var str = GAME.tool.substr(model.name, 8);
            var uNm = this.game.add.text(0,0, str, {font: '24px Arial', fill: '#ffffff'});
            uNm.anchor.set((1 - index), 0.5);
            uNm.x = !!index ? 100 : -100;
            uNm.y = -27;
            ugrp.add(uNm);

            if(!!model.sex) {
                var sex = this.game.add.image(0, 0, 'preload', 'sex_' + model.sex + '.png');
                sex.anchor.set(0.5);
                sex.x = !!index ? 80 : -80;
                sex.y = -30
                ugrp.add(sex);
            }
        })
    }

    /**添加飞刀计数量表 */
    private addKnifeCounterItem(centerx: number, centery: number): void {
        var count_group = this.game.add.group();
        count_group.name = 'count';
        [count_group.x, count_group.y] = [0, 1120];
        var mask = this.game.add.graphics(0, 0, count_group);
        mask.beginFill(0xffffff, 1);
        mask.drawRect(100, -20, 500, 100);
        mask.endFill();
        count_group.mask = mask;
        this.base.add(count_group);
        var bar = this.game.add.image(100, 0, 'assets', 'slide.png');
        count_group.add(bar);
        for(var i = 0; i < 6; i++){
            var index: string = (i + 1).toString();
            var grp = this.game.add.group(count_group, index, true);
            var num = this.game.add.image(0, 5, 'assets', 'circle_red.png');
            num.anchor.set(0.5, 1);
            grp.add(num);
            var txt = this.game.add.text(0, 0, index, {font: '32px Arial', fill:'#ff0000'});
            txt.anchor.set(0.5, 1), txt.y = 5;
            txt.name = 'text';
            grp.add(txt);
            [grp.x, grp.y] = [centerx - i * 70, 50];
            if(!i) grp.scale.set(1.2);
            count_group.add(grp);
        }
    }

    private addWoodScale(wood: Phaser.Image): void {
        for(var i = 0; i < 12; i++) {
            var angle = (30 * i);
            var rotation = (angle / 360) * Math.PI * 2;
            var txt = this.game.add.text(0, 0, angle.toString(), {font: "20px Arial"});
            txt.x = wood.x + wood.width / 2 * Math.sin(rotation);
            txt.y = wood.y - wood.width / 2 * Math.cos(rotation);
            this.base.add(txt);
            txt.rotation = rotation;
            txt.anchor.set(0.5);

            var txt1 = this.game.add.text(0, 0, angle.toString(), {font: "20px Arial"});
            txt1.x = (wood.width / 2 - 50) * Math.sin(rotation);
            txt1.y = - (wood.width / 2 - 50) * Math.cos(rotation);
            this.wood.addChild(txt1);
            txt1.rotation = rotation;
            txt1.anchor.set(0.5);
        }
    }

    /**添加旋转木桩 */
    private addWoodItem(centerx: number, centery: number): void {
        var wood: Phaser.Image = this.game.add.image(centerx, centery, 'assets', 'wood.png');
        wood.anchor.set(0.5), wood.name = 'wood';
        this.wood = wood;
        this.base.add(wood);
        if(this.debug){
            this.addWoodScale(wood);
        }
        this.base.add(this.knife_group);

        var heart: Phaser.Image = this.game.add.image(centerx, centery, 'assets', 'heart.png');
        heart.anchor.set(0.5);
        this.base.add(heart);
    }

    /**添加倒计时标签 */
    private addTimeItem(centerx: number, centery: number): void {
        var timeCir = this.game.add.image(centerx, 200, 'assets', 'circle_white.png');
        timeCir.anchor.set(0.5);
        this.base.add(timeCir);
        var style = {
            font: '48px Arial',
            fill: '#ffffff'
        }
        var timeTxt = this.game.add.text(centerx, 204, this.timeCounter.toString(), style);
        timeTxt.anchor.set(0.5),
        this.timerTxt = timeTxt;
        this.base.add(timeTxt);
    }

    /**注册事件监听 */
    private register(): void {
        GAME.event.on(NetMsgId.startRsp, this.onStart, this);
        GAME.event.on(NetMsgId.shootRsp, this.onShoot, this);
        GAME.event.on(NetMsgId.hitRsp, this.onHit, this);
        GAME.event.on(NetMsgId.resultRsp, this.onResult, this);
        GAME.event.on(NetMsgId.decideRsp, this.onDecided, this);
        GAME.event.on(NetMsgId.leaveRsp, this.rivalLeaves, this);

        GAME.event.on(NetMsgId.matchAgain, this.reMatch, this);
        GAME.event.on(NetMsgId.playAgree, this.rePlay, this);
    }

    /**
     * 来自结果页弹层的事件，需要重新转到匹配页面
     */
    private reMatch(): void {
        console.log('play on rematch');
        GAME.event.send(GAME.EventType.INTER, NetMsgId.hideResultByGame, null);
        this.state.start('Match');
    }

    /**
     * 当自己是被邀请者时，若接收请求则直接重开即可
     */
    private rePlay(): void {
        console.log('play on replay');
        this.state.start('Play');
    }

    private onStart(data: any): void {
        console.log('on start');
        this.startTime = data.time;
        this.timeHandler = this.game.time.events.loop(1000, ()=>{
            // 时间倒计时
            this.updateTime();
            GAME.net.send(NetMsgId.heartReq, null);
        });
        GAME.net.send(NetMsgId.heartReq, null);

        this.input.onUp.add(()=>{
            if(!!this.clickFrame) {
                this.clickFrame.animations.stop();
                this.base.remove(this.clickFrame);
                this.clickFrame.destroy();
                this.clickFrame = null;
                var guide = this.base.getByName('guide');
                this.base.remove(guide);
            }
            if(!this.shootEnable) {
                return;
            }
            this.shootEnable = false;
            GAME.net.send(NetMsgId.shootReq, null);
        })
    }

    /**
     * 玩家操作的话，逻辑流程如下：
     * 1. 点击
     * 2. 通知服务器广播
     * 3. 接收到飞刀发射广播，发射飞刀
     * 4. 飞刀到达指定位置后，请求服务器验证
     * 5. 接收服务器验证结果，如果通过6， 否则7
     * 6. 允许再次点击，向木桩插入飞刀，得分
     * 7. 失败
     */

    /**
     * 流程3
     */
    private onShoot(data: any): void {
        if(!this.isRunning) {
            return;
        }
        var uid: string = data.usk;
        var tar: Phaser.Image = this.rival_knife;
        var tarY: number;
        if(this.userSys.isSelfId(uid)) {
            tar = this.self_knife;
            tar.y = 950;
            tarY = this.wood.y + this.wood.height / 2;
            if(this.debug){
                tarY = this.wood_grp.y + this.wood.height / 2;
            }
        } else {
            tar.y = 200;
            tar.scale.y = -1;
            tarY = this.wood.y - this.wood.height / 2;
            if(this.debug){
                tarY = this.wood_grp.y - this.wood.height / 2;
            }
            // return;
        }
        tar.visible = true; 
        var tw = this.game.add.tween(tar);
        tw.to({y: tarY}, 100, null, true, 0, 0, false);

        tw.onComplete.addOnce(()=>{
            // 流程4
            var rotation: number = this.wood.rotation;
            // debug
            if(this.debug) {
                rotation = this.wood_grp.rotation;
            }
            var scale = ((rotation % (2 * Math.PI)) / Math.PI) * 180;
            if(this.userSys.isSelfId(uid)) {
                if(scale <= 180) {
                    scale = 180 - scale;
                } else {
                    scale = 540 - scale;
                }
            } else {
                scale = 360 - scale;
            }

            GAME.net.send(NetMsgId.hitReq, {
                p: scale, 
                knifeId: data.knifeId, 
                usk: data.usk, 
                rota: rotation
            });

        });
        if(!this.userSys.isSelfId(data.usk)) {
            return;
        }
        // 飞刀计数量表动画
        var count_group: Phaser.Group = this.base.getByName('count');
        var nums = count_group.children;
        var centx = gameCfg.STAGE_WIDTH >> 1;
        nums.forEach((grp: Phaser.Group, idx: number)=>{
            if(!grp.name) { return; }
            var idx: number = parseInt(grp.name);
            if(idx == data.knifeId) {
                grp.scale.set(1);
                grp.name = data.knifeId + 6;
                grp.x = centx - 5 * 70;
                var txt = grp.getByName('text');
                txt.text = grp.name;
                return;
            }
            if(idx == data.knifeId + 1) {
                var st = this.game.add.tween(grp.scale);
                st.to({x: 1.5, y: 1.5}, 50, null, true, 0, 0, false);
            }
            var tw = this.game.add.tween(grp);
            tw.to({x: centx - (idx - data.knifeId - 1) * 70}, 50, null, true, 0, 0, false);
        })
    }

    private onHit(data: any): void {
        // 流程6
        if(!!data.code) { // 得分
            this.self_knife.visible = this.rival_knife.visible = false;
            this.sound.play('hit', 0.7, false);
            var resName = 'knife_',
                dlt_score = 0;
            if(this.userSys.isSelfId(data.usk)) {
                resName += '0.png';
                this.self_knife.visible = false;
                this.self_knife.y = 950;
                this.shootEnable = true;
                
                dlt_score = data.score - data.otherScore;
            } else {
                resName += '1.png';
                this.rival_knife.visible = false;
                this.rival_knife.y = 950;
                dlt_score = data.otherScore - data.score;
            }
            // 考虑到网络延迟，这里需要服务器传回弧度值
            var dltRota: number = this.wood.rotation - data.rota;
            if(this.debug) {
                dltRota = this.wood_grp.rotation - data.rota;
            }
            if(!this.userSys.isSelfId(data.usk)){
                dltRota -= Math.PI;
            }
            var knife = new Knife(data.usk, data.kn1);
            var tar = {
                x: this.wood.x,
                y: this.wood.y,
                width: this.wood.width,
                p: data.p
            };
            var parent = this.knife_group;
            // debug
            if(this.debug){

                parent = this.wood_grp;
                dltRota -= Math.PI / 2;
            }
            knife.onAdd(this.game, tar, parent, resName, dltRota);
            this.knifes.push(knife);
            this.updateScore(dlt_score);
            this.updateEmoji(data.score + data.otherScore);

        }
        // 流程7 
        else { // 碰到其他飞刀
            var rotaKnife;// = this.rival_knife;
            this.gameOver();
            var tarR;
            
            if(this.userSys.isSelfId(data.usk)) {
                rotaKnife = this.self_knife;
                this.rival_knife.visible = false;
                tarR = 6;
            } else {
                rotaKnife = this.rival_knife;
                this.self_knife.visible = false;
                tarR = 20;
            }
            rotaKnife.visible = true;
            var tw = this.game.add.tween(rotaKnife);
            var tary = gameCfg.STAGE_HEIGHT + rotaKnife.height;
            
            tw.to({rotation: tarR, y: tary + 400}, 1000, null, true, 0, 0, false);
            tw.onComplete.addOnce(()=>{
                GAME.net.send(NetMsgId.resultReq, null);
            })

        }
    }

    private onResult(data: any): void {
        console.log('game result.');
        var left = 20 - Math.floor((data.time - this.startTime) / 1000);
        if(left < 0) left = 0;
        this.timerTxt.text = left.toString();
        this.gameOver();

        var ret: string = 'lost';
        if(this.userSys.isSelfId(data.winner)) {
            ret = 'win';
        } else if(!data.winner) {
            ret = 'draw';
        }
        if(this.cache.checkSoundKey(ret)) {
            this.sound.play(ret, 0.7, false);
        }
        GAME.event.send(GAME.EventType.INTER, NetMsgId.showResultByGame, {result: ret, word: data.resultCode});
        if(data.resultCode === gameCfg.ResultCode.FleeWin) {
            console.log('result flee leaves');
            this.rivalLeaves();
        }
    }

    /**
     * 只有自己发起‘再来一局’的请求时，才会收到此响应，若自己是被请求者，则根据选择直接进入匹配或者重开状态
     * @param data 
     */
    private onDecided(data: any): void {
        console.log('again request decide: %s', data.code);
        if(data.code) {//同意
            GAME.event.send(GAME.EventType.INTER, NetMsgId.hideResultByGame, null);
            this.state.start('Play');
        } else {
            console.log('decide: leaves');
            this.rivalLeaves();
            // GAME.event.send(GAME.EventType.INTER, NetMsgId.showLeaveByGame, null);
        }
    }

    private rivalLeaves(): void {
        console.log('rival leaves');
        this.userSys.remove(this.userSys.self.rivalId);
        this.userSys.self.rivalId = '';
    }

}