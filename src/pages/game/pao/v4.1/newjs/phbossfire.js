function PhbossFire(){
    this.list = [];
    this.group = phgame.add.group();
}

PhbossFire.prototype = {
    show: function(x, y){
        var item = this.getActiveItem();
        item.x = x;
        item.y = y;
        item.visible = true;
        var anim = item.animations.add("fire");
        item.animations.play("fire", 30, false);
        item.animations.loop = false;
        item.anchor.set(0.5, 0.5);
        anim.onComplete.add(function(a, b){
            item.visible = false;
        }, this);
        console.log("fire total: " + this.list.length);
    },
    getActiveItem: function(){
        for(var i = 0; i < this.list.length; i++){
            if(this.list[i].visible === false){
                return this.list[i];
            }
        }
        var item = phgame.add.sprite(0, 0, "fireboss");
        this.group.addChild(item);
        this.list.push(item);
        return item;
    }
};