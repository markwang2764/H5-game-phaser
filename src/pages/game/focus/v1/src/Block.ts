import Play from "./Play";

/**
 * @author zoney 2018年07月20日11:52:53
 * @desc 每个可以按动的数字块
 */
export default class Block {
    constructor(id: number, mgr: Play){
        this._id = id;
        this._mgr = mgr;
    }

    private _id: number;
    private _mgr: Play;
    private _base: Phaser.Group;
    private _bubble: Phaser.Sprite;

    public get id():number { return this._id; }
    public get width(): number { return this._base.width; }
    public get height(): number { return this._base.height; }
    public set x(val: number) { this._base.x = val; }
    public set y(val: number) { this._base.y = val; }


    /**
     * destroy
     */
    public destroy() {
        if(!!this._base && !!this._base.parent){
            this._base.parent.removeChild(this._base);
            this._base.destroy();
            this._base = null;
        }
        this._mgr = null;
        this._id = null;
    }

    public onAdd(game: Phaser.Game, parent: Phaser.Group, scale: number, x: number = 0, y: number = 0): void {
        var base = game.add.group();
        parent.add(base);
        this._base = base;
        [base.x, base.y] = [x, y];
        var bubble: Phaser.Sprite = base.create(0, 0, 'bubble');
        bubble.name = 'bubble';
        bubble.anchor.set(0.5);
        bubble.animations.add('fire');
        bubble.scale.set(scale);
        this._bubble = bubble;
        
        bubble.inputEnabled = true;
        bubble.events.onInputUp.add(()=>{
            this._mgr.next(this);
        });

        var label = game.add.bitmapText(0, 0, 'w_num', this._id.toString(), 64);
        label.anchor.set(0.5);
        label.name = 'up', label.scale.set(scale, scale);
        base.add(label);
        var presLabel = game.add.bitmapText(0, 0, 'b_num', this._id.toString(), 64);
        presLabel.visible = false;
        presLabel.name = 'down';
        presLabel.anchor.set(0.5);
        presLabel.scale.set(scale, scale);
        presLabel.y = 50 * scale / 1.45;
        base.add(presLabel);
    }

    /**
     * 气泡被按下时需要播放破裂动画
     */
    public onPressed() {
        var fire = this._bubble.animations.getAnimation('fire');
        fire.play(20, false);
        var up = this._base.getByName('up');
        up.visible = false;
        var down = this._base.getByName('down');
        down.visible = true;
    }

    
}