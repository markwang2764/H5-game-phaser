import Page from "./Page";
import DoubleClick from "./DoubleClick";
var gtape;
export default class Edit extends Phaser.State{
    private page:Page;

    constructor(){
        super();
    }

    preload(){
        this.game.world.setBounds(0, 0, 1200, 1600); 
        this.page = new Page(this.game, 0, 0, 750, 1206);
        this.page.inputEnabled = true;
        this.page.init();
        this.game.world.add(this.page);
        this.resize();
    }

    resize(){
        this.game.stage.setBackgroundColor(0x999999);
        this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
        this.page.x = this.game.world.centerX - 750 / 2;
        this.page.y = this.game.world.centerY - 1206 / 2;
    }

    create(){

    }

    update(){
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.game.camera.x -= 10;
        }
        else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.game.camera.x += 10;
        }
        else if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            this.game.camera.y -= 10;
        }
        else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            this.game.camera.y += 10;
        }
        else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DELETE)){
            this.page.deleteView();
        }
    }
}