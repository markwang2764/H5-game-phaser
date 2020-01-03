import gameCfg from "./Config";

/**
 * 飞刀对象
 */
export default class Knife {
    constructor(ownerId: string, id: number) {
        // this.game = game;
        // this.tar = target;
        // this.base = parent;
        this._ownerId = ownerId;
        this._id = id;
        // this.resName = name;
    }

    // private game: Phaser.Game;
    // private tar: Phaser.Image;
    // private base: Phaser.Group;

    private _ownerId: string;
    private _id: number;
    // private resName: string;

    private skin: Phaser.Image;

    /**
     * 飞刀所属玩家id
     */
    public get ownerId(): string { return this._ownerId; }
    /**
     * 飞刀id
     */
    public get id(): number { return this._id; }

    public update(tar: Phaser.Image, radian?: number): void {

        this.skin.rotation += gameCfg.rotationSpeed;
        var radians = this.skin.rotation + Math.PI / 2;
        this.skin.x = tar.x + (tar.width / 2) * Math.cos(radians);
        this.skin.y = tar.y + (tar.width / 2) * Math.sin(radians);
    }

    public run(): void {

    }

    public onAdd(game: Phaser.Game, target: any, parent: Phaser.Group, name: string, rotation: number): void {

        this.skin = game.add.image(0, 0, 'assets', name);

        this.skin.x = target.x + (target.width / 2) * Math.cos(rotation);
        this.skin.y = target.y + (target.width / 2) * Math.sin(rotation);
        this.skin.rotation = rotation;

        this.skin.anchor.set(0.5);
        parent.add(this.skin);
        // this.addScale(game, target.p);
    }

    private addScale(game: Phaser.Game, scale: number): void {
        scale = Math.floor(scale);
        var txt = game.add.text(0, 40, scale.toString(), {font: '30px'});
        if(GAME.data.getById(0).selfId === this._ownerId) {
            txt.y = 20;
        }
        txt.anchor.set(0.5);
        this.skin.addChild(txt);
    }
}