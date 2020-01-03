function Score(div){
    this.div = div;
    //this.num = store.amount;
}

Score.prototype.update = function(){
    this.div.innerHTML = '本局金币：' +  store.amountGet;
}

Score.prototype.init = function(){
    console.log("init");
    this.div.innerHTML = '本局金币：' +  store.amountGet;
}

Score.prototype.add = function(n){
    //this.num += n;
    store.amountGet += n;
    //this.div.innerHTML = this.num;
}