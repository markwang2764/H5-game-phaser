/**
 * @author zoney
 * @desc 玩家数据模型
 */
export default class UserModel {
    constructor() {
        this._id = '';
        this._name = '';
        this._level = 0;
        this._avator = '';
        this._time = 0;
        this._rank = 0;
        this._globalRank = 0;
        this._best = 0;
        this._bonus = 0;
    }

    private _id: string;
    private _name: string;
    private _level: number;
    private _avator: string;
    private _time: number;
    private _rank: number;
    private _globalRank: number;
    private _best: number;
    private _bonus: number;

    public get id(): string { return this._id; }
    /**
     * 玩家昵称
     */
    public get name(): string { return this._name; }
    /**
     * 此玩家当前已解锁的最高关卡id
     */
    public get level(): number { return this._level; }
    /**
     * 玩家头像url
     */
    public get avator(): string { return this._avator; }
    /**
     * 本次所挑战的关卡所消耗的时间
     */
    public get time(): number { return this._time; }
    /**
     * 玩家好友榜排名-百分比
     */
    public get rank(): number { return this._rank; }
    /**
     * 玩家全球榜排名-名次
     */
    public get global(): number { return this._globalRank; }
    /**
     * 本次所挑战关卡的历史最佳成绩-毫秒
     */
    public get best(): number { return this._best; }
    /**
     * 玩家账户余额
     */
    public get bonus(): number { return this._bonus; }


    public set id(val:string) { this._id = val; }
    public set name(val:string) { this._name = val; }
    public set level(val:number) { this._level = val; }
    public set avator(val:string) { this._avator = val; }
    public set time(val: number) { this._time = val; }
    public set rank(val: number) { this._rank = val; }
    public set global(val: number) { this._globalRank = val; }
    public set best(val: number) { this._best = val; }
    public set bonus(val: number) { this._bonus = val; }
}