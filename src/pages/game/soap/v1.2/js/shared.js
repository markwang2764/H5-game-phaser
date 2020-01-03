/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:29:51 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-04-19 20:38:57
 * 分享提示弹窗
 */
function Shared() {
    this.$div = $(".create-mask");
    this.init();
}

Shared.prototype.init = function () {
    //知道啦
    $(".item-0717906").click(() => {
        embed.singleClk("shareClick");
        this.hide();
    })

};

Shared.prototype.show = function (resend, score, pk) {
    $(".item-0761682").html(resend ? score : game.score.total);
    this.$div.show();
    if(pk){
        pk.score = score;
    }
    /*
    if(!pk){
        httpGet("/soap/pk", {
            score: resend ? 0 : game.score.total,
            id: store.turnId,
            sessionKey: store.sessionKey,
            rank: resend ? 0 : game.cache.resultData.rank,
            challengeId: store.turnId,
            directId: getParamUrl("directId"),
            dsm: getParamUrl("dsm"),
            appKey: getParamUrl("appKey"),
            appId: getParamUrl("appId"),
            slotId: getParamUrl("slotId")
        }, (data)=>{
    
        })
    }
    else{
        pk.score = score;
    }
    */

    embed.singleExp("shareExpose");

    if(this.isWeiXin()){
        this.setSharedData(pk);
    }
    
};


Shared.prototype.isWeiXin = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
};

Shared.prototype.hide = function () {
    this.$div.hide();
};

Shared.prototype.setSharedData = function (pk) {
    if(!pk){
        httpGet("/soap/pk", {
            score: game.score.total,
            id: store.turnId,
            sessionKey: store.sessionKey,
            rank: game.cache.resultData.rank,
            challengeId: store.turnId,
            directId: getParamUrl("directId"),
            dsm: getParamUrl("dsm"),
            appKey: getParamUrl("appKey"),
            appId: getParamUrl("appId"),
            slotId: getParamUrl("slotId")
        }, (data)=>{
    
        })
    }

    $.ajax({
        url: HTTP_HOST + "/wxLogin/share",
        dataType: "json",
        type: "get",
        data: {
            id: store.gameId || getParamUrl("gameId"),
            appKey: pk ? pk.appKey : getParamUrl("appKey"),
            slotId: pk ? pk.slotId : getParamUrl("slotId"),
            deviceId: getParamUrl("openId"),
            appId: pk ? pk.appId : getParamUrl("appId"),
            type: 1,
            challengeId: pk ? pk.challengeId : store.turnId,//局ID
            url: window.location.href.split("#")[0]
        },
        success: function (res) {            
            wx.config({
                debug: false,
                appId: res.appId,
                timestamp: res.timeStamp,
                nonceStr: res.nonceStr,
                signature: res.signature,
                jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ"]
            });

            wx.ready(function () {
                var shareData = {
                    title: "我的肥皂已经滑了" + (pk ? pk.score : game.score.total) + "米，你能超过我就服",
                    desc: "你的好友" + store.nickName + "的肥皂已经飞行了" + (pk ? pk.score : game.score.total) + "米，你快来挑战一下",
                    link: "https://activity.tacota.cn/land/landPage?id=296&wxurl=" + encodeURIComponent(res.url),
                    imgUrl: "https://yun.tuisnake.com/h5-mami/webgame/soap/feizao.png"
                };
                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareTimeline(shareData);
                wx.onMenuShareQQ(shareData);
                wx.error(function (res) {
                    alert(JSON.stringify(res));
                });
            });
        },
        error: function () {
            console.log("transferToAccount error");
        }
    });
};