function Phmonster(sprite){
    this.sprite = sprite;
    this.x = 0;
    this.y = 0;
    this.xspeed = 3;
    this.yspeed = 0;
    this.timer = 0;
    this.shaking = false;
    this.shakeTimes = 0;
    this.init();
}

Phmonster.prototype = {
    init: function(){
        console.log(this);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(e){
            console.log(this);
            this.shake();
        }, this);
    },
    move: function(){
        this.x += this.xspeed;
        this.timer += 0.24;
        this.yspeed = Math.sin(this.timer);
        this.y += this.yspeed;

        if(this.shaking){
            this.sprite.x = this.x + (0.5 - Math.random()) * 6;
            this.sprite.y = this.y + (0.5 - Math.random()) * 6;
            if(++this.shakeTimes > 9){
                this.shaking = false; 
            }
        }
        else{
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }

        if(this.x > STAGE_WIDTH){
            this.sprite.x = 0 - this.sprite.width;
        }
    },
    shake: function(){
        this.shaking = true;
        this.shakeTimes = 0;
    }
}