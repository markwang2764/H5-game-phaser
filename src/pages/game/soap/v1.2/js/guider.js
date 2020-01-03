/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:25:55 
 * @Last Modified by:   江思志 
 * @Last Modified time: 2018-03-21 10:25:55 
 * 新手引导
 */
function Guider(){
    this.guiding = this.getState(store.nickName);//false 已经展示过， true 未展示
}

Guider.prototype.show = function(){
    if(this.guiding){
        var obj = {x: 400, y: 0, r: 1200};
        createjs.Tween.get(obj).to({x: 96, y: 866, r: 80}, 600, createjs.Ease.quadInout).addEventListener("change", ()=>{
            this.draw(obj.x, obj.y, obj.r);
        });
        document.getElementById("guider").style.display = "block";
        document.getElementById("guider-tip").style.display = "block";
        this.guiding = false;
    }
};

Guider.prototype.hide = function(){
    document.getElementById("guider").style.display = "none";
    document.getElementById("guider-tip").style.display = "none";
};

Guider.prototype.draw = function(x, y, r){
    var canvas = document.getElementById("guider");
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, 750, 1206);
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 750, 1206);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
};

Guider.prototype.getState = function(nickName){
    var app = getParamUrl("id");
    var names = localStorage.getItem(app);
    nickName = nickName ? nickName : "0";
    if(!names){
        var list = [nickName];
        var str = encodeURIComponent(JSON.stringify(list));
        localStorage.setItem(app, str);
        return true;
    }

    var str = decodeURIComponent(names);
    var list = JSON.parse(str);
    if(list.indexOf(nickName) == -1){
        list.push(nickName);
        var str = encodeURIComponent(JSON.stringify(list));
        localStorage.setItem(app, str);
        return true;
    }
    
    return false;
};