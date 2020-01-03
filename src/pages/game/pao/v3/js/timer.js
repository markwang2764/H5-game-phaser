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
    
    var $this = this;
    $this.num = 30;
    var showBossTimer = Math.floor($this.num - 15);
    //showBossTimer = 8;
    //$this.div.innerHTML = $this.num;
    phclock.showTime($this.num);
    $this.timerId = setInterval(function(){
        if(!game.running){
            return;
        }
        if(--$this.num == 0){
            clearInterval($this.timerId);
            $this.over = true;
            hitSignal.dispatch({type: "game_over"});
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