function Ready(){
    this.txt = $(".item-5076197");
    this.tid = 0;
}

Ready.prototype.start = function(callback){
    var num = 5;
    this.txt.html(num + "秒后将打乱图片");
    $(".item-4865701").removeClass("long").show();
    clearInterval(this.tid);
    this.tid = setInterval(()=>{
        if(--num == 0){
            clearInterval(this.tid);
            $(".item-4865701").hide();
            callback && callback();
        }
        this.txt.html(num + "秒后将打乱图片");
    }, 1000)
}

Ready.prototype.over = function(str){
    $(".item-4865701").addClass("long").show();
    this.txt.html(str);
    localStorage.setItem("overtip", str);
}

Ready.prototype.readSave = function(){
    $(".item-4865701").addClass("long").show();
    this.txt.html(localStorage.getItem("overtip"));
}