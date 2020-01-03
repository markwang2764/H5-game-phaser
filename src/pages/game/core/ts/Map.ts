/**
 * The keys of a Map can be arbitrary values.
 * var map = new Map([
 *    [ 1, 'one' ],
 *    [ 2, 'two' ],
 *    [ 3, 'three' ]
 * ]);
 */
export default class Map<K, V> {
    /**
     * 
     * @param elements [description]
     */
    constructor(elements?: V[]){
        this._entries = {};
        this._size = 0;
    }

    /**
     * [description]
     */
    private _entries: {[key: string]:  MapPair<K, V>};

    /**
     * [description]
     */
    private _size: number;

    /**
     * [description]
     * @param key [description]
     * @param value [description]
     */
    public set(key: K, value: V): Map<K, V>{
        // 包含key为null或者undefined或者其他类型的情况
        if(!this.isValidKey(key)) {
            console.error('fail to set pair to map, typeof "key" must be "string" or "number".');
            return undefined;
        }
        if(this.isUndefined(value)) {
            console.error('fail to set pair to map, "value" can not be undefined.');
            return undefined;
        }
        this._entries[this.toStr(key)] = {
            key: key,
            value: value
        };
        this._size++;
        return this;
    }

    /**
     * 对象转换为字符串
     * @param item 待转换的对象
     */
    private toStr(item: any): string {
        if(typeof item === 'string') {
            return '$' + item;
        } else {
            return '$' + item.toString();
        }
    }

    /**
     * 指定的key类型只能是string或者number类型
     * @param key 待验证key
     */
    private isValidKey(key: any): boolean {
        return (typeof key === 'string' || typeof key === 'number');
    } 

    /**
     * 验证对象是否为undefined
     * @param item 待验证对象
     */
    private isUndefined(item: any): boolean {
        return (typeof item === 'undefined');
    }

    /**
     * [description]
     * @param key [description]
     */
    public get(key: K): V {
        if(!this.isValidKey(key)) {
            return undefined;
        }
        var pair = this._entries[this.toStr(key)];
        if(this.isUndefined(pair)) {
            return undefined;
        }
        return pair.value;
    }

    /**
     * [description]
     */
    getArray(): V[]{
        return null;
    }

    /**
     * [description]
     * @param key [description]
     */
    public has(key: K): boolean {
        if(!this.isValidKey(key)) {
            return false;
        }
        var ret = this._entries[this.toStr(key)];
        if(this.isUndefined(ret)) {
            return false;
        }
        return true;
    }

    /**
     * [description]
     * @param key [description]
     */
    public delete(key: K): MapPair<K, V> {
        if(!this.isValidKey(key)) {
            return undefined;
        }
        var k: string = this.toStr(key);
        var pair: MapPair<K, V> = this._entries[k];
        if(!this.isUndefined(pair)) {
            this._size--;
            delete this._entries[k];
        }
        return pair;
    }

    /**
     * [description]
     */
    public clear(): Map<K, V> {
        this._entries = {};
        this._size = 0;
        return this;
    }

    /**
     * [description]
     */
    keys(): K[] {
        var keys: K[] = [];
        for(var key in this._entries) {
            if(this.hasOwn(this._entries, key)) {
                var pair = this._entries[key];
                keys.push(pair.key);
            }
        }
        return keys;
    }

    private hasOwn(obj: any, key: any) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    /**
     * [description]
     */
    public values(): V[] {
        var values: V[] = [];
        for(var key in this._entries) {
            if(this.hasOwn(this._entries, key)) {
                var pair = this._entries[key];
                values.push(pair.value);
            }
        }
        return values;
    }

    /**
     * [description]
     */
    // dump(): void;

    /**
     * [description]
     * @param callback [description]
     */
    public forEach(callback: (key: K, value: V)=>void, thisObj: object):void {
        for(var key in this._entries) {
            if(!this.hasOwn(this._entries, key)) continue;
            var pair = this._entries[key];
            callback.call(thisObj, pair.key, pair.value);
        }
    }

    /**
     * [description]
     * @param value [description]
     */
    // contains(value: V): boolean {

    // }
    public get size(): number { return this._size; }
    /**
     * Merges all new keys from the given Map into this one
     * If it encounters a key that already exists it will be skipped
     * unless override = true.
     * @param map [description]
     * @param override [description] Default false.
     */
    // merge(map: Phaser.Structs.Map<K, V>, override?: boolean): Phaser.Structs.Map<K, V>;

}

interface MapPair<K, V> {
    key: K,
    value: V
}