export default class Toast{
    constructor(){
        this.handler = null;
    }

    show(tip){
        if(!!this.handler) {return;}
        $(".toast-mask").css({display: "flex"});
        $(".toast").html(tip);
        this.handler = setTimeout(()=>{
            $(".toast-mask").hide();
            this.handler = null;
        }, 2100);
    }
}