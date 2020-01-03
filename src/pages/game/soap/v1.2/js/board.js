/*
 * @Author: 江思志 
 * @Date: 2018-03-21 11:04:28 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-04-13 15:15:08
 * 道具广告牌
 */
function Board(){
    this.$div = $(".board-content");
    this.init();
}

Board.prototype.init = function(){

};

Board.prototype.show = function(url){
    /*
    this.$div.show();
    if(url){
        $(".item-1690088").css("background-image", `url(${url})`);
        $(".board").addClass("hander");
    }
    else{
        $(".item-1690088").css("background-image", `url(${url})`);
    }
    */
    
	var queue = new createjs.LoadQueue(false);
	queue.addEventListener("fileload", (evt)=>{
		if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
	});
	queue.addEventListener("complete", ()=>{
        var image = queue.getResult("ads");
		var bmp = new createjs.Bitmap(image);
		if(image.width/image.height > 504/230){
            bmp.scaleX = bmp.scaleY = 230/image.height;
            bmp.x = (504 - image.width * bmp.scaleX)/2;
        }
        else{
            bmp.scaleX = bmp.scaleY = 504/image.width;
            bmp.y = (230 - image.height * bmp.scaleY)/2;
        }
        var exportRoot = new lib.mc_use();
        game.stage.addChild(exportRoot);
        setTimeout(() => {
            //exportRoot.children[1].instance.addChild(new createjs.Bitmap(image));
            exportRoot.instance.children[1].addChild(bmp);
        }, 30);
        if(game.scene.soap){
            game.scene.soap.visible = false;
        }
	});
	queue.loadFile({id:"ads", src:url});
};

Board.prototype.hide = function(){
    this.$div.hide();
};