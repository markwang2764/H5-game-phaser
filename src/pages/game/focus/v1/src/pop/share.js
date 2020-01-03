export default class Share{
    constructor(){
        $(".share-mask").click(()=>{
            this.hide();
        })
        // $(".share-close").click(()=>{
        //     this.hide();
        // })
    }

    show(obj){
        // if(obj.entry){
        //     var extra = GAME.tool.paramWrapper(["share_way"]);
        //     extra["enter_layer_source"] = obj.entry;
        //     extra["layer_type"] = obj.layer;//蒙层类型layer_type：1-红包蒙层 2-PK蒙层
        //     console.log("蒙层类型layer_type:" + obj.layer);
        //     GAME.embed.embedExport(GAME.tool.append2Embed("enter_share_click", extra));
        // }

        $(".share-word").html(obj.tip);
        $(".share-mask").show();

        GAME.tool.hpGet("/youtui/context/getWxConfig", {
            url: window.location.href.split("#")[0]
        }, (res)=>{
            if(!res){
                console.warn("shared error");
                return;
            }
            console.log(res);

            var param = {
                contentId: CFG.gameId,
                contentType: 5,
                sourceUserId: GAME.tool.getParamUrl("sourceUserId"),
                sourceToken: GAME.tool.getParamUrl("sourceToken"),
                sessionKey: CFG.sessionKey
            }
            if(GAME.tool.getParamUrl("consumerIdOrder")){
                param.consumerIdOrder = GAME.tool.getParamUrl("consumerIdOrder");
            }

            GAME.tool.httpGet("/youtui/share/commonShareUrl", param, (rsp)=>{
                wx.config({
                    debug: false,
                    appId: res.data.appId,
                    timestamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    signature: res.data.signature,
                    jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ"]
                });
    
                var tip = obj.tip == "" ? "一个训练方法，让你的工作十拿九稳" : obj.tip;
                // tip = "dsds<br/>三个";
                tip = tip.replace("<br/>", ",");

                var url = getUrl(tip, rsp.data.clickUrl, obj.scoreTime ? obj.scoreTime : Global.scoreTime);
                        
                console.log(tip, url);

                wx.ready(function () {
                    var shareData = {
                        title: tip,
                        desc: getDesc(tip),
                        link: url,
                        imgUrl: getImg(tip),
                        success: function(){
                            // alert("分享成功");
                            var extra = GAME.tool.paramWrapper([]);
                            extra["enter_layer_source"] = obj.entry;
                            extra["layer_type"] = getLayerType(tip);
                            GAME.embed.embedExport(GAME.tool.append2Embed("share_success_click", extra));
                        }
                    };
                    wx.onMenuShareAppMessage(shareData);
                    wx.onMenuShareTimeline(shareData);
                    wx.onMenuShareQQ(shareData);
                    wx.error(function (res) {
                        alert(JSON.stringify(res));
                    });
                });
            })
            
        })
    }

    hide(){
        $(".share-mask").hide();
    }
}

function getLayerType(tip){
    if(tip.indexOf("帮我点一下翻倍") != -1){
        return 1;
    }
    else if(tip.indexOf("你敢来挑战吗") != -1){
        return 2;
    }
    else if(tip.indexOf("仅用了") != -1){
        return 2;
    }
    return 0;
}

function getEnterLayerSource(tip){
    if(tip.indexOf("帮我点一下翻倍") != -1){
        return 1;
    }
    else if(tip.indexOf("PK谁的手速") != -1){
        return 2;
    }
    else if(tip.indexOf("这道题太难") != -1){
        return 3;
    }
    else if(tip.indexOf("PK谁的手速") != -1){
        return 4;
    }
    else if(tip.indexOf("这道题太难") != -1){
        return 5;
    }
    return 5;
}

function getUrl(tip, url, scoreTime){
    var level = window.curLevelId;
    level = level ? level : 1;
    if(tip.indexOf("帮我点一下翻倍") != -1){
        return url + appendParam(2, level, scoreTime);
    }
    else if(tip.indexOf("你敢来挑战吗") != -1){
        return url + appendParam(1, level, scoreTime);
    }
    else if(tip.indexOf("仅用了") != -1){
        return url + appendParam(1, level, scoreTime);
    }
    return url + appendParam(3, level, scoreTime);
}

function appendParam(enter, level, scoreTime){
    var obj = {
        enterGameSource: enter,
        checkPointType: level,
        scoreTime: scoreTime,
        scoreRank: Global.scoreRank 
    };
    var list = [];
    for(var i in obj){
        list.push(`${i}=${obj[i]}`);
    }
    return "&" + list.join("&");
}

function getImg(tip){
    if(tip.indexOf("训练方法") != -1){
        return "http://yun.tuisnake.com/h5-mami/webgame/share/extreme_pic1.png";
    }
    else if(tip.indexOf("你敢来挑战吗") != -1){
        return "http://yun.tuisnake.com/h5-mami/webgame/share/extreme_pic2.png";
    }
    else if(tip.indexOf("战胜了") != -1){
        return "http://yun.tuisnake.com/h5-mami/webgame/share/extreme_pic2.png";
    }
    else if(tip.indexOf("帮我点一下翻倍") != -1){
        return "http://yun.tuisnake.com/h5-mami/webgame/share/extreme_pic3.png";
    }
    return "http://yun.tuisnake.com/h5-mami/webgame/share/extreme_pic2.png";
}

function getDesc(tip){
    if(tip.indexOf("帮我点一下翻倍") != -1){
        return "确认过眼神，我遇上对的人";
    }
    else if(tip.indexOf("你敢来挑战吗") != -1){
        return "单身20年都没这么快";
    }
    else if(tip.indexOf("战胜了") != -1){
        return "单身20年都没这么快";
    }
    else if(tip.indexOf("训练方法") != -1){
        return "为什么你不如别人";
    }
    return '单身20年都没这么快';
}