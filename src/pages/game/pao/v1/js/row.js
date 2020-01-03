function Row(v, scale, offset){
    this.v = v;
    this.scale = scale;
    this.list = [];
    this.min = 0;
    this.max = 0;
    this.offset = offset;
    this.space = 100;
}

Row.prototype.reset = function(){
    this.min = 0;
    this.max = 0;
    this.list = [];
}

Row.prototype.showGuider = function(callback, $this){
    if(!$this){
        $this = this;
    }
    var monster = $this.getCenterMonster();
    if(monster){
        callback(monster);
    }
    else{
        setTimeout($this.showGuider, 300, callback, $this);
    }
}

Row.prototype.getCenterMonster = function(){
    var len = this.list.length;
    for(var i = 0; i < len; i++){
        if(this.list[i].x > 90 && this.list[i].x < 240){
            return this.list[i];
        }
    }
    return null;
}

Row.prototype.addMonster = function(monster){
    monster.setMonsterType(this.dispense());
    if(this.v < 0){
        if(this.max == 0){
            this.max = this.offset + 750 * this.scale;
        }
        monster.init(this.max + this.space * this.scale, 0);
        this.max = monster.x + monster.width * this.scale;
    }
    else{
        if(this.min == 0){
            this.min = this.offset;
        }
        monster.init(this.min - (monster.width + this.space) * this.scale, 0);
        this.min = monster.x;
    }
    this.list.push(monster);
}

Row.prototype.update = function(){
    var len = this.list.length;
    this.max = 0;
    this.min = 750;

    this.list.forEach((monster)=>{
        var os = monster.width * this.scale;
        if(this.v < 0){
            if(this.max < monster.x){
                this.max = monster.x + os;
            }
        }
        else{
            if(this.min > monster.x){
                this.min = monster.x;
            }
        }
    });
    
    this.list.forEach((monster)=>{
        if(this.v < 0){
            if(monster.x < -150 * this.scale){
                monster.setMonsterType(this.dispense());
                monster.x = this.max + this.space * this.scale;
                monster.show();
            }
        }
        else{
            if(monster.x > 900 * this.scale){
                monster.setMonsterType(this.dispense());
                monster.x = this.min - (this.space + monster.width) * this.scale;
                monster.show();
            }
        }
        monster.move(this.v);
    });
}

Row.prototype.dispense = function(){
    return store.dispense();
}