function Pheffect(){
    this.list = [];
    this.group = phgame.add.group();
}

Pheffect.prototype = {
    show: function(x, y, num){
        for(var i = 0; i < num; i++){
            var item = this.getActiveItem();
            item.show(x, y, i % 2);
        }
        console.log("coin total: " + this.list.length);
    },
    hide: function(){
        this.list.forEach(element => {
            element.hide();
        });
    },
    getActiveItem: function(){
        for(var i = 0; i < this.list.length; i++){
            if(!this.list[i].playing){
                return this.list[i];
            }
        }
        var item = new Phcoin(this.group);
        this.list.push(item);
        return item;
    },
    move: function(){
        for(var i = 0; i < this.list.length; i++){
            this.list[i].move();
        }
    }
};