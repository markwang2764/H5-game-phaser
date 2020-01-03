
import State from "./State";
import UserModel from "./UserModel";
import UserData from "./UserData";
import gameCfg from "./Config";

export default class BootState extends State {
    
    constructor(){
        super();
        GAME.event.once(GAME.CoreMessage.EMDED_LOADED, this.start, this);
    }

    public init(): void {
        this.game.stage.disableVisibilityChange = true;
    }

    public preload(): void {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.load.crossOrigin = 'anonymous';
        this.load.atlasXML('preload', gameCfg.ASSET_HOTS + 'preload.png', gameCfg.ASSET_HOTS + 'preload.xml');
        this.load.image("mbg", gameCfg.ASSET_HOTS + 'match_bg.jpg');
        // 加载玩家自己的头像
        var userSys: UserData = GAME.data.getById(DataSystemType.USER);
        var head_url = GAME.tool.wxHeadUrlFix(userSys.self.avator);
        this.load.image(userSys.selfId, head_url);
    }

    public create(): void {
        
    }

    /**
     * 在埋点信息请求成功后开始匹配
     * @param par 
     */
    private start(par: any): void {
        this.game.state.start('Match');
        // console.log('turn to Match');
    }

    public shutdown(): void {
        // console.log('Boot shutdown');
    }

    public update(): void {
        super.update();
    }
}

enum DataSystemType {
    USER,
}