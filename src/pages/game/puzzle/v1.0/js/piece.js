function Piece(div, startx, starty, w, h){
    this.div = div;
    this.startx = startx;//起始x位置
    this.starty = starty;//起始y位置
    this.potx = startx;//当前x位置
    this.poty = starty;//当前y位置
    this.w = w;
    this.h = h;
    this.init();
}

Piece.prototype.center = function(x, y){
    var oldx = this.potx;
    var oldy = this.poty;
    this.potx = x;
    this.poty = y;
    this.update();

    setTimeout(() => {
        this.potx = oldx;
        this.poty = oldy;
        this.update();
    }, 1200);
}

Piece.prototype.init = function(){
    var x = this.startx * this.w;
    var y = this.starty * this.h;
    this.div.style.backgroundPosition = `${-x}rem ${-y}rem`;
    this.div.style.width = `${this.w - 0.02}rem`;
    this.div.style.height = `${this.h - 0.02}rem`;
}

Piece.prototype.over = function(){
    this.div.style.width = `${this.w + 0.01}rem`;
    this.div.style.height = `${this.h + 0.01}rem`;
}

Piece.prototype.isRight = function(){
    return this.startx == this.potx && this.starty == this.poty;
}

Piece.prototype.select = function(n){
    if(n){
        this.div.setAttribute("class", "piece-item selected");
    }
    else{
        this.div.setAttribute("class", "piece-item");
    }
}

Piece.prototype.update = function(){
    var x = this.potx * this.w;
    var y = this.poty * this.h;
    this.div.style.transform = `translate(${x}rem, ${y}rem)`;
}