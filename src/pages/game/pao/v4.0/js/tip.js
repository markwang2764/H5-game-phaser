function Tip(div, img, name, money){
    this.div = div;
    this.img = img;
    this.name = name;
    this.money = money;
    this.div.style.display = "none";
    this.timerId = 0;
    this.count = 0;
    this.tid = 0;
    this.tlist = [];
    this.monsterType = 0;
    this.monsterHit = 0;
}

Tip.prototype.hit = function(monsterType){
    if(monsterType == this.monsterType){
        if(++this.monsterHit >= 16){
            this.showSelf();
        }
    }
    else{
        this.monsterType = monsterType;
        this.monsterHit = 0; 
    }
    if(store.monsters[monsterType - 1].prizeAmount >= 500){
        this.showSelf(store.monsters[monsterType - 1].prizeAmount);
    }
}

Tip.prototype.init = function(list){
    this.tid = 0;
    this.tlist = list;
}

Tip.prototype.show = function(data){
    this.div.style.display = "flex";
    $(".tip").html(dataTemplate("tip", data));

    clearTimeout(this.timerId);
    this.timerId = setTimeout(function($this){
        $this.div.style.display = "none";
    }, 3600, this);
}

Tip.prototype.showSelf = function(max){
    clearTimeout(this.timerId);
    this.div.style.display = "none";
    this.count = 0;
    var word = "*" + this.monsterHit + "，得到“糖见愁”封号!";
    if(max){
        word = "得到" + max + "金币!";
    }
    setTimeout(function($this){
        var data = {
            name: "玩家" + store.nickName + "击杀",
            url: store.monsters[$this.monsterType - 1].imgUrl,
            word: word
        }
        $this.show(data);
    }, 30, this);
}

Tip.prototype.showKillBoss = function(){
    clearTimeout(this.timerId);
    this.div.style.display = "none";
    this.count = 0;
    var word = store.boss.prizeAmount + "金币收入囊中";
    setTimeout(function($this){
        var data = {
            name: "玩家" + store.nickName + "成功击杀",
            url: store.boss.imgUrl,
            word: word
        }
        $this.show(data);
    }, 30, this);
}

Tip.prototype.update = function(){
    if(++this.count > 300){
        this.count = 0;
        if(this.tlist.length > 0){
            var data = this.getTipData();
            this.show(data);
        }
    }
}

Tip.prototype.getTipData = function(){
    var str = this.tlist.pop();
    var list = str.split(/\[\d+\]/);
    var match = str.match(/\[(\d+)\]/);
    var id = parseInt(match[1]);
    var obj = {
        name: list[0],
        url: id == "1000" ? store.boss.imgUrl : store.monsters[id - 1].imgUrl,
        word: list[1]
    }
    return obj;
}