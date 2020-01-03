function Effect(div){
    this.div = div;
    this.div.style.display = "none";
    this.timer = 0;
    this.ftxt = $(".ftxt")[0];
    this.btxt = $(".btxt")[0];
}

Effect.prototype.show = function(x, y, num){
    //this.div.innerHTML = "+" + num;
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
}