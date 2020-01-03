function Countdown(div, c1, c2, c3, go){
    this.div = div;
    this.c1 = c1;
    this.c2 = c2;
    this.c3 = c3;
    this.go = go;
    this.list = [c3, c2, c1, go];
    this.sid = 0;
    this.timerId = 0;
}

Countdown.prototype.show = function(n){
    for(var i = 0; i < this.list.length; i++){
        if(this.list[i] == n){
            this.list[i].style.display = "block";
        }
        else{
            this.list[i].style.display = "none";
        }
    }
}

Countdown.prototype.play = function(callback){
    this.div.style.display = "block";
    this.sid = 0;
    var $this = this;
    $this.show($this.list[$this.sid++]);

    $this.timerId = setInterval(function(){
        if($this.sid == $this.list.length){
            clearInterval($this.timerId);
            $this.div.style.display = "none";
            callback && callback();
        }
        else{
            var n = $this.list[$this.sid++];
            $this.show(n);
        }
    }, 1000);
}