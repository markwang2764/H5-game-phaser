import Rect from "./Rect";
import DoubleClick from "./DoubleClick";

export default class SelectFrame extends Phaser.Sprite{

    public selectedView:Phaser.Sprite|Phaser.BitmapText;
    private line:Phaser.Graphics;
    private leftTop:Rect;
    private rightTop:Rect;
    private leftBottom:Rect;
    private rightBottom:Rect;

    constructor(game:Phaser.Game, x:number, y:number){
        super(game, x, y);

        this.leftTop = new Rect(game, 0, 0);
        this.rightTop = new Rect(game, 0, 0);
        this.leftBottom = new Rect(game, 0, 0);
        this.rightBottom = new Rect(game, 0, 0);

        this.line = this.game.make.graphics(0, 0);
        this.addChild(this.line);

        var ary:Array<Rect> = [this.leftTop, this.rightTop, this.leftBottom, this.rightBottom];
        ary.forEach(function(rect:Rect) {
            rect.anchor.setTo(0.5, 0.5);
            rect.render(10, 10, 0x446600);
            this.addChild(rect);
        }, this);

        this.rightBottom.inputEnabled = true;
        this.rightBottom.events.onInputOver.add(function(view:Phaser.Sprite) {
            this.rightBottom.render(10, 10, 0xff0000);
        }, this);
        this.rightBottom.events.onInputOut.add(function(view:Phaser.Sprite) {
            this.rightBottom.render(10, 10, 0x446600);
        }, this);

        this.rightBottom.input.draggable = true;
        this.rightBottom.events.onDragUpdate.add(function(view:Phaser.Sprite) {
            var width = this.rightBottom.x - this.leftBottom.x;
            var height = this.rightBottom.y - this.leftTop.y;
            this.selectedView.width = width;
            this.selectedView.height = height;
            this.render();
        }, this);
    }

    public select(view:Phaser.Sprite|Phaser.BitmapText){
        this.selectedView = view;
        this.visible = true;
        this.render();
    }

    public hide(){
        this.visible = false;
    }

    public render(){
        this.updateLine();
        this.updateRect();
    }

    private updateLine(){
        this.line.clear();
        this.line.lineStyle(1, 0xff8800);
        this.line.beginFill(0xffffff, 0.1);
        this.line.drawRect(0, 0, this.selectedView.width, this.selectedView.height);
        this.line.endFill();
    }

    private updateRect(){
        this.leftTop.x = 0;
        this.leftTop.y = 0;

        this.rightTop.x = this.selectedView.width;
        this.rightTop.y = 0;

        this.leftBottom.x = 0;
        this.leftBottom.y = this.selectedView.height;

        this.rightBottom.x = this.selectedView.width;
        this.rightBottom.y = this.selectedView.height;
    }

}