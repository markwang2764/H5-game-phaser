export default class Rect extends Phaser.Sprite{

    constructor(game:Phaser.Game, x:number, y:number){
        super(game, x, y);
    }

    public render(width:number, height:number, color:number = 0x999999){
        var graphics = this.game.make.graphics(0, 0);
        graphics.beginFill(color);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
        
        var view = new Phaser.RenderTexture(this.game, width, height);
        view.render(graphics);
        this.setTexture(view);
    }

}