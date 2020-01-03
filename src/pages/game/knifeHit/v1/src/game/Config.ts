export default class gameCfg {

    static STAGE_WIDTH:number = 750;
    static STAGE_HEIGHT:number = 1206;
    /**
     * 素材所在cdn域名
     */
    static ASSET_HOTS: string = "//yun.dui88.com/h5-mami/webgame/knife/";
    static DEFAULT_ASSETS: string = 'assets/res/loader_body.png';

    static rotationSpeed: number = 0.02;
    static angleSpeed: number = 0.3;

    // knife throwing duration, in milliseconds
    static throwSpeed: number = 150;
    static ResultCode = {
        KnifeHitWin: 0,
        TimeWin: 1,
        ScoreWin: 2,
        FleeWin: 3,
        Draw: 4,
        KnifeHitLost: 5,
        TimeLost: 6,
        ScoreLost: 7,
    }
}
