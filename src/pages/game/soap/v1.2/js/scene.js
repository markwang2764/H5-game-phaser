/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:27:51 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-04-16 13:32:26
 * 游戏场景
 */
function Scene(){
    this.background = null;
    this.sid = 1;
    this.view = new createjs.Container();
    this.imageheight = 0;
    this.stageheight = 0;
    this.soap = null;
    this.idList = [1, 2, 3, 4, 5, 6];
    this.listId = 0;
}

Scene.prototype.getRandom = function(){
    /*
    this.idList.sort(()=>{
        return Math.random() > 0.5;
    });
    
    var num = this.idList.find((value)=>{
        return value != this.sid;
    });
    return num;
    */
    
    if(++this.listId >= 7){
        this.listId = 1;
    }
    return this.listId;
    
};

Scene.prototype.init = function(n){
    console.log("scene" + n);
    this.sid = n ? n : localStorage.getItem("sceneId");
    //this.background = new createjs.Bitmap(images["long_" + this.sid]);
    //this.background.y = 1206 - this.background.image.height;
    this.view.y = 0;
    localStorage.setItem("sceneId", this.sid);

    images._long = images["long_" + this.sid];

    this.imageheight = images.long_1.height;
    this.stageheight = 1206;
    
    if(!n){
        this.view.removeAllChildren();
        var sceneState = localStorage.getItem("sceneState") || "fly";
        this.view.addChild(new lib[`mc_${sceneState + this.sid}`](null, null, false));
        
        if(sceneState == "fly"){
            setTimeout(()=>{
                this.soap = this.getSoap();
                if(this.soap){
                    this.soap.y = -600;
                }
            }, 60);
            this.view.y = Number(localStorage.getItem("sceney"));
            this.view.children[0].stop();
        }
        else{
            this.view.children[0].gotoAndStop(18);
        }
    }
};

Scene.prototype.getSoap = function(){
    var children = this.view.children[0].children;
    for(var i = 0; i < children.length; i++){
        var instance = children[i].children ? children[i].children[0] : null;
        if(instance && instance.image){
            console.log(instance.image.src);
            if(instance.image.src.indexOf("nfeizao.png") != -1){
                return children[i];
            }
        }
    }
    return null;
};

Scene.prototype.play = function(flash){
    this.view.removeAllChildren();
    //this.view.addChild(this.background);

    if(game.cache.getState() > 0 || localStorage.getItem("autoJump") == 2){
        //this.background.y = Number(localStorage.getItem("sceney"));
    }
    else{
        //this.view.addChild(flash);
        this.view.addChild(new lib[`mc_${flash + this.sid}`](null, null, flash == "wait"));
        if(flash == "fly"){
            setTimeout(()=>{
                this.soap = this.getSoap();
                setTimeout(() => {
                    this.changeFace(images.qq3);

                    this.view.onTick = ()=>{
                        this.update();
                    }
                }, 300);

                if(flyAim < -900){
                    setTimeout(() => {
                        this.changeFace(images.qq6);
                    }, 1600);
                }
                else{
                    setTimeout(() => {
                        this.changeFace(images.qq4);
                    }, 1600);
                }
            }, 60);
     
            /*
            this.view.onTick = ()=>{
                this.update();
            }
            */

            setTimeout(() => {
                this.view.onTick = null;
                localStorage.setItem("sceney", this.view.y);
            }, 4200);
        }
    }
    localStorage.setItem("sceneState", flash);
};

Scene.prototype.move = function(suc){
    var aim = 0;
    if(suc){
        //createjs.Tween.get(this.background).wait(500).to({y:this.background.y * 0.3}, 1800, createjs.Ease.linear).to({y:0}, 1200, createjs.Ease.circOut);
        
        
        //createjs.Tween.get(this.background).wait(500).to({y:0}, 2100, createjs.Ease.linear);
    }
    else{
        //aim = this.background.y * 0.4;
        //createjs.Tween.get(this.background).wait(500).to({y:aim}, 1800, createjs.Ease.linear);
    }
    localStorage.setItem("sceney", aim);
};

Scene.prototype.changeFace = function(img){
    if(this.soap){
        this.soap.children[0].image = img;
    }
}

Scene.prototype.update = function(){
	if(this.soap){
        var num = 700 - this.soap.y;
		if(num < this.imageheight - this.stageheight){
            //this.view.y += (num - this.view.y) * 0.8;
            this.view.y = num;
        }
	}
};

Scene.prototype.playJump = function(){
    //cjs.Tween.get(this.soap).wait(100).to({y:442.1},0).to({y:368.1},3).to({y:-185.8},8).wait(39);

    /*
    var num = this.soap.y;
    console.log("--" + num);
    createjs.Tween.get(this.soap).wait(1320).to({y:num-200}, 90, createjs.Ease.linear).to({y:num-800}, 300);
    */
};