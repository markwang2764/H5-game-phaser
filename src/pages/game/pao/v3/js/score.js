function Score(div){
    this.div = div;
    //this.num = store.amount;
}

Score.prototype.update = function(){
    this.div.innerHTML = '本局收入：' + changeMoney(store.amountGet) + "元";
}

Score.prototype.init = function(){
    store.amountGet = 0;
    this.div.innerHTML = '本局收入：' + changeMoney(store.amountGet) + "元";
}

Score.prototype.add = function(n){
    //this.num += n;
    store.amountGet += n;
    // store.amount += n;
    //this.div.innerHTML = this.num;
}