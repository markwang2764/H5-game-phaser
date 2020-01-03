import BaseState from "../../../core/ts/BaseState";
import UserData from "./UserData";
import MessageId from "./Message";
import Logger from "./Logger";
import LevelBlock from "./LevelBlock";
import { DataSystemType } from "./Enums";
import gcf from "./Config";

/**
 * 游戏开始界面，由于游戏多入口，此界面不可做全局依赖
 */
export default class Start extends BaseState {
    constructor(){
        super();
    }

    /**游戏起始页面基本UI显示容器 */
    private base: Phaser.Group;
    /**关卡选择面板显示容器 */
    private lvSlt_group: Phaser.Group;
    /**开始按钮 */
    private start_btn: Phaser.Image;

    /**
     * 对此界面状态变量进行初始化
     */
    public init(): void {
        GAME.event.on(MessageId.start, this.onSelected, this);
        this.base = this.add.group();
        this.lvSlt_group = this.add.group();
    }

    public create(): void {
        
        var extra = GAME.tool.paramWrapper(["page_share_source", "share_way"]);
        var temp = GAME.tool.searchToJson(window.location.search);
        GAME.tool.assign(extra, temp);
        GAME.embed.embedExport(GAME.tool.append2Embed("loading_game_click", extra));
        this.setBaseUI();
        this.setLevelSltUI();
        this.sound.play("bgm", 2, true);
    }

    public update(): void {
        super.update();
    }

    public shutdown(): void {
        this.lvSlt_group.destroy();
        this.base.destroy();
        this.sound.removeByKey('bgm');
    }

    private setBaseUI(): void {
        var base  = this.base;
        var centx:number = this.world.centerX;
            // centy:number = this.world.centerY;
        base.create(0,0, 'start_bg');
        var title: Phaser.Image = base.create(centx, 302, 'assets', 'title.png');

        title.anchor.set(0.5);
        var ttw = this.add.tween(title);
        var oy = title.y;
        ttw.to({x: centx - 5, y: oy + 5}, 50, null, true, 200, 0, false);
        ttw.onComplete.addOnce((sp: Phaser.Sprite)=>{
            var tw2 = this.add.tween(title);
            tw2.to({x: centx + 5, y: oy - 5}, 50, null, true, 0, 0, false);
            tw2.onComplete.addOnce(()=>{
                var tw3 = this.add.tween(title);
                tw3.to({x: centx, y: oy}, 50, null, true, 0, 0, false);
            });
        });
        var board: Phaser.Image = base.create(centx - 60, 482, 'assets', 'title_board.png');

        board.anchor.set(0.5);
        board.scale.y = 0;
        var btw = this.add.tween(board.scale);
        btw.to({y: 1}, 30, null, true, 250, 0, false);
        btw.onStart.addOnce(()=>{
            this.sound.play("board_drop", gcf.VOLUME, false);
        })

        var ranky: number = gcf.HEIGHT > 1400 ? 1150: 1050
        var rank: Phaser.Image = base.create(centx, ranky, 'assets', 'rank_icon.png');
        rank.anchor.set(0.5);
        rank.inputEnabled = true;
        rank.events.onInputUp.add(()=>{
            var sbtw = this.add.tween(rank.scale);
            sbtw.to({x: 1, y: 1}, 80, null, true, 0, 0, false);
            GAME.event.send(GAME.EventType.INTER, MessageId.showRank, 4);
        });
        rank.events.onInputDown.add(()=>{
            var sbtw = this.add.tween(rank.scale);
            sbtw.to({x: 0.9, y: 0.9}, 80, null, true, 0, 0, false);
        });
        var start: Phaser.Image = base.create(centx, 850, 'assets', 'start_btn.png');
        start.anchor.set(0.5);
        start.scale.set(0.25);
        this.start_btn = start;
        var stw = this.add.tween(start.scale);
        stw.to({x: .9, y: .9}, 100, Phaser.Easing.Back.Out, true, 380, 0, false);
        stw.onComplete.addOnce(()=>{
            this.btnBreath(start);
        });
        stw.onStart.add((sp: any)=>{
            this.start_btn.visible = true;
            this.sound.play("start_btn_show", gcf.VOLUME, false);
        })
        start.inputEnabled = true;
        start.events.onInputUp.add(()=>{
            this.showLevelSlt();
        });
        var up = base.create(centx + 130, 700 , 'assets', 'flash_up.png');
        this.flashBreath(up);
        var down = base.create(centx - 220, 920, 'assets', "flash_down.png");
        this.flashBreath(down);
        var bb = this.add.graphics();
        bb.beginFill(0x000000, 0.7);
        bb.drawRect(0, 0, gcf.WIDTH, gcf.HEIGHT);
        bb.endFill();
        bb.name = 'bb';
        bb.visible = false;
        bb.inputEnabled = true;
        bb.events.onInputDown.add(()=>{
            this.hideLevelSlt();
        });
        this.base.add(bb);
    }

    private flashBreath(flash: Phaser.Image): void {
        var tw1 = this.add.tween(flash);
        tw1.to({alpha: 0}, 800, null, true, 400, 0, false);
        tw1.onComplete.addOnce(()=>{
            var tw2 = this.add.tween(flash);
            tw2.to({alpha: 1}, 800, null, true, 0, 0, false);
            tw2.onComplete.addOnce(()=>{
                this.flashBreath(flash);
            })
        })
    }

    private btnBreath(btn: Phaser.Image): void {
        var tw1 = this.add.tween(btn.scale);
        tw1.to({x: 1, y: 1}, 200, null, true, 500, 0, false);
        tw1.onComplete.addOnce(()=>{
            var tw2 = this.add.tween(btn.scale);
            tw2.to({x: .9, y: .9}, 200, null, true, 0, 0, false);
            tw2.onComplete.addOnce(()=>{
                this.btnBreath(btn);
            })
        })
    }

    private setLevelSltUI(): void {
        var centx: number = this.world.centerX;
        var lsgrp = this.lvSlt_group;
        lsgrp.create(0, 0, 'assets', 'level_slt_bg.png');
        // var title = lsgrp.create(centx, 15, 'assets', 'level_slt_title.png');
        // title.anchor.set(0.5, 0);
        var title = this.add.text(centx + 30, 50, '选关挑战', {font:"50px Arial", fill:"#ffffff"});
        title.anchor.set(0.5), lsgrp.add(title);
        var close: Phaser.Image = lsgrp.create(this.game.width - 35, 25, 'assets', 'close_btn.png');
        close.anchor.set(0.5, 0);
        close.inputEnabled = true;
        close.events.onInputUp.add(()=>{
            Logger.log("关闭关卡选择面板");
            this.hideLevelSlt();
        });
        var tip = this.add.text(0, 0, '提示：以最快的手速从小到大点击数字', {font: "28px Arial", fill: "#ffffff"});
        tip.anchor.set(0.5), tip.x = centx, tip.y = 150;
        lsgrp.add(tip);
        var sys: UserData = GAME.data.getById(DataSystemType.USER);
        var lv = sys.self.level;
        for(var i = 0; i < 7; i++){
            var lb = new LevelBlock(i + 3);
            var lbx = 0,
                lby = 0,
                lock = true;
            if(i < lv) {
                lock = false;
            }
            if(i < 3) {
                lbx = 219 + 156 * i;
                lby = 280;
            } else {
                lbx = 141 + 156 * (i - 3);
                lby = 450;
            }
            lb.onAdd({game: this.game, parent: lsgrp, x: lbx, y: lby, lock: lock});
        }
        lsgrp.y = gcf.HEIGHT;
    }

    private showLevelSlt(): void {
        var bb = this.base.getByName('bb');
        bb.visible = true;
        var tw = this.add.tween(this.lvSlt_group);
        tw.to({y: gcf.HEIGHT - 567}, 100, null, true, 0, 0, false);
        GAME.embed.embedExport(GAME.tool.append2Embed("select_type_click", GAME.tool.paramWrapper('')));
    }

    private hideLevelSlt(): void {
        
        var tw = this.add.tween(this.lvSlt_group);
        tw.to({y: gcf.HEIGHT}, 100, null, true, 0, 0, false);
        tw.onComplete.addOnce(()=>{
            var bb = this.base.getByName('bb');
            bb.visible = false;
        });
    }

    private onSelected(): void {
        if(this.state.current === 'Start') {
            this.state.start('Play');
        }
    }
}