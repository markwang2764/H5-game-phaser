/**
 * 游戏场景基类
 */
export default class State extends Phaser.State {
    constructor() {
        super();
    }

    public preload(): void {

    }

    public create(): void {

    }

    /**
     * 默认带动事件子系统和网络子系统的主循环
     */
    public update(): void {
        GAME.update(17);
    } 
}