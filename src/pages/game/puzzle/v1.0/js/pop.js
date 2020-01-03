function Pop(){
    
}

Pop.prototype.init = function(sel){
    var $div = $(sel);
    this.div = $div[0];
    this.display = $div.css('display');
    this.zIndex = $div.css('z-index');
}

Pop.prototype.show = function(){
    this.div.style.display = this.display;
    this.div.style.zIndex = 4;
}

Pop.prototype.hide = function(){
    this.div.style.display = 'none';
    this.div.style.zIndex = this.zIndex;
}