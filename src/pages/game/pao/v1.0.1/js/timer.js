function Timer(div){
    this.div = div;
    this.timerId = 0;
}

Timer.prototype.start = function(){
    this.over = false;
    clearInterval(this.timerId);
    var $this = this;
    $this.num = 30;
    $this.div.innerHTML = $this.num;
    $this.timerId = setInterval(function(){
        if(!game.running){
            return;
        }
        if(--$this.num == 0){
            clearInterval($this.timerId);
            $this.over = true;
        }
        //$this.div.innerHTML = $this.formatTime($this.num);
        $this.div.innerHTML = $this.num;
    }, 1000);
}

Timer.prototype.formatTime = function(n){
    var m = Math.floor(n / 60);
    var s = n % 60;
    return m + ":" + (s > 9 ? s : "0" + s);
}