/*
 * @Author: 江思志 
 * @Date: 2018-03-26 19:07:59 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-04-16 14:45:05
 * 数据缓存
 */
function Cache(){
    this.resultData = this.getData("resultData");
    this.trickData = this.getData("trickData");
}

Cache.prototype.init = function(){

};

Cache.prototype.saveResultData = function(data){
    this.resultData = data;
    this.setData("resultData", data);
};

Cache.prototype.saveTrickData = function(data){
    this.trickData = data;
    this.setData("trickData", data);
};

Cache.prototype.getData = function(key){
    var obj = localStorage.getItem(key);
    if(obj){
        return JSON.parse(obj);
    }
    return null;
};

Cache.prototype.setData = function(key, obj){
    localStorage.setItem(key, JSON.stringify(obj));
};

Cache.prototype.getState = function(){
    var n = localStorage.getItem("state");
    if(n){
        return parseInt(n);
    }
    return 0;
};

Cache.prototype.setState = function(n, tip){
    console.log(`${tip} => [${n}]`);
    localStorage.setItem("state", n);
};