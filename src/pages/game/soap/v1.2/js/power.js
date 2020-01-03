/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:26:44 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-03-29 00:36:31
 * 力度条
 */
function Power(){
    this.graphic = null;
    this.slider = null;
    this.view = null;
    this.w = 20,
    this.h = 230;
    this.tid = 0;
    this.time = 0;
    this.speedTime = 0;

    this.green = null;
    this.greenMin = 0;
    this.greenSpace = 0;
    this.greenHeight = 0;

    this.redMin = 0;
    this.redMax = 0;

    this.score = 0;
    
    this.move = false;
    this.moveSpeed = 0;
}

Power.prototype.init = function(x, y, img, move, moveSpeed){
    this.move = move;
    this.moveSpeed = moveSpeed;

    var graphic = new createjs.Graphics().setStrokeStyle(4).beginStroke("#405261").beginFill("#ffffff").drawRoundRectComplex(0, 0, 30, 240, 16, 16, 16, 16);
    var background = new createjs.Shape(graphic);

    this.slider = new createjs.Bitmap(img);
    this.slider.x = 15 - this.slider.image.width / 2;

    this.graphic = new createjs.Graphics();
    var color = new createjs.Shape(this.graphic);
    var shape = new createjs.Container();
    shape.x = 5;
    shape.y = 5;
    shape.mask = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRoundRectComplex(5, 5, 20, 230, 16, 16, 16, 16));
    shape.addChild(color);
  
    this.green = new createjs.Shape();
    shape.addChild(this.green);

    this.view = new createjs.Container();
    this.view.x = x;
    this.view.y = y;
    this.view.addChild(background);
    this.view.addChild(shape);
    this.view.addChild(this.slider);
};

Power.prototype.draw = function(a, b, c){
    var ch = (b + c) * this.h / 100;
    var lh = c * this.h / 100;
    var cy = this.h / 2 - ch / 2;
    var ly = this.h / 2 - lh / 2;
    this.graphic.beginFill("#ff0000").drawRect(0, 0, this.w, this.h);
    this.graphic.beginFill("#ffc107").drawRect(0, cy, this.w, ch);

    this.green.graphics = new createjs.Graphics();
    this.green.graphics.beginFill("#22bd29").drawRect(0, 0, this.w, lh);
    this.green.y = ly;

    this.greenMin = cy;
    this.greenSpace = ch - lh;
    this.greenHeight = lh;

    this.redMin = cy;
    this.redMax = cy + ch;

    if(game.cache.getState() > 0 || localStorage.getItem("autoJump") == 2){
        this.slider.y = Number(localStorage.getItem("slidery"));
        this.green.y = Number(localStorage.getItem("greeny"));
    }
    else{
        this.tid = setInterval(()=>{
            this.play();
        }, 30);
    }
};

Power.prototype.play = function(){
    this.time += 0.09;
    this.slider.y = this.h * 0.5 * (Math.sin(this.time) + 1) - this.slider.image.height / 2 + 5;

    if(this.move){
        this.speedTime += 0.02 * this.moveSpeed;
        var n = Math.cos(this.speedTime);
        //var n = Math.cos(this.time) * this.moveSpeed;
        this.green.y = this.greenMin + Math.abs(n) * this.greenSpace;
    }
};

Power.prototype.save = function(){
    localStorage.setItem("slidery", this.slider.y);
    localStorage.setItem("greeny", this.green.y);
    localStorage.setItem("power", this.score);
};

Power.prototype.stop = function(){
    var y = this.slider.y + 4;
    if(y <= this.redMin || y >= this.redMax){
        console.log("红色");
        this.score = 0;
    }
    else if(y >= this.green.y && y < this.green.y + this.greenHeight){
        console.log("绿色");
        this.score = 10 - Math.floor(Math.abs((y - (this.green.y + this.greenHeight / 2)) / (this.greenHeight / 2)) * 5);
    }
    else{
        console.log("橙色");
        if(y > this.green.y){
            this.score = 5 - Math.floor((y - this.green.y - this.greenHeight) / (this.redMax - this.green.y - this.greenHeight) * 5);
        }
        else{
            this.score = 5 - Math.floor((this.green.y - y) / (this.green.y - this.redMin) * 5);
        }
    }
    console.log(this.score);
    clearInterval(this.tid);
    this.save();
};