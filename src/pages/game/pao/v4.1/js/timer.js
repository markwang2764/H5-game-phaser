function Timer(div){
  this.div = div;
  this.timerId = 0;
  this.over = false;
  this.showBoss = false;
}

Timer.prototype.start = function(){
    this.showBoss = false;
    this.over = false;
    clearInterval(this.timerId);
    
    var TIME = 30;
    var $this = this;
    var autoTimer = localStorage.getItem("autoTimer");
    if(autoTimer){
        autoTimer = Number(autoTimer);
    }
    else{
        autoTimer = TIME;
    }
    $this.num = autoTimer;

    var showBossTimer = 12;
    //showBossTimer = 8;
    //$this.div.innerHTML = $this.num;
    phclock.showTime($this.num);
    $this.timerId = setInterval(function(){
        if(!game.running){
            return;
        }
        if(--$this.num <= 0){
            clearInterval($this.timerId);
            $this.over = true;
            hitSignal.dispatch({type: "game_over"});
            localStorage.setItem("autoTimer", TIME);
        }
        if($this.num === showBossTimer && !$this.showBoss){
            $this.showBoss = true;
            if(store.boss.proportion > 0){
                hitSignal.dispatch({type: "show_boss"});
                phclock.shake();
                phclock.showFire();
            }
        }
        //$this.div.innerHTML = $this.num;
        phclock.showTime($this.num);
    }, 1000);
}

Timer.prototype.jumpOver = function(){
    if(this.num > 1){
        this.num = 1;
    }
}