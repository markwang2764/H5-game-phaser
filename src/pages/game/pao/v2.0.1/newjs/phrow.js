function Phrow(direction, x, y, id, useGuider){
    this.useGuider = useGuider;
    this.id = id;
    this.x = x;
    this.y = y;
    this.total = 5;
    this.direction = direction;
    this.list = [];
    this.fast = false;
    this.signal = new Phaser.Signal();
    this.init();
}

Phrow.prototype = {
    init: function(){
        if(this.direction === 1){
            this.toRight();
        }else{
            this.toLeft();
        }
    },
    over: function(){
        this.list.forEach(function(item){
            item.hide();
        });
    },
    leave: function(){
        this.fast = true;
        this.list.forEach(function(item){
            item.leave();
        });
    },
    reset: function(){
        this.fast = false;
        if(this.direction === 1){
            this.orderRight();
        }else{
            this.orderLeft();
        }
    },
    orderRight: function(){
        var min = this.x;
        for(var i = 0; i < this.list.length; i++){
            var phmonster = this.list[i];
            phmonster.visible = true;
            phmonster.reset(this.getRandomLevel());
            if(i === 0){
                phmonster.x = min - phmonster.width / 2;
            }
            else{
                phmonster.x = min - 80 - phmonster.width / 2;
            }
            phmonster.y = this.y;
            min = phmonster.x - phmonster.width / 2;
            phmonster.group.x = phmonster.x;
        }
    },
    orderLeft: function(){
        var max = STAGE_WIDTH + this.x;
        for(var i = 0; i < this.list.length; i++){
            var phmonster = this.list[i];
            phmonster.reset(this.getRandomLevel());
            if(i === 0){
                phmonster.x = max + phmonster.width / 2;
            }
            else{
                phmonster.x = max + 80 + phmonster.width / 2;
            }
            phmonster.y = this.y;
            max = phmonster.x + phmonster.width / 2;
            phmonster.group.x = phmonster.x;
        }
    },
    toRight: function(){
        var min = this.x;
        for(var i = 0; i < this.total; i++){
            var level = this.getRandomLevel();
            var phmonster = new Phmonster(this.id, level, this.signal, i, this.direction);
            if(i === 0){
                phmonster.x = min - phmonster.width / 2;
            }
            else{
                phmonster.x = min - 80 - phmonster.width / 2;
            }
            phmonster.y = this.y;
            min = phmonster.x - phmonster.width / 2;
            this.list.push(phmonster);
        }
        this.signal.add(function(data){
            if(!this.fast){
                var min = this.getMin();
                var phmonster = this.list[data.id];
                phmonster.setLevel(this.getRandomLevel());
                phmonster.x = min - 80 - phmonster.width / 2;
                phmonster.group.x = phmonster.x;
            }
        }, this);
    },
    toLeft: function(){
        var max = STAGE_WIDTH + this.x;
        for(var i = 0; i < this.total; i++){
            var level = this.getRandomLevel();
            var phmonster = new Phmonster(this.id, level, this.signal, i, this.direction);
            if(i === 0){
                phmonster.x = max + phmonster.width / 2;
            }
            else{
                phmonster.x = max + 80 + phmonster.width / 2;
            }
            phmonster.y = this.y;
            max = phmonster.x + phmonster.width / 2;
            this.list.push(phmonster);
        }
        this.signal.add(function(data){
            if(!this.fast){
                var max = this.getMax();
                var phmonster = this.list[data.id];
                phmonster.setLevel(this.getRandomLevel());
                phmonster.x = max + 80 + phmonster.width / 2;
                phmonster.group.x = phmonster.x;
            }
        }, this);
    },
    getMin: function(){
        var min = 300;
        this.list.forEach(function(item){
            if(item.x < min){
                min = item.x - item.width / 2;
            }
        });
        return min;
    },
    getMax: function(){
        var max = 300;
        this.list.forEach(function(item){
            if(item.x > max){
                max = item.x + item.width / 2;
            }
        });
        return max;
    },
    getRandomLevel: function(){
        //var level = Math.floor(Math.random() * 6 + 1);
        var level = store.dispense();
        return level;
    },
    getMonster: function(id){
        return this.list[id];
    },
    move: function(){
        for(var i = 0; i < this.list.length; i++){
            this.list[i].move();
            if(this.useGuider){
                if(this.list[i].x > 200){
                    this.useGuider = false;
                    hitSignal.dispatch({type: "show_guider", x: this.list[i].x, y: this.list[i].y - this.list[i].sprite.height / 2, aim: this.list[i]});
                }
            }
        }
    }
};