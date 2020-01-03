import DoubleClick from "./DoubleClick";
import Rect from "./Rect";
import SelectFrame from "./SelectFrame";

export default class Page extends Phaser.Sprite{

    private background:Rect;
    private container:Phaser.Group;
    private selectFrame:SelectFrame;

    constructor(game:Phaser.Game, x:number, y:number, width:number, height:number){
        super(game, x, y);

        var background = new Rect(game, 0, 0);
        background.render(width, height, 0xf4f4f4);
        var view = new Phaser.RenderTexture(this.game, width, height);
        view.render(background);
        this.setTexture(view);

        this.container = game.add.group();
        this.addChild(this.container);
    }

    addView(view:Phaser.Sprite|Phaser.BitmapText){
        view.inputEnabled = true;
        view.input.draggable = true;

        view.events.onDragUpdate.add(function(view:Phaser.Sprite|Phaser.BitmapText){
            this.selectFrame.x = view.x;
            this.selectFrame.y = view.y;
        }, this);

        view.events.onInputDown.add(function(view:Phaser.Sprite){
            if(DoubleClick.isDoubleClick(view)){
                console.log("双击");
            }
            else{
                console.log("单击");
            }
        }, this);

        this.container.add(view);
    }

    deleteView(){
        if(this.selectFrame){
            if(this.selectFrame.selectedView){
                this.selectFrame.selectedView.events.onDragUpdate.removeAll();
                this.selectFrame.selectedView.events.onInputDown.removeAll();
                this.selectFrame.selectedView.destroy(true);
                this.selectFrame.hide();
            }
        }
    }

    init(){
        this.container.onChildInputDown.add(function(view:Phaser.Sprite){
            this.container.setChildIndex(view, this.container.children.length - 1);
            if(!this.selectFrame){
                this.selectFrame = new SelectFrame(this.game, 300, 300);
                this.container.add(this.selectFrame);
            }
            this.container.setChildIndex(this.selectFrame, this.container.children.length - 1);
            this.selectFrame.select(view);
        }, this);

        this.addView(this.game.add.sprite(this.centerX, this.centerY, "clock"));
        this.addView(this.game.add.sprite(this.centerX, this.centerY, "erduo"));
        this.addView(this.game.add.sprite(this.centerX, this.centerY, "huxu"));
        this.addView(this.game.add.sprite(this.centerX, this.centerY, "hander"));

        var rect = new Rect(this.game, 200, 200);
        rect.render(30, 90, 0xff9900);

        this.addView(rect);
    }
}