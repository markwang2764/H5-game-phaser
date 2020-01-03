/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:28:26 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-04-16 14:54:00
 * 个人成绩单
 */
function Result(){
    this.$div = $(".score-mask");
    this.callback = null;
    this.data = null;
    this.init();
}

Result.prototype.init = function(){
    
    function isWeixn(){  
        var ua = navigator.userAgent.toLowerCase();  
        if(ua.match(/MicroMessenger/i) == "micromessenger") {  
            return true;  
        } else {  
            return false;  
        }  
    }

    if(!isWeixn()){
        $(".item-8375527").addClass("no-weixin");
        $(".item-8381327").hide();
    }

    //再挤一次
    $(".item-8375527").click(()=>{
        embed.singleClk("soapyAgainClick");
        this.hide();
        this.callback && this.callback(0);
    })

    //生成好友PK
    $(".item-8381327").click(()=>{
        embed.singleClk("initPKClick");
        this.callback && this.callback(1);
    })
};

Result.prototype.show = function(callback){
    //this.$div.addClass("new-history");
    //this.data = game.over.data;
    this.data = game.cache.resultData;
    this.$div.show();
    $(".item-8352615").html(dataTemplate("level-info", this.data));
    $(".item-8428407").html(this.data.score + "m");
    $(".item-0079162").html(this.data.rank);
    $(".item-8475431").html(this.data.historyTopScore + "m");
    this.callback = callback;

    var s = game.score.total / (store.curLevel * 10);
    if(s < 0.3){
        $(".item-8334815").attr("class", "item-8334815 xing1");
    }
    else if(s >= 0.3 && s < 0.8){
        $(".item-8334815").attr("class", "item-8334815 xing2");
    }
    else if(s >= 0.8){
        $(".item-8334815").attr("class", "item-8334815 xing3");
    }

    if(this.data.type == 0){
        $(".item-8334815").html('<div class="result-tip-next"></div>');
    }
    else if(this.data.type == 1){
        $(".item-8334815").html('<div class="result-tip-week"></div>');
    }
    else{
        $(".item-8334815").html('<div class="result-tip-xin"></div>');
    }

    if(game.fromJump){
        embed.update(game.cache.resultData.soapyEmbedDto);
    }
    embed.singleExp("soapyAgainExpose");
    embed.singleExp("initPKExpose");
};

Result.prototype.hide = function(){
    this.$div.hide();
};