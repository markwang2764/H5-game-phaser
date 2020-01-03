function Timer(){
    this.counter = 0;
    this.txt = $(".item-4976119");
    this.tid = 0;
}

Timer.prototype.start = function(){
    this.counter = 0;
    this.txt.html("时间：" + this.counter);
    this.stop();
    this.tid = setInterval(()=>{
        this.counter++;
        this.txt.html("时间：" + this.counter);
    }, 1000);
}

Timer.prototype.init = function(){
    this.counter = 0;
    this.txt.html("时间：" + this.counter);
}

Timer.prototype.stop = function(){
    clearInterval(this.tid);
    localStorage.setItem("timertip", "时间：" + this.counter);
}

Timer.prototype.readSave = function(){
    this.txt.html(localStorage.getItem("timertip"));
}