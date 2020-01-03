function PhmoreHit(){
    this.group = phgame.add.group();
    this.coin = this.group.create(0, 0, "onecoin");
    this.coin.scale.setTo(0.72);
    this.tip = phgame.add.bitmapText(0, 0, 'comboxfont', '', 70);
    this.tip.anchor.set(0, 0);
    this.tip.x = 72;
    this.tip.y = -20;
    this.group.addChild(this.tip);
    this.group.x = 500;
    this.group.y = 150;
    this.group.alpha = 0;
}

PhmoreHit.prototype = {
    reset: function(){

    },
    show: function(n){
        this.tip.setText("x" + n);
        this.group.alpha = 0;
        this.group.scale.setTo(0.32);
        phgame.add.tween(this.group).to( { alpha: 1}, 400, Phaser.Easing.Quadratic.InOut, true);
        phgame.add.tween(this.group.scale).to( { x: 1, y: 1 }, 400, Phaser.Easing.Quadratic.InOut, true).onComplete.add(()=>{
            this.group.alpha = 0;
        }, this);

    },
    hide: function(){
        this.group.alpha = 0;
    }
};