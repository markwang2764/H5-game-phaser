/**
 * 玩家信息数据模型
 */
export default class UserModel {
    
    private _id: string;
    private _name: string;
    private _sex: number;
    private _avator: string;
    private _rivalId: string;

    public get id(): string { return this._id; }
    public get name(): string { return this._name; }
    public get sex(): number { return this._sex; }
    public get avator(): string { return this._avator; }
    public get rivalId(): string { return this._rivalId; }

    public set id(val: string) { this._id = val; }
    public set name(val: string) { this._name = val; }
    public set sex(val: number) { this._sex = val; }
    public set avator(val: string) { this._avator = val; }
    public set rivalId(val: string) { this._rivalId = val; }
    
    constructor() {
        this._id = '';
        this._name = '';
        this._sex = 0;
        this._avator = '';
        this._rivalId = '';
    }
}