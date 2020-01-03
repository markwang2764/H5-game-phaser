/// <reference path="../../ts/phaser.d.ts" />
// import './core'
/// <reference path="./core.d.ts" />
export default class BaseState extends Phaser.State {
    constructor(){
        super();
    }

    public preload():void {

    }

    public update(): void {
        GAME.update(17);
    }
}