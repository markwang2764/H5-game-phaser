import { DataSystemType } from "./Enums";
import MessageId from "./Message";
import UserData from "./UserData";

/**
 * @author zoney
 * @desc 关卡选择方块
 */
export default class LevelBlock {
    constructor(lvId: number) {
        this.levelId = lvId;
    }

    private levelId: number;
    private base: Phaser.Group;

    public destroy(): void {
        this.base.destroy();
        this.base = null;
        this.levelId = null;
    }

    public onAdd(config: LBconfig): void {
        var base = config.game.add.group();
        config.parent.add(base);
        [base.x, base.y] = [config.x, config.y];
        // 添加方块背景
        var block = base.create(0, 0, 'assets', 'level_slt.png');
        block.anchor.set(0.5);
        block.inputEnabled = true;
        block.events.onInputUp.addOnce(this.onTap, this);
        base.add(block);
        // 添加文本
        var degree = config.game.add.text(0, 0, '', {font: "32px Arial", fill: "#945B2C"});
        if(this.levelId <= 5) degree.text = '简单';
        else if(this.levelId <= 7) degree.text = '普通';
        else degree.text = '困难';
        degree.anchor.set(0.5);
        base.add(degree);
        degree.y = -30;
        // var label = config.game.add.text(0, 0, '', {font: "50px Arial", fill: "#945B2C"});
        var label = config.game.add.bitmapText(0, 0, 'w_num', '', 50);
        label.text = this.levelId + 'X' + this.levelId;
        label.tint = 0x945B2C;
        label.anchor.set(0.5), label.y = 5;
        base.add(label);
        // 添加锁定状态
        if(config.lock){
            var gra = config.game.add.graphics(0, 0);
            gra.beginFill(0x000000, 0.3);
            gra.drawRoundedRect(-block.width/2, -block.height/2, block.width, block.height, 10);
            gra.endFill();
            gra.inputEnabled = true;
            gra.events.onInputUp.add(()=>{
                // TODO
                GAME.event.send(GAME.EventType.INTER, MessageId.showTip, "先玩简单点的吧~");
            });
            base.add(gra);
            var lock = base.create(0, 0, 'assets', 'lock.png');
            lock.anchor.set(0.5);
            base.add(lock);
        }
        this.base = base;
    }

    public onTap(): void {
        var sys: UserData = GAME.data.getById(DataSystemType.USER);
        sys.curLevelId = this.levelId - 2;
        Global.enterPlaySource = 1;
        GAME.event.send(GAME.EventType.INTER, MessageId.start, null);
    }

    
}

interface LBconfig {
    game: Phaser.Game;
    parent: Phaser.Group;
    x: number;
    y: number;
    lock: boolean;
}