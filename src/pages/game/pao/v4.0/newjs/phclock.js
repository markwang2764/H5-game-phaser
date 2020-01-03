function Phclock(x, y){
    this.group = phgame.add.group();
    this.group.x = x;
    this.group.y = y;

    this.fire = phgame.add.sprite(0, 0, "firetime");
    var anim = this.fire.animations.add("fire");
    this.fire.animations.play("fire", 30, true);
    this.fire.animations.loop = false;
    this.fire.anchor.set(0.5, 0.5);
    this.fire.x = 4;
    this.fire.y = 4;
    this.fire.alpha = 0.9;
    this.group.addChild(this.fire);

    this.clock = this.group.create(0, 0, "clock");
    this.clock.anchor.set(0.5, 0.5);
    this.clock.x = 0;
    this.clock.y = 0;

    this.txt = phgame.add.bitmapText(0, 0, 'comboxfont', '30', 60);
    this.txt.anchor.set(0.5, 0.5);
    this.txt.y = -10;
    this.clock.addChild(this.txt);

    this.hideFire();
    // this.shake();

    this.group.alpha = 0;
    setTimeout(() => {
        this.group.alpha = 1;
    }, 100);
    // phgame.add.tween(this.group).to( {alpha: 1}, 300, Phaser.Easing.Quadratic.InOut, true);
}

Phclock.prototype = {
    showTime: function(n){
        this.txt.setText(n);
        // this.group.alpha = 1;
    },
    reset: function(){
        this.showTime(0);
        this.hideFire();
    },
    shake: function(){
        var tween = phgame.add.tween(this.clock).to( { rotation: 60 * Math.PI / 180}, 120, Phaser.Easing.Quadratic.InOut, true);
        tween.onComplete.add(function(){
            //this.playing = false;
            //this.sprite.alpha = 0;
            var tween2 = phgame.add.tween(this.clock).to( { rotation: -60 * Math.PI / 180}, 120, Phaser.Easing.Quadratic.InOut, true);
            tween2.onComplete.add(function(){
                phgame.add.tween(this.clock).to( { rotation: 0}, 120, Phaser.Easing.Quadratic.InOut, true);
            }, this);
        }, this);
    },
    showFire: function(){
        this.fire.visible = true;
    },
    hideFire: function(){
        this.fire.visible = false;
    }
};