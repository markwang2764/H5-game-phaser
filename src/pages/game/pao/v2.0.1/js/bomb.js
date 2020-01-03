function Bomb(div){
    this.div = div;
    this.div.style.display = "none";
    this.timer = 0;
}

Bomb.prototype.play = function(x, y){
    window.clearTimeout(this.timer);
    var style = this.div.style;
    style.display = "block";
    style.transform = "translate(" + x + "px, " + y + "px)";
    this.timer = window.setTimeout(function(){
        style.display = "none";
    }, 400);
}