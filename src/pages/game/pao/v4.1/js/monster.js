function Monster(div, id){
    this.div = div;
    this.div.setAttribute("data-id", id);
    this.monsterType = 0;
    this.hitting = false;
    this.hitCounter = 0;
}

/*
private Integer level;//等级
private String imgUrl;//psd
private Integer proportion;//占比
private Integer prizeAmount;//金额
private Integer monsterType;//类型
*/

Monster.prototype.init = function(x, y){
    this.x = x;
    this.y = y;
    this.original = y;
    this.timer = Math.random();
    this.max = Math.random() * 4 + 2;
    this.move(0);
}

Monster.prototype.getPrizeAmount = function(){
    return store.monsters[this.monsterType - 1].prizeAmount;
}

Monster.prototype.setMonsterType = function(type){
    this.monsterType = type;
    this.width = store.monsters[type - 1].width;
    this.div.setAttribute("class", "monster monster" + type);
    this.div.innerHTML = "";
    this.hitting = false;
    this.hitCounter = 0;
}

Monster.prototype.hide = function(){
    this.div.style.display = "none";
}

Monster.prototype.show = function(){
    this.div.style.display = "block";
}

Monster.prototype.move = function(v){
    this.timer += 0.3;
    this.x += v;
    this.y = this.original + Math.sin(this.timer) * this.max;
    var aimx = this.x;
    var aimy = this.y;
    if(this.hitting){
        if(++this.hitCounter > 9){
            this.hitCounter = 0;
            this.hitting = false;
        }
        aimx += (0.5 - Math.random()) * 6;
        aimy += (0.5 - Math.random()) * 6;
    }
    this.div.style.transform = `translate3d(${aimx}px,${aimy}px,1px)`;
}

Monster.prototype.addHit = function(){
    this.hitting = true;
    this.hitCounter = 0;
}

Monster.prototype.addTape = function(){
    var div = document.createElement("div");
    var x = (10 + Math.random() * 80) / 200;
    var y = (20 + Math.random() * 80) / 200;
    div.setAttribute("class", "tape");
    div.style.transform = "translate(" + x + "rem, " + y + "rem)";
    this.div.appendChild(div);
}