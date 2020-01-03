/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:29:05 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-03-29 19:31:03
 * 进入挑战页面
 */
function SendChallenge(){
    this.$div = $(".item-3036114");
    this.shared = new Shared();
    this.score = 0;
    this.init();
}

SendChallenge.prototype.init = function(){
    //接受挑战
    $(".item-3102490").click(()=>{
        embed.singleClk("pkClick");
        var param = searchToJson();
        param.page = "soap/index";
        param.nickName = CFG.myNickName;
        window.location = urlJsonParam("/wxLogin/toLoginPage", param);
    })

    //轮番上阵
    $(".item-3059842").click(()=>{
        embed.singleClk("shareClick");
        this.shared.show(true, this.score, {
            appKey: CFG.appKey,
            appId: CFG.appId,
            slotId: CFG.slotId,
            challengeId: getParamUrl("challengeId")
        });
    })

    httpGet("/soap/getChallengeData", {
        challengeId: getParamUrl("challengeId"),
        dsm: getParamUrl("dsm")
    }, (data)=>{
        data = changeJson(data);
        //embed.update(data.data);
        this.score = data.data.score;
        $(".item-3416882").html(CFG.nickName);
        $(".item-3135554").html(data.data.rank);
        $(".item-3392050").css("background-image", `url(${CFG.headUrl})`);
        $(".item-3446714").html(data.data.score + "m");
        this.show();
    })
};

SendChallenge.prototype.show = function(){
    embed.update(CFG.SoapyEmbedDto);
    this.$div.show();
    embed.singleExp("pkExpose");
    embed.singleExp("shareExpose");
};