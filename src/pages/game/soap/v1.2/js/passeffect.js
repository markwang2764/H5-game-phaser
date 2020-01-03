function PassEffect(){
    this.$div = $('<canvas class="passani"></canvas>').appendTo(document.body);
    this.$txt = $('<div class="passtip"></div>').appendTo(document.body);
    this.$div[0].width = 750;
    this.$div[0].height = 1206;
    this.hide();
}

PassEffect.prototype.show = function(n){
    this.$txt.html("关卡" + n).show();
    var scene = new lib.pass();
    this.stage = new createjs.Stage(this.$div[0]);
    this.stage.addChild(scene);

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", this.stage);

    this.$div.show();
    setTimeout(()=>{
        this.hide();
    }, 1200);
};

PassEffect.prototype.hide = function(){
    this.$txt.hide();
    this.$div.hide();
    createjs.Ticker.removeEventListener("tick", this.stage);
    this.stage = null;
};