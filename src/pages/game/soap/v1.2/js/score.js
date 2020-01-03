/*
 * @Author: 江思志 
 * @Date: 2018-03-21 14:22:12 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-03-26 21:29:28
 * 积分
 */
function Score(){
    this.$div = $(".my-score");
    this.$txt = $(".score-txt");
    this.total = 0;
    this.init();
}

Score.prototype.reset = function(){
    this.total = 0;
    this.show();
};

Score.prototype.init = function(){
    this.show();
};

Score.prototype.readCache = function(){
    this.total = getDefaultSave("score", 0);
    this.show();
};

Score.prototype.add = function(n){
    this.total += n;
    this.show();
    localStorage.setItem("score", this.total);
};

Score.prototype.show = function(){
    this.$div.show();
    this.$txt.html("距离：" + this.total + "m");
};

Score.prototype.hide = function(){
    this.$div.hide();
};