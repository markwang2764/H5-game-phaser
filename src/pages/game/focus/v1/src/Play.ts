import BaseState from "../../../core/ts/BaseState";
import Block from "./Block";
import UserData from "./UserData";
import Logger from "./Logger";
import { DataSystemType, EnterType, GameMode, PkResult } from "./Enums";
import gcf from "./Config";
import MessageId from "./Message";


/**
 * @author zoney 2018年07月20日11:44:34
 * @desc 
 */
export default class Play extends BaseState {
    constructor(){
        super();
        this.max = 0;
        this.blurTime = 0;
    }

    private pressedBlock: Block;
    private userSys: UserData;
    private base: Phaser.Group;
    private max: number;
    private timeLabel: Phaser.BitmapText;
    private timeCounter: number;
    private running: boolean;
    private readyLabel: Phaser.BitmapText;
    private blurTime: number;

    public init(): void {
        this.timeCounter = 0;
        this.blurTime = 0;
        this.running = false;
        this.pressedBlock = new Block(0, this);
        this.base = this.add.group();
        this.userSys = GAME.data.getById(DataSystemType.USER);
        GAME.event.send(GAME.EventType.INTER, MessageId.hideMoney, null);
        GAME.event.on(MessageId.playAgain, this.onAgain, this);
        GAME.event.on(MessageId.returnStart, this.reStart, this);
        GAME.event.on(MessageId.onBlur, this.onBlur, this);
        GAME.event.on(MessageId.onBlur, this.onFocus, this);
    }

    public preload(): void {
        var rival = this.userSys.rival;
        if(!rival) return;
        if(this.cache.checkImageKey(rival.id)) {
            return;
        }
        if(rival && rival.avator) {
            var head = GAME.tool.wxHeadUrlFix(rival.avator);
            if(!!head) {
                var loader = new Phaser.Loader(this.game);
                loader.image(rival.id, head);
                loader.onLoadComplete.removeAll();
                loader.start();
            }
        }
    }

    public create(): void {
        // Logger.log(this.state.current);
        var bg = this.base.create(0, 0, 'play_bg');
        this.base.add(bg);
        var base = this.base;
        var label = this.add.bitmapText(this.world.centerX, 100, 'w_num', "0''00", 50);
        label.anchor.set(0.5);
        base.add(label);
        this.timeLabel = label;
        var radix = this.userSys.levelBase;
        var tips = this.add.text(this.world.centerX, 0, '以最快的速度从1选到' + Math.pow(radix, 2), {
            font: "30px Arial",
            fill: "#3C61AC"
        });
        tips.anchor.set(0.5);
        tips.y = 230;
        base.add(tips);
        this.setReadyUI();
        var extra:any = GAME.tool.paramWrapper('');
        extra.Checkpoint_type = this.userSys.curLevelId;
        extra.enter_game_source = Global.enterPlaySource;
        GAME.embed.embedExport(GAME.tool.append2Embed("enter_game_click", extra));
    }

    private setReadyUI(): void {
        var centx: number = this.world.centerX,
            centy: number = this.world.centerY;
        var bg = this.add.graphics();
        bg.beginFill(0x000000, 0.7), bg.drawRect(0, 0, this.stage.width, this.stage.height), bg.endFill();
        this.base.add(bg);
        this.readyLabel = this.add.bitmapText(centx, centy, 'r_num', '', 60);
        this.readyLabel.anchor.set(0.5);
        this.readyLabel.visible = false;
        var countdown: Phaser.Image = this.base.create(centx, centy-90, 'cd_label');
        countdown.anchor.set(0.5);

        var readyArr = ['', '3', '2', '1'];
        this.sound.play('countdown', gcf.VOLUME, false);
        this.readyLabel.text = readyArr.shift();
        var handler = this.time.events.loop(1000, ()=>{
            if(countdown.visible) {
                countdown.visible = false;
                this.readyLabel.visible = true;
            }
            if(!readyArr.length) {
                this.time.events.remove(handler);
                this.readyLabel.text = "";
                this.base.removeChild(countdown);
                this.base.removeChild(bg);
                GAME.tool.hpGet('/youtui/extreme/startGame', {
                    "gameId": CFG.gameId,	
                    "checkPointType": this.userSys.curLevelId,
                    "mode": Global.gameMode
                }, (data: any)=>{
                    this.onStart(data);
                });
            } else {
                var label: string = readyArr.shift();
                if(label == '1') {
                    this.sound.play('ready', gcf.VOLUME, false);
                }else {
                    this.sound.play('countdown', gcf.VOLUME, false);
                }
                this.readyLabel.text = label;
            }
        })
    }

    private onStart(data: any): void {
        if(data.success) {
            this.running = true;
            this.createBlocks();
        } else {
            Logger.warn('游戏开始失败，可能是关卡校验失败');
        }
    }

    private onAgain(): void {
        if(this.state.current !== 'Play') return;
        this.state.start('Play');
    }

    private reStart(): void {
        if(this.state.current !== 'Play') return;
        this.state.start('Start');
    }

    private onBlur(time: number): void {
        if(this.running){
            this.blurTime = time;
        }
    }

    private onFocus(): void {
        var dlt: number = Date.now() - this.blurTime;
        Logger.log('经过时间：%s', dlt);
        this.updateTime(dlt);
    }

    public update(): void {
        super.update();
        this.updateTime(16.7);
    }

    private updateTime(time: number): void {
        if(!this.running) return;
        this.timeCounter += time;
        this.timeLabel.text = GAME.tool.msTos(this.timeCounter);
    }

    public shutdown(): void {
        this.pressedBlock.destroy();
        this.pressedBlock = null;
        this.userSys = null;
        this.running = false;
        this.timeLabel.destroy();
        this.timeLabel = null;
        this.readyLabel.destroy();
        this.readyLabel = null;
        this.base.destroy();
        this.base = null;
        // GAME.event.remove(MessageId.playAgain, this.onAgain);
    }

    private createBlocks(): void {
        var base = this.userSys.levelBase;
        var seeds = [],
            max = Math.pow(base, 2);
        this.max = max;
        for(var i = 1; i <= max; i++) {
            seeds.push(i);
        } 
        var scaleArr = [0, 1.45, 1.1, 0.9, 0.75, 0.66, 0.57, 0.5];
        var logArr = [];
        var end = seeds.length - 1;
        for(var j = 0; j < seeds.length; j++) {
            var idx = Math.floor(Math.random()*(end + 1));
            logArr.push(seeds[idx]);
            var value: number = seeds[idx];
            seeds[idx] = seeds[end];
            seeds[end] = value;
            end--;
            var block = new Block(value, this);
            block.onAdd(this.game, this.base, scaleArr[base - 2]);
            block.x = (gcf.PLAY_HSLIDE + block.width/2) + j % base * (gcf.PLAY_WIDTH - gcf.PLAY_HSLIDE * 2 - block.width) / (base - 1);
            block.y = 300 + gcf.PLAY_VSLIDE + block.height/2 + Math.floor(j/base) * (gcf.PLAY_HEIGHT - gcf.PLAY_VSLIDE * 2 - block.height) / (base - 1);
        }
        Logger.log(logArr.toString());
    }

    public next(block: Block): void {
        if(this.pressedBlock.id !== (block.id - 1)) {
            // 播放点击错误音效
            this.camera.shake(0.01, 200);
            this.sound.play('click_invalid', gcf.VOLUME, false);
            return;
        }
        this.pressedBlock = block;
        block.onPressed();
        this.sound.play("click_valid", gcf.VOLUME, false);
        // 如果是最后一个气泡，需要结束游戏
        if(block.id >= this.max){
            this.onOver();
        }
    }

    private onOver(): void {
        this.running = false;
        var stage:any = window;
        stage.curLevelId = this.userSys.curLevelId;
        
        GAME.tool.hpGet('/youtui/extreme/completeGame', {
            "gameId": CFG.gameId,
            "checkPointType": this.userSys.curLevelId,
            "usedTime": Math.floor(this.timeCounter),
            "sessionKey": this.userSys.selfId,
            "mode": Global.gameMode,
            enterGameSource: CFG.enterGameSource
        }, (rsp: any)=>{
            // 根据结果判定跳转pkresult还是普通结果页
            // 如果是pk需要设置datasys中的pk胜负结果
            var data = rsp.data;
            if(Global.gameMode === GameMode.PK) {
                var self = this.userSys.self,
                    rival = this.userSys.rival;
                if(rival.best > Math.floor(this.timeCounter)) {
                    this.userSys.pkRet = PkResult.WIN;
                } else {
                    this.userSys.pkRet = PkResult.LOST;
                }
                self.time = this.timeCounter;
                self.best = data.bestScore;
                self.rank = data.prevail;
                self.global = data.rank;
                self.bonus = data.bonus;
                this.state.start('Pkresult');
            } else if(Global.gameMode === GameMode.LEVEL){
                if(!!data.checkPointType) {
                    this.userSys.self.level = parseInt(data.checkPointType);
                }
                data.global = data.rank;
                GAME.event.send(GAME.EventType.INTER, MessageId.POP_RESULT, data);
                this.sound.play('win', gcf.VOLUME, false);
            }
        });
        // $.get('/extreme/completeGame', {
            // "gameId": GAME.tool.getParamUrl("id"),
            // "checkPointType": this.userSys.curLevelId,
            // "usedTime": this.timeCounter,
            // "sessionKey": this.userSys.selfId,
            // "shareWay": "",
            // "pageShareSource": "",
            // "sourceShareId": "",
            // "appKey": "",
            // "slotId": "",
            // "appId": "",
        // }, (data)=>{
            
        // });
    }

}