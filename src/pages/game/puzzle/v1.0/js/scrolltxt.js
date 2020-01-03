function ScrollTxt(div, y){
    this.div = div;
    this.y = y;
    this.max = 0;
}

ScrollTxt.prototype.update = function(max){
    this.y -= 0.002;
    this.div.style.transform = `translateY(${this.y}rem)`;
    if(this.y < -0.2){
        this.y = max + 0.2;
    }
}