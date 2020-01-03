
/**
 * 游戏项目模块
 */
declare module GAME {
    
    /**
     * 埋点相关
     */
    module embed{
        var init:(data:any)=>void;
        var embedClick:(item:any)=>void;
        var embedExport:(item:any)=>void;
        var numClick:(item:any)=>void;
        var numExport:(item:any)=>void;
        var data: any;
    }

    /**
     * 游戏事件管理器
     */
    module event{
        /**
         * 注册单次响应事件监听
         */
        var once:(id: number|string, fun:Function, thisObj:object)=>void;

        /**
         * 注册事件监听
         * @param {number|string} type 消息id
         * @param {Function} fun 回调函数
         * @param {object} thisObj 回调对象
         * @param {number} times 回调次数
         */
        var on:(id: number|string, fun: Function, thisObj: object, times?: number)=>void;

        /**
         * 发射指定消息
         * @param {EventType} type 消息类型
         * @param {number|string} id 消息id
         * @param {object} param 参数
         */
        var send:(type: number | string, id: number, param: any)=>void;

        /**
         * 移除指定事件对应的监听回调
         * @param {number | string} type 要移除监听的事件id
         * @param {Function} fun 要移除的事件回调方法
         */
        var remove:(type: number|string, fun: Function)=>void;
        var update:()=>void;
    }

    module net {
        /**
         * 向服务器发送消息
         * @param {number} proto 网络接口协议编码
         * @param {object} data 发送的数据
         */
        var send:(proto: number, data: object)=>void;
        var update:(dlt?: number)=>void;
    }

    module data {

        /**
         * 向数据系统管理器中安装一个数据系统
         * @param {any} dataSystem 数据系统实例
         */
        var register:(dataSystem: any)=> void;
        /**
         * 从数据系统管理器中移除指定数据系统
         * @param {number} id 数据系统id标识
         */
        var remove:(id: number)=> void;
        /**
         * 查询指定数据系统
         * @param {number} id 数据系统id标识
         */
        var getById:(id: number)=> any;
    }

    /**
     * 
     */
    enum CoreMessage {
        /**
         * 
         */
        EMDED_LOADED,
    }

    /**
     * 游戏事件类型
     */
    enum EventType {
        /**
         * UI事件，一般指按钮等触摸相关事件
         */
        UI,
        /**
         * 内部事件，一般指计时器触发，网络事件等
         */
        INTER,
    }

    module tool {
        /**
         * GET接口请求
         * @param {string} url 请求地址
         * @param {object} data json格式参数
         * @param {Function} callback 根据回调的参数data是否为null判断请求成功
         */
        var httpGet:(url: string, data: object, callback: Function)=>void;
    
        /**
         * POST接口请求
         * @param {string} url 请求地址
         * @param {object} data json格式参数
         * @param {Function} callback 根据回调的参数data是否为null判断请求成功
         */
        var httpPost:(url: string, data: object, callback: Function)=>void;
    
        /**
         * 把网址后的参数转为json对象
         * @param {string} url 网址，不传默认用当前网址
         */
        var searchToJson:(url: string)=>void;
        
        /**
         * 把json数据和网址拼接成一个完整的url
         * @param {string} url 网址
         * @param {object} obj json数据
         */
        var urlJsonParam:(url: string, obj: object)=>void;
    
        /**
         * 获取url参数
         * @param {string} name 参数名称
         * @returns {string}
         */
        var getParamUrl:(name: string)=>string;
    
        /**
         * 将字符串转换为普通对象
         */
        var toJson: (str: string) =>object;
        
        /**
         * 将字符串按指定的字长进行截取
         * 半角和全角字符混合的情况下，需要按照字长来截取，而不是简单的按长度截取
         */
        var substr: (nick: string, tarlen: number)=>string;

        /**
         * 微信头像链接如果没有.jpg或者.png后缀，添加后缀
         */
        var wxHeadUrlFix: (url: string)=>string;

        var hpGet:(url: string, data: object, cb: Function)=>void;
        var hpPost:(url: string, data: object, cb: Function)=>void;

        var msTos:(ms: number)=>string;
        /**
         * 向埋点数据中的指定键值中插入数据
         */
        var append2Embed:(key: string, data: any)=>object;
        /**
         * 从url中查询指定key对应的值，组装为一个对象
         */
        var paramWrapper:(keys: string[] | string)=>object;

        var assign:(dest: any, src: any)=>void;
    }
    
    var update:(dlt: number)=>void;
    var app: any;
}

declare module CFG {
    var uskA: string;
    var sex: number;
    var nickName: string;
    var headUrl: string;
    var enterGameSource: number;
    var userId: string;
    var sessionKey: string;
    var gameId: number;
    var embed: any;
}