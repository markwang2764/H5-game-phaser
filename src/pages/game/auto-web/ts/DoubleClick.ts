export default class DoubleClick{
    public static view:any;
    public static timer:number = 0;

    public static isDoubleClick(view:any):boolean{
        var t = Date.now();
        if(t - DoubleClick.timer < 300 && DoubleClick.view == view){
            return true;
        }
        DoubleClick.view = view;
        DoubleClick.timer = t;
        return false;
    }
}