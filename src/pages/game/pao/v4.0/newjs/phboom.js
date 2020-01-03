function Phboom(){
    this.list = [];
    this.group = phgame.add.group();
}

Phboom.prototype = {
    show: function(x, y){
        var item = this.getActiveItem();
        item.anchor.set(0.5, 0.5);
        item.x = x;
        item.y = y;
        item.alpha = 1;
        var anim = item.animations.add('boom', Phaser.ArrayUtils.numberArray(0, 9), 10, false);
        anim.play();
        anim.onComplete.add(function(){
            item.alpha = 0;
            console.log("boom total: " + this.list.length);
        }, this);
    },
    getActiveItem: function(){
        for(var i = 0; i < this.list.length; i++){
            if(this.list[i].alpha === 0){
                return this.list[i];
            }
        }
        var item = phgame.add.sprite(0, 0, "boom");
        this.group.addChild(item);
        this.list.push(item);
        return item;
    }
};