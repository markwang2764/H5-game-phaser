function PhmoveItem(view, x, y){
    this.view = view;
    this.startx = x;
    this.starty = y;
    this.movenum = Math.random() * 0.1;
    this.x = 0;
    this.y = -20 * Math.random() - 10;
    this.num = 0;
    this.a = Math.random() * 2 + 1.2;
    this.speedx = (Math.random() * 16 + 4) * (Math.random() > 0.5 ? 1 : -1);
    this.speedy = -16 * Math.random() - 10;
    this.playing = true;
    this.step = 0;
    this.update();
    this.aimx = 0;
    this.aimy = 0;
    this.aimSpeed = 0.01;
    this.delay = 0;
}

PhmoveItem.prototype = {
    update: function(){
        if(!this.playing){
            return;
        }
        if(this.step === 0){
            this.num += this.movenum;
            this.x += this.speedx;
            this.speedy += this.a;
            this.y += this.speedy;
            this.view.x = this.startx + this.x;
            this.view.y = this.starty + this.y;
        }
        else{
            if(--this.delay < 0){
                this.view.x += (this.aimx - this.view.x) * this.aimSpeed;
                this.view.y += (this.aimy - this.view.y) * this.aimSpeed;
                this.view.alpha *= 0.8;
            }
        }
    },
    stop: function(){
        this.playing = false;
    },
    moveTo: function(x, y){
        this.view.alpha = 1;
        this.delay = Math.floor(Math.random() * 12 + 2);
        this.step = 1;
        this.aimSpeed = Math.random() * 0.5 + 0.08;
        this.playing = true;
        // this.aimx = x - 20;
        // this.aimy = y + 60;
        this.aimx = x - 20;
        this.aimy = y - 10;
    }
};