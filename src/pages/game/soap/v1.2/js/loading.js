function Loading(){
    this.$div = $(".loading-mask");
    this.$txt = $(".loading-tip");
    this.tid = 0;
    this.show();
}

Loading.prototype.show = function(){
    var num = 4;
    this.tid = setInterval(()=>{
        if(++num > 6){
            num = 4;
        }
        var txt = "加载中...".substr(0, num);
        this.$txt.html(txt);
    }, 240);
}

Loading.prototype.hide = function(){
    this.$div.addClass("hide-loading");
    setTimeout(() => {
        this.$div.hide();
    }, 200);
    clearInterval(this.tid);
}