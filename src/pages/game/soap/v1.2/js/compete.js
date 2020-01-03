/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:24:55 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-04-12 20:37:34
 * PK结果
 */
function Compete(){
    this.callback = null;
    this.init();
}

Compete.prototype.init = function(){
    //再挤一次
    $(".win-mask .item-7167418").click(()=>{
        embed.singleClk("soapyAgainClick");
        this.hide();
        this.callback && this.callback(0);
    })

    //生成好友PK
    $(".win-mask .item-7172058").click(()=>{
        //embed.singleClk("shareClick");
        embed.singleClk("initPKClick");
        this.callback && this.callback(1);
    })

    //放你一马
    $(".lost-mask .item-7117987").click(()=>{
        embed.singleClk("letItGoClick");
        this.hide();
        this.callback && this.callback(2);
    })
    
    //不服再战
    $(".lost-mask .item-7126082").click(()=>{
        embed.singleClk("pkAgainClick");
        this.hide();
        this.callback && this.callback(3);
    })

};

Compete.prototype.show = function(callback){
    var data = game.cache.resultData;
    var suc = data.score >= data.challengerScore;

    //suc = false;
    
    if(suc){
        $(".win-mask").show();
        $(".win-mask .item-9946714").css("background-image", `url(${data.headUrl})`);
        $(".win-mask .item-9995801").css("background-image", `url(${data.challengeHeadUrl})`);
        //$(".win-mask .item-7280946").html(data.score + "分");
        //$(".win-mask .item-7316666").html(data.challengerScore + "分");
        $(".win-mask .item-7368803").html(data.nickName);
        $(".win-mask .item-7395179").html(data.challengeNickName);
        embed.singleExp("soapyAgainExpose");
        //embed.singleExp("shareExpose");
        embed.singleExp("initPKExpose");

        $(".item-9946714").attr("class", "item-9946714 cirSizeBig");
        $(".item-9995801").attr("class", "item-9995801 cirSizeSmall");

        var myscore = $(".win-mask .item-7280946");
        stepNum(data.score, (n)=>{
            myscore.html(n + "分");
        })

        var cgscore = $(".win-mask .item-7316666");
        stepNum(data.challengerScore, (n)=>{
            cgscore.html(n + "分");
        })

        //$(".item-6968074").attr("class", "item-6968074 fire-win");
    }
    else{
        $(".lost-mask").show();
        $(".lost-mask .item-9946714").css("background-image", `url(${data.headUrl})`);
        $(".lost-mask .item-9995801").css("background-image", `url(${data.challengeHeadUrl})`);
        //$(".lost-mask .item-7280946").html(data.score + "分");
        //$(".lost-mask .item-7316666").html(data.challengerScore + "分");
        $(".lost-mask .item-7368803").html(data.nickName);
        $(".lost-mask .item-7395179").html(data.challengeNickName);
        embed.singleExp("letItGoExpose");
        embed.singleExp("pkAgainExpose");

        $(".item-9946714").attr("class", "item-9946714 cirSizeSmall");
        $(".item-9995801").attr("class", "item-9995801 cirSizeBig");

        var myscore = $(".lost-mask .item-7280946");
        stepNum(data.score, (n)=>{
            myscore.html(n + "分");
        })

        var cgscore = $(".lost-mask .item-7316666");
        stepNum(data.challengerScore, (n)=>{
            cgscore.html(n + "分");
        })

        //$(".item-7772714").attr("class", "item-7772714 fire-win");
    }
    $(".item-7003937").html(dataTemplate("level-info", data));
    $(".item-9748113").show();
    setTimeout(()=>{
        $(".item-9748113").hide();
    }, 1200);

    setTimeout(()=>{
        $(".progress-color").css("width", data.score * 100 / (data.score + data.challengerScore) + "%");
    }, 800);    
    
    this.callback = callback;
};

Compete.prototype.hide = function(){
    $(".win-mask,.lost-mask").hide();
};