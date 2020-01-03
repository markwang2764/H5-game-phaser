function Phcombo(){
    this.list = [];
    this.group = phgame.add.group();
    this.total = 0;
    this.bossReward = 0;
    this.phmoreHit = new PhmoreHit();
}

Phcombo.prototype = {
    reset: function(clearReward){
        this.total = 0;
        if(clearReward){
            this.bossReward = 0;
        }
        this.phmoreHit.hide();
    },
    show: function(x, y, reward){
        this.total += 1;
        this.bossReward += reward;
        this.phmoreHit.show(this.bossReward);
        console.log("combox" + this.total);
        var item = this.getActiveItem();
        item.setText("combox" + this.total);
        item.x = 200;
        item.y = y;
        item.scale.set(1, 1);
        item.alpha = 1;
        phgame.add.tween(item.scale).to( { x: 2, y: 2 }, 600, "Linear", true);
        var tween = phgame.add.tween(item).to( { alpha: 0, y: y - 160 }, 600, "Linear", true);
        tween.onComplete.add(function(){
            item.alpha = 0;
            console.log("combo total: " + this.list.length);
        }, this);
    },
    hide: function(){
        this.phmoreHit.hide();
    },
    getActiveItem: function(){
        for(var i = 0; i < this.list.length; i++){
            if(this.list[i].alpha === 0){
                return this.list[i];
            }
        }
        //var item = phgame.add.text(0, 0, "combox1", { font: "24px Arial Black", fill: "#c51b7d" });
        var item = phgame.add.bitmapText(0, 0, 'comboxfont', '', 64);
        //item.setText("combox" + this.total);
        //item.stroke = "#de77ae";
        //item.strokeThickness = 8;
        item.anchor.set(0.5, 0.5);
        this.group.addChild(item);
        this.list.push(item);
        return item;
    }
};