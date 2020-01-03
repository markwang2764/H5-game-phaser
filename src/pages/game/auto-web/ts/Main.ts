import Boot from './Boot'
import Edit from './Edit';

export default class Main{
    constructor(){
        var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, "stage");
        game.state.add("Boot", Boot);
        game.state.add("Edit", Edit);
        game.state.start("Boot");
    }
}