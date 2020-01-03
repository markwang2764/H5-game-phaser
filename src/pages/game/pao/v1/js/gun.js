function Gun(scale, div){
    this.x = 370 * scale;
    this.y = 1080 * scale;
    
    this.div = div;
    this.bomb = new Bomb($(".bomb")[0]);
    this.fire = $(".fire")[0];
    this.fire.style.display = "none";
    this.timer = 0;
    this.type = 0;
    this.list = store.getGuns(CFG.guns);
    this.txt = $(".pao-num")[0];
    this.update();
}

Gun.prototype.getImage = function(){
    var level = 0;
    var num = this.getValue();
    if(num > 500){
        level = 2;
    }
    else if(num > 200){
        level = 1;
    }
    else{
        level = 0;
    }
    return store.getGunImage(level);
}

Gun.prototype.getValue = function(){
    return this.list[this.type];
}

Gun.prototype.add = function(){
    if(++this.type >= this.list.length){
        this.type = 0;
    }
    this.update();
}

Gun.prototype.cut = function(){
    if(--this.type < 0){
        this.type = this.list.length - 1;
    }
    this.update();
}

Gun.prototype.update = function(){
    //var n = [10, 100, 1000][this.type];
    //this.div.setAttribute("class", "pao pao-" + n);
    this.div.style.backgroundImage = "url(" + this.getImage() + ")";
    this.txt.innerHTML = this.getValue();
}

Gun.prototype.play = function(clientX, clientY){
    var x = clientX - this.x;
    var y = clientY - this.y;
    var r = 0 - Math.atan(x / y) * 180 / Math.PI;
    this.div.style.transform = "rotate(" + r + "deg)";

    window.clearTimeout(this.timer);
    var style = this.fire.style;
    style.display = "block";
    this.timer = setTimeout(function(){
        style.display = "none";
    }, 300);
}

Gun.prototype.showBoom = function(clientX, clientY){
    this.bomb.play(clientX, clientY);
}