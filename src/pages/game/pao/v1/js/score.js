function Score(div){
    this.div = div;
    //this.num = store.amount;
}

Score.prototype.update = function(){
    this.div.innerHTML = store.amount;
}

Score.prototype.init = function(){
    this.div.innerHTML = store.amount;
}

Score.prototype.add = function(n){
    //this.num += n;
    store.amount += n;
    //this.div.innerHTML = this.num;
}