function Amount(div){
  this.div = div;
  //this.num = store.amount;
}

Amount.prototype.update = function(){
  this.div.innerHTML =  convertNumber(store.amount);
}

Amount.prototype.init = function(){
  this.div.innerHTML = convertNumber(store.amount);
}

 