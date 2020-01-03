import BaseState from "../../../core/ts/BaseState";
import Logger from "./Logger";
import { EnterType, DataSystemType } from "./Enums";
import UserData from "./UserData";
import UserModel from "./UserModel";
import MessageId from "./Message";

/**
 * @author zoney 2018年07月19日19:14:50
 * @desc 游戏资源加载模块
 */
export default class Load extends BaseState {
    constructor() {
        super();
        
    }

    /**加载进度百分比 */
    private progLabel: Phaser.Text;
    /**加载状态提示 */
    private loadLabel: Phaser.Image;
    /**加载时的转圈 */
    private circle: Phaser.Sprite;

    private assetsLoaded: boolean;

    public init(): void {
        var centx: number = this.world.centerX,
            centy: number = this.world.centerY;
        if(!this.progLabel) {
            this.progLabel = this.add.text(centx, (centy - 20), '0%', {font: "30px Arial", fill: "#ffffff"});
            this.progLabel.anchor.set(0.5);
        }
        if(!this.loadLabel) {
            this.loadLabel = this.add.image(centx, (centy + 50), 'preload', 'load_label.png');
            this.loadLabel.anchor.set(0.5);
        }
        this.stage.backgroundColor = "#76c7ff";
        this.assetsLoaded = false;
        GAME.event.once(MessageId.startPk, this.onStartPk, this);
        this.setLoadingAni();
    }

    public create(): void {
        Logger.log("开始加载");
        this.doLoad();
    }

    private doLoad(): void {
        this.load.onFileComplete.add(()=>{
            this.progLabel.text = this.load.progress.toString() + '%';
        });
        this.load.onLoadComplete.removeAll();
        this.load.onLoadComplete.addOnce(()=>{
            Logger.log("加载完毕");
            this.assetsLoaded = true;
            this.toNext();
        })
        var res = this.cache.getJSON('assets').res;
        for(var i = res.length - 1; i >= 0; i--) {
            var rcf = res[i];
			if(rcf.type === 'image') {
                this.load.image(rcf.name, rcf.url);
			} else if(rcf.type === 'spritesheet') {
				this.load.spritesheet(rcf.name, rcf.url, rcf.w, rcf.h, rcf.frame);
			} else if(rcf.type === 'atlasXML') {
                this.load.atlasXML(rcf.name, rcf.pic, rcf.xml);
            } else if(rcf.type === 'bitmapFont') {
                this.load.bitmapFont(rcf.name, rcf.texture, rcf.xml, rcf.atlas, rcf.xs, rcf.ys);
            } else if(rcf.type === 'audio') {
                this.load.audio(rcf.name, rcf.url);
            }
        }
        var sys: UserData = GAME.data.getById(DataSystemType.USER);
        var users = sys.getUsers();
        users.forEach((user: UserModel)=>{
            var head = GAME.tool.wxHeadUrlFix(user.avator);
            if(!!head) {
                this.load.image(user.id, head);
            }
        })
        this.load.start();
    }

    public update(): void {
        super.update();
        this.circle.rotation -= 0.03;
    }

    public shutdown(): void {
        this.progLabel.destroy();
        this.progLabel = null;
        this.loadLabel.destroy();
        this.loadLabel = null;
        this.circle.destroy();
        this.circle = null;
        this.stage.backgroundColor = '#000000';
    }

    private toNext(): void {
        // 判断游戏入口，pk需要跳过start直接进入play
        switch(CFG.enterGameSource) {
            case EnterType.WX:
                if(Global.startPk) {
                    this.toPlay();
                }
                break;
            case EnterType.HB:
            case EnterType.APP:
                this.state.start('Start');
                break;
            default:
                break;
        }
    }

    private toPlay(): void {
        this.state.start('Play');
    }

    private onStartPk(): void {
        Global.startPk = true;
        if(this.assetsLoaded) {
            this.toPlay();
        }
    }

    private setLoadingAni(): void {
        var centx: number = this.world.centerX,
            centy: number = this.world.centerY,
            brainy: number = centy - 200

        var brain = this.add.image(centx, brainy, 'preload', 'brain.png');
        brain.anchor.set(0.5);
        var grp = this.add.group();
        var line = this.add.image(0, 0, 'preload', 'loadline.png');
        var rocket = this.add.image(0, 0, 'preload', 'rocket.png');
        rocket.anchor.set(0.5, 1);
        rocket.x = line.width; rocket.y = rocket.height;
        line.y = rocket.y;
        grp.add(line), grp.add(rocket);
        var render = this.add.renderTexture(line.width + rocket.width/2, line.height + rocket.height, 'circle', true);
        render.render(grp);
        this.circle = this.add.sprite(centx, brainy, render);
        this.circle.anchor.set(line.width/2/this.circle.width, (this.circle.height - 124)/this.circle.height);
        grp.destroy();
    }
}