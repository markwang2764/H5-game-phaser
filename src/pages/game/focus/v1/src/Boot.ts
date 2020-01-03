import BaseState from "../../../core/ts/BaseState";
import gcf from './Config';

/**
 * 游戏起始状态，下载loading页面所必须的资源，设置游戏适配格式
 */
export default class Boot extends BaseState {
    constructor() {
        super();
    }

    public init(): void {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.stage.disableVisibilityChange = true;
    }

    public preload(): void {
        var res = this.cache.getJSON('assets').res;
        for(var i = res.length - 1; i >= 0; i--) {
            if(res[i].name === 'preload') {
                this.load.atlasXML(res[i].name, res[i].pic, res[i].xml);
                break;
            }
        }
    }

    public create(): void {
        this.state.start('Load');
    }

    public update(): void {
        super.update();
    }

    public shutdown(): void {

    }
}