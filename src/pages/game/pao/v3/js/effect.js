function Effect(div){
    /*
    this.div = div;
    this.div.style.display = "none";
    this.timer = 0;
    this.ftxt = $(".ftxt")[0];
    this.btxt = $(".btxt")[0];
    */
    //this.item = phgame.add.bitmapText(0, 0, 'comboxfont', '', 64);
    //item.setText("combox" + this.total);
    //item.stroke = "#de77ae";
    //item.strokeThickness = 8;
    //this.item.anchor.set(0.5, 0.5);
    this.timer = 0;
}

Effect.prototype.show = function(x, y, num){
    /*
    this.ftxt.innerHTML = "+" + num;
    this.btxt.innerHTML = "+" + num;
    window.clearTimeout(this.timer);
    var style = this.div.style;
    style.left = x + "px";
    style.top = y -36 + "px";
    style.display = "none";
    this.timer = window.setTimeout(function(){
        style.display = "block";
    }, 30);
    */
    var n = changeMoney(num);
    if(n === "0.00"){
        return;
    }
    if(!this.item){
        this.item = phgame.add.bitmapText(0, 0, 'comboxfont', '', 64);
        this.item.anchor.set(0.5, 0.5);
    }
    this.item.setText("+" + n + "$");
    this.item.alpha = 1;
    this.item.x = x;
    this.item.y = y - 100;
    phgame.add.tween(this.item).to( { alpha: 0, y: y - 120 }, 600, "Linear", true);
    this.timer = window.setTimeout(function(){
        //style.display = "block";
    }, 30);
}