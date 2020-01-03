import DoubleClick from "./DoubleClick";
import Rect from "./Rect";
import SelectFrame from "./SelectFrame";

export default class Boot extends Phaser.State{

    private selectFrame:SelectFrame;

    constructor(){
        super();
    }

    preload(){
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.load.image("body", "//yun.tuisnake.com/h5-mami/webgame/fish/body2.png");
        this.game.load.image("xiangyan", "//yun.tuisnake.com/h5-mami/webgame/fish/xiangyan2.png");
        this.game.load.image("erduo", "//yun.tuisnake.com/h5-mami/webgame/fish/erduo2.png");
        this.game.load.image("huxu", "//yun.tuisnake.com/h5-mami/webgame/fish/huxu2.png");
        this.game.load.image("mojing", "//yun.tuisnake.com/h5-mami/webgame/fish/mojing2.png");
        this.game.load.image("onecoin", "//yun.tuisnake.com/h5-mami/webgame/fish/coin.png");
        this.game.load.image("tape", "//yun.tuisnake.com/h5-mami/webgame/fish/tape.png");
        this.game.load.image("hander", "//yun.tuisnake.com/h5-mami/webgame/fish/hander.png");
        this.game.load.image("clock", "//yun.tuisnake.com/h5-mami/webgame/fish/clock.png");
    }

    create() {
        this.game.state.start("Edit");
    }

}