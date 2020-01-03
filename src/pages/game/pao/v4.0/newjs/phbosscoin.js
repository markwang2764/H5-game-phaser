function PhbossCoin(){
    this.group = phgame.add.group();
    this.list = [];
    this.timer = 0;
    this.counter = 0;
}

PhbossCoin.prototype = {
    show: function(total){
        this.list = [];
        this.group.removeAll();
        for(var i = 0; i < total; i++){
            var sprite = this.group.create(0, 0, "coin");
            sprite.anchor.set(0.5, 0.5);
            sprite.animations.add("roll");
            sprite.animations.play("roll", 40, true);
            var phmoveItem = new PhmoveItem(sprite, STAGE_WIDTH / 2, STAGE_HEIGHT / 2);
            this.list.push(phmoveItem);
        }
        this.counter = 0;
        this.timer = setInterval(()=>{
            ++this.counter;        
            if(this.counter < 18){
                this.update();
            }

            if(this.counter === 40){
                this.list.forEach(element => {
                    element.moveTo(700, STAGE_HEIGHT - 200);
                });
            }
            if(this.counter > 40){
                this.update();
            }

            if(this.counter > 96){
                clearInterval(this.timer);
            }
        }, 30);
    },
    update: function(){
        this.list.forEach(element => {
            element.update();
        });
    }
}