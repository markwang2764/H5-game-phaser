function Soap(){
    this.view = null;
}

Soap.prototype.init = function(){
    this.view = new createjs.Bitmap(images["feizao"]);
    this.view.x = 300;
};

Soap.prototype.readCache = function(cache){
    if(cache){
        this.view.y = Number(localStorage.getItem("soapy"));
    }
    else{
        this.view.y = 624;
        this.view.alpha = 0;
    }
};

Soap.prototype.playGreen = function(aim){
    createjs.Tween.get(this.view).to({y:100, alpha: 1}, 300, createjs.Ease.quadOut).to({y:aim}, 3200, createjs.Ease.backIn);
    this.view.image = images["qq3"];
    localStorage.setItem("soapy", aim);
    setTimeout(()=>{
        this.view.image = images["qq6"];
    }, 2400);
};

Soap.prototype.playYellow = function(aim){
    createjs.Tween.get(this.view).to({y:100, alpha: 1}, 300, createjs.Ease.linear).to({y:aim}, 2400);
    this.view.image = images["qq3"];
    localStorage.setItem("soapy", aim);
    setTimeout(()=>{
        this.view.image = images["qq4"];
    }, 2400);
};

Soap.prototype.playRed = function(aim){
    if(Math.random() > 0){
        createjs.Tween.get(this.view).to({y:100, alpha: 1}, 300, createjs.Ease.quadOut).to({y:aim}, 900, createjs.Ease.quadOut);
        this.view.image = images["qq3"];
        setTimeout(()=>{
            this.view.image = images["qq4"];
        }, 900);
    }
    else{
        this.view.image = images["qq7"];
    }
    localStorage.setItem("soapy", aim);
};

Soap.prototype.playJump = function(){
    if(!this.view){
        this.init();
    }
    //createjs.Tween.get(this.view).to({y:this.view.y}, 360, createjs.Ease.quadIn).to({y:this.view.y - 90}, 90, createjs.Ease.quadInout).to({y:-840}, 400, createjs.Ease.quadInout);
    createjs.Tween.get(this.view).to({y:this.view.y}, 480, createjs.Ease.quadIn).to({y:this.view.y - 74}, 90, createjs.Ease.quadInout).to({y:-840}, 400, createjs.Ease.quadInout);
    this.view.image = images["qq5"];
};