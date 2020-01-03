import Boot from './state/Line'

export default class Main{
    game: Phaser.Game;
    sods: any;

    constructor(){
        var STAGE_WIDTH:number = 750;
        var STAGE_HEIGHT:number = 1000;
        this.game = new Phaser.Game(STAGE_WIDTH, STAGE_HEIGHT, Phaser.AUTO, "game");
        this.game.state.add("Boot", Boot);
        this.game.state.start("Boot");
        document.getElementById("game").style.display = "none";
    }

    public playSound(key:string, loop:boolean):void{
        var sod:Phaser.Sound = this.sods[key];
        if(!sod){
            sod = this.game.add.audio(key, 0.72, loop);
            sod.allowMultiple = true;
            this.sods[key] = sod;
        }
        sod.volume = 0.72;
        sod.play();
    }
}
