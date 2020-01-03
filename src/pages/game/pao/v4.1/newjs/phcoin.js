function Phcoin(group){
    this.sprite = phgame.add.sprite(0, 0, "coin");

    //this.skin = App.game.add.sprite(App.game.width >> 1, App.game.height >> 1, 'coin');
	//this.skin.anchor.setTo(0.5, 0.5);
	this.sprite.animations.add("roll");
	this.sprite.animations.play("roll", 30, true);

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(0.5, 0.5);
    this.x = 0;
    this.y = 0;
    this.potx = 0;
    this.poty = 0;
    this.xspeed = 0;
    this.yspeed = 0;
    this.playing = false;
    this.sprite.alpha = 0;
    this.step = 0;
    this.aim = 0;
    this.direction = true;
    group.add(this.sprite);
}

Phcoin.prototype = {
    show: function(x, y, direction){
        this.x = x;
        this.y = y;
        this.playing = true;
        this.sprite.alpha = 1;
        this.step = 1;
        this.xspeed = (0.5 - Math.random()) * 12;
        this.yspeed = Math.random() * 4 + 2;
        this.aim = y - Math.random() * 48 - 32;
    },
    hide: function(){
        this.sprite.alpha = 0;
    },
    move: function(){
        if(this.step === 1){
            this.x += this.xspeed;
            this.y -= this.yspeed;
            if(this.y < this.aim){
                this.step = 2;
            }
            this.update();
        }
        else if(this.step === 2){
            this.x += (700 - this.x) * 0.08;
            this.y += (STAGE_HEIGHT - 200 - this.y) * 0.08;
            if(this.y > STAGE_HEIGHT - 240){
                this.step = 0;
                this.playing = false;
                this.sprite.alpha = 0;
            }
            this.update();
        }
    },
    update: function(){
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }
    /*
    show: function(x, y, direction){
        this.direction = direction;
        this.playing = true;
        this.x = 10 + Math.random() * 10;
        this.y = Math.random() * 6 + 4;
        this.xspeed = 4 + Math.random() * 4;
        this.yspeed = 0.2 + Math.random();
        this.potx = x + Math.random() * 12;
        this.poty = y + Math.random() * 20;
        this.sprite.x = this.potx;
        this.sprite.y = this.poty;
        this.sprite.alpha = 1;
        this.step = 0;
    },
    move: function(){
        if(this.playing){
            if(this.step === 0){
                this.x -= 1;
                var y = Math.pow(this.x, 2) + this.y;
                if(this.direction){
                    this.sprite.x = this.potx - this.x * this.xspeed;
                }
                else{
                    this.sprite.x = this.potx + this.x * this.xspeed;
                }
                this.sprite.y = y * this.yspeed + this.poty;
                if(y > this.poty - 10){
                    this.step = 1;
                    var tween = phgame.add.tween(this.sprite).to( { x: 700, y: STAGE_HEIGHT - 200 }, 360, "Linear", true);
                    tween.onComplete.add(function(){
                        this.playing = false;
                        this.sprite.alpha = 0;
                    }, this);
                }
            }
        }
    }
    */
};