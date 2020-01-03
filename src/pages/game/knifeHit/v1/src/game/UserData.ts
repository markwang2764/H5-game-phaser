import UserModel from "./UserModel";
import DataSystem from "../../../../core/ts/DataSystem";
import Map from "../../../../core/ts/Map";
import gameCfg from "./Config";

/**
 * 玩家信息数据系统，管理包括对战玩家在内的所有玩家信息
 */
export default class UserData extends DataSystem{
    
    private static _instance: UserData;
    private _users: Map<string, UserModel>;
    public selfId: string;
    public self: UserModel;

    constructor(id: number){
        if(typeof id !== 'number') {
            console.error('can not initialize UserData without valid type: %s', (typeof id));
            return;
        }
        if(!!UserData._instance) {
            console.warn('can not initialize UserData repeatly.');
            return;
        }
        super(id);
        this._users = new Map<string, UserModel>([]);
        // console.log(this._users);
        UserData._instance = this;
        GAME.data.register(this);
    }

    /**
     * 添加玩家信息
     * @param user 玩家数据模型
     */
    public add(user: any): boolean {
        var id = user.id || user.usk || user.uskA;
        if(!!this._users.get(id)) {
            console.warn("data of user: %s has already existed.", user.id.substr(0, 5));
            return false;
        }
        var model: UserModel = new UserModel();
        model.id = id || "super_lite";
        model.name = user.nickName || user.name || "小鱼无双";
        model.sex = user.sex || 0;
        model.avator = user.headUrl || user.headImg || gameCfg.DEFAULT_ASSETS;
        model.rivalId = user.rivalId || '';
        this._users.set(model.id, model);
        if(id === this.selfId && !this.self) {
            this.self = model;
        }
        return true;
    }

    /**
     * 查询玩家信息
     * @param id 玩家id
     */
    public getUserById(id: string): UserModel {
        var user: UserModel = this._users.get(id);
        if(!user) {
            console.warn('info of user: %s does not exist.', id.substr(0, 5));
            return null;
        }
        return user;
    }

    /**
     * 删除指定id玩家的信息
     * @param id 玩家id
     */
    public remove(id: string): boolean {
        var user: UserModel = this._users.get(id);
        if(!user) {
            console.warn('can not remove a user which does not exist.[%s]', id.substr(0, 5));
            return false;
        }
        this._users.delete(id);
        return true;
    }

    /**
     * 查询当前玩家数据系统中所有玩家信息
     */
    public get users(): UserModel[] {
        return this._users.values();
    }

    public isSelfId(id: string): boolean {
        return id === this.selfId;
    }
}