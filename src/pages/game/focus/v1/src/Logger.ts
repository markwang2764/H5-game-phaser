/**
 * @author
 * @desc 系统日志打印
 */
export default class Logger {
    constructor() {

    }
    
    public static INFO: number = 2;
    public static WARN: number = 1;
    public static ERROR: number = 0;
    public static NONE: number = -1;
    /**
     * 当前日志输出级别
     */
    public static LEVEL: number = 2;

    public static log(msg: string, ...arg: any[]): void {
        if(Logger.LEVEL < Logger.INFO) return;
        var str: string = Logger.argumentProcessor(arguments);
        var args = [
            "%c [INFO] %c %c " + str,
            "background: #000000; color: #00e843",
            "background: #ffffff",
            "background: #000000; color: #ffffff"
        ];
        console.log.apply(console, args);
    }

    /**
     * warn
     */
    public static warn(msg: string, ...arg: any[]):void {
        if(Logger.LEVEL < Logger.WARN) return;
        var str: string = Logger.argumentProcessor(arguments);
        var args = [
            "%c [WARN] %c %c " + str,
            "background: #000000; color: #F9A507",
            "background: #ffffff",
            "background: #F9A507; color: #ffffff"
        ];
        console.log.apply(console, args);
    }

    public static error(msg: string, ...arg: any[]):void {
        if(Logger.LEVEL < Logger.ERROR) return;
        var str: string = Logger.argumentProcessor(arguments);
        var args = [
            "%c [ERROR] %c %c " + str,
            "background: #000000; color: #C25255",
            "background: #ffffff",
            "background: #C25255; color: #ffffff"
        ];
        console.log.apply(console, args);
    }

    private static argumentProcessor(arg: IArguments): string {
        if(!arg.length) return '';
        if(arg.length === 1) return arg[0];
        var base: string = arg[0];
        var list = base.split('%s');
        var fill = [];
        for(var i = 1; i <= arg.length - 1; i++) {
            fill.push(arg[i]);
        }
        if(list.length > (fill.length + 1)) {
            var num = list.length - 1 - fill.length;
            for(var j = 0; j < num; j++) {
                fill.push('%s');
            }
        }
        var str = '';
        for(var k = 0; k < list.length - 1; k++){
            str += list[k] + fill.shift().toString();
        }
        if(!!fill.length) {
            for(var n = 0; n < fill.length - 1; n++) {
                str += fill[n].toString();
            }
        }
        return str;
    }
}