import BaseState from "../../../core/ts/BaseState";
import UserData from "./UserData";
import { DataSystemType } from "./Enums";
import UserModel from "./UserModel";
import gcf from "./Config";
import MessageId from "./Message";

/**
 * @author zoney 2018年07月24日19:29:53
 * @desc pk结果展示界面
 */
export default class Pkresult extends BaseState {
    constructor() {
        super();
    }

    private base: Phaser.Group;
    private self: Phaser.Group;
    private rival: Phaser.Group;
    private userSys: UserData;

    public create(): void {
        this.base = this.add.group();
        this.self = this.add.group();
        this.rival = this.add.group();
        GAME.event.on(MessageId.playAgain, this.onAgain, this);
        GAME.event.on(MessageId.returnStart, this.reStart, this);
        this.userSys = GAME.data.getById(DataSystemType.USER);
        this.setUI();
        var retArr = ['lost', 'win'];
        this.sound.play(retArr[this.userSys.pkRet], gcf.VOLUME, false);
        var extra:any = GAME.tool.paramWrapper('');
        extra.challenge_result = !!this.userSys.pkRet ? 1:2;
        GAME.embed.embedExport(GAME.tool.append2Embed("pk_result_click", extra));
    }

    private onAgain(): void {
        if(this.state.current !== 'Pkresult') return;
        this.state.start('Play');
    }

    private reStart(): void {
        if(this.state.current !== 'Pkresult') return;
        this.state.start('Start');
    }

    public shutdown(): void {
        this.base.destroy();
        this.base = null;
        this.self.destroy();
        this.self = null;
        this.rival.destroy();
        this.rival = null;
        this.userSys = null;
        // GAME.event.remove(MessageId.playAgain, this.onAgain);
    }

    private setUI(): void {
        var centx: number = this.world.centerX,
            base = this.base,
            ret = this.userSys.pkRet,
            lvBase = this.userSys.levelBase;
        base.create(0, 0, 'pk_bg');
        var titleArr = ['lost', 'win']
        var title: Phaser.Image = base.create(centx, 200, 'assets', 'title_' + titleArr[ret] + '.png');
        title.anchor.set(0.5);
        this.alphaScale(title);

        var label_grp = this.add.group();
        label_grp.create(0, 0, 'assets', 'ret_lv_label.png');
        var level = this.add.bitmapText(180, 0, 'w_num', lvBase + 'X' + lvBase, 48);
        label_grp.add(level);
        label_grp.x = centx - 130, label_grp.y = 350;
        base.add(label_grp);
        this.alphaScale(label_grp);

        this.base.add(this.self), this.base.add(this.rival);

        var btnArr = ['again', 'share'];
        var btn: Phaser.Image = base.create(centx, 840, 'assets', btnArr[ret] + '_btn.png');
        btn.anchor.set(0.5);
        btn.scale.set(0.25);
        btn.inputEnabled = true;
        btn.events.onInputDown.add(()=>{
            var sbtw = this.add.tween(btn.scale);
            sbtw.to({x: 0.9, y: 0.9}, 80, null, true, 0, 0, false);
        });
        btn.events.onInputUp.add(()=>{
            if(this.userSys.pkRet) {
                var context:any = window;
                GAME.event.send(GAME.EventType.UI, MessageId.showShare, {tip: "哇，仅用了" + context.changeTime(this.userSys.self.time) + "就完成了游戏分享给好友，PK谁的手速更快吧", entry:4, layer: 2});
            } else {
                Global.enterPlaySource = 2;
                this.state.start('Play');
            }
        });

        var btw = this.add.tween(btn.scale);
        btw.to({x: 1, y: 1}, 60, Phaser.Easing.Bounce.Out, true, 330, 0, false);

        var close: Phaser.Image = base.create(centx, 980, 'assets', 'giveup.png');
        close.anchor.set(0.5);
        close.scale.set(0.25);
        close.inputEnabled = true;
        close.events.onInputUp.add(()=>{
            var self = this.userSys.self;
            GAME.event.send(GAME.EventType.UI, MessageId.POP_RESULT, {
                "bestScore": self.best,
                "currentScore": self.time,
                "global": self.global,
                "rank": self.rank,
                bonus: self.bonus,
                prevail: self.rank,
            });
        })

        var ctw = this.add.tween(close.scale);
        ctw.to({x: 1, y: 1}, 60, Phaser.Easing.Bounce.Out, true, 390, 0, false);

        var rateArr = [-1, 1];
        this.addPlayer(this.self, this.userSys.self, 480 - 10 * rateArr[ret]);
        this.addPlayer(this.rival, this.userSys.rival, 480 + 10 * rateArr[ret]);

        var sprite: Phaser.Sprite = base.create(centx, 590, 'light');
        sprite.anchor.set(0.5);
        var fire = sprite.animations.add('fire');
        this.time.events.add(50, ()=>{
            fire.play(20, false);
        });
        fire.onComplete.addOnce(()=>{
            sprite.visible = false;
        });

        var line: Phaser.Image = base.create(centx, 600, 'assets', 'light_line.png');
        line.anchor.set(0.5);
        line.visible = false;
        this.time.events.add(230, ()=>{
            line.visible = true;
        });
    }

    private alphaScale(tar: PIXI.DisplayObjectContainer): void {
        tar.alpha = 0.5;
        tar.scale.set(2, 2);
        var tatw = this.add.tween(tar);
        tatw.to({alpha: 1}, 80, null, true, 0, 0, false);
        var tstw = this.add.tween(tar.scale);
        tstw.to({x: 1, y: 1}, 80, null, true, 0, 0, false);
    }

    private addPlayer(group: Phaser.Group, user: UserModel, y: number): void {
        var rate = 1,
            ret = this.userSys.pkRet;
        // 添加头像
        var gra = this.add.graphics();
        gra.beginFill(0xff0000, 0.5);
        gra.drawCircle(0, 0, 130);
        gra.endFill();
        var avator_grp = this.add.group();
        var avator: Phaser.Image = avator_grp.create(0, 0, user.id);
        // var avator: Phaser.Image = avator_grp.create(0, 0, 'assets', 'emoji_bubble.png');
        avator.anchor.set(0.5);
        avator.scale.set(130 / avator.width);
        avator.mask = gra;
        avator_grp.add(gra);

        // 添加昵称和成绩
        var str = GAME.tool.substr(user.name, 16);
        var name = this.add.text(0, 0, str, {font:"24px Arial", fill: "#ffffff"});
        name.anchor.set(0.5);
        name.y = 180;
        var time = GAME.tool.msTos(user.time);
        var score = this.add.bitmapText(0, 0, 'w_num', time, 50);
        score.anchor.set(0.5), score.y = 70;
        
        // 添加表情气泡
        var bubble_grp = this.add.group();
        // var bubble: Phaser.Image = bubble_grp.create(0, 0, 'assets', 'emoji_bubble.png');
        var bubble = this.add.image(0, 0, 'assets', 'emoji_bubble.png');
        bubble.anchor.set(0.5);
        bubble_grp.y = 10;
        bubble_grp.add(bubble);

        var tarX: number = 0;
        if(!ret){
            tarX = 5;
        }
        var retArr = ['lost', 'win'];
        var emojix = 5;
        if(user.id === this.userSys.selfId) {
            group.create(0, 0, "assets", 'ret_my.png');
            [avator_grp.x, avator_grp.y] = [284, 82];
            name.x = 283;
            group.x = gcf.WIDTH;
            tarX = 357;
            if(!ret){
                tarX = 352;
            }
            rate = -1;
            score.x = 130;
            bubble_grp.x = 200;
            bubble.scale.set(1.1);
        } else {
            group.create(0, 0, "assets", 'ret_rival.png');
            [avator_grp.x, avator_grp.y] = [111, 82];
            name.x = 107;
            score.x = 260;
            score.text = GAME.tool.msTos(user.best);
            group.x = - 400;
            bubble.scale.x = -1;
            bubble_grp.x = 190;
            retArr = ['win', 'lost'];
            // bubble.scale.set(0.9);
            // bubble_grp.scale.set(0.9);
        }
        var emoji = this.add.image(emojix * rate, 0, 'assets', 'emoji_' + retArr[ret] + '.png');
        emoji.anchor.set(0.5);
        if(user.id === this.userSys.selfId) {
            emoji.scale.set(1.1);
        }
        bubble_grp.add(emoji);
        group.add(avator_grp);
        group.add(name);
        group.add(score);
        group.add(bubble_grp);
        group.y = y;
        var tw = this.add.tween(group);
        tw.to({x: tarX}, 100, null, true, 130, 0, false);
        tw.onComplete.addOnce(()=>{
            var tw1 = this.add.tween(group);
            tw1.to({x: tarX - rate * 20}, 30, null, true, 0, 0, false);
            tw1.onComplete.addOnce(()=>{
                var tw2 = this.add.tween(group);
                tw2.to({x: tarX}, 30, null, true, 0, 0, false);
            })
        })
    }

    public update(): void {
        super.update();
    }
}