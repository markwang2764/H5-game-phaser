import DataSystem from "../../../core/ts/DataSystem";
import Map from "../../../core/ts/Map";
import UserModel from "./UserModel";
import Logger from "./Logger";
import gcf from "./Config";

/**
 * @author zoney
 * @desc 玩家数据系统
 */
export default class UserData extends DataSystem{
    constructor(id: number) {
        if(typeof id !== 'number') {
            Logger.error('can not initialize UserData without valid type: %s', (typeof id));
            return;
        }
        if(!!UserData._inst) {
            Logger.warn('can not initialize UserData repeatly.');
            return;
        }
        super(id);
        this._curLevelId = 3;
        this._levelConfig = {"1": 3, "2": 4, "3": 5, "4": 6, "5": 7, "6": 8, "7": 9};
        this._users = new Map<string, UserModel>([]);
        UserData._inst = this;
        GAME.data.register(this);
    }

    private static _inst: UserData;
    private _users: Map<string, UserModel>;
    /**当前挑战的关卡id，目前共有：1-7关 */
    private _curLevelId: number;
    /**关卡难度等级配置信息 */
    private _levelConfig: {[key: string]: number};
    public self: UserModel;
    public selfId: string;
    public pkRet: number;
    public rival: UserModel;

    /**
     * 返回当前关卡id对应的难度等级信息
     */
    public get levelBase(): number { return this._levelConfig[this._curLevelId.toString()]; }
    /**
     * 设置当前挑战关卡ID，仅在：
     * 1. 游戏初始化
     * 2. 选择关卡成功返回后
     * 设置
     */
    public get curLevelId(): number { return this._curLevelId; }
    public set curLevelId(val: number) { this._curLevelId = val; }

    public add(user: any): boolean {
        var id = user.id || user.usk || user.uskA || user.sessionKey;
        if(!!this._users.get(id)) {
            Logger.warn("data of user: %s has already existed.", user.id.substr(0, 5));
            return false;
        }
        var model: UserModel = this.createUser(id, user);
        // 添加玩家模型时不会有以下注释部分数据，正常的流程是先初始化玩家信息，然后开始游戏。此数据需要游戏之后才会产生
        // model.time = 0;
        // model.rank = user.rank || 0; // 此数据
        // model.global = user.global || 0;
        this._users.set(model.id, model);
        if(id === this.selfId && !this.self) {
            this.self = model;
        } else {
            this.rival = model;
        }
        return true;
    }

    public createUser(id: string, user: any): UserModel {

        var model: UserModel = new UserModel();
        model.id = id || "super_lite";
        model.name = user.nickName || user.name || "小鱼无双";
        model.avator = user.headUrl || user.headImg || gcf.DEFAULT_ASSETS;
        model.level = user.level || user.checkPointType;
        model.best = user.score || user.best;
        return model;
    }

    public getById(id: string): UserModel {
        if(!this._users.has(id)) {
            Logger.warn("查询玩家: %s失败，玩家不存在。", id);
            return null;
        }
        return this._users.get(id);
    }

    public getUsers(): UserModel[] {
        return this._users.values();
    }

    public remove(id: string): boolean {
        if(!this._users.has(id)) {
            Logger.warn("移除玩家: %s失败，玩家不存在。", id);
            return false;
        }
        this._users.delete(id);
        return true;
    }

    /**
     * @author zoney
     * @desc 销毁玩家数据系统。此析构方法需要谨慎使用，销毁后，需要再次实例化
     */
    public destroy(): void {
        this._users.clear();
        this.self = null;
        this.selfId = null;
        UserData._inst = null;
    }
    
}

interface lvcfg<K, V> {

}