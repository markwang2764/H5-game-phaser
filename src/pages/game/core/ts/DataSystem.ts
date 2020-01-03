/**
 * 游戏数据系统基类
 */
export default class DataSystem {
    protected _id: number;

    constructor(id: number){
        this._id = id;
    }

    public get id(): number { return this._id; }
}