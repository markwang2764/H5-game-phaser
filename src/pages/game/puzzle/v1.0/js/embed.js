function Embed(){
    this.data = null;
    //this.init();
}

Embed.GUI_ZE = "规则";
Embed.JIANG_PIN = "我的奖品";
Embed.MA_SHANG = "马上拼图";
Embed.HUI_LING = "领取权益灰色";
Embed.WAN_CHENG = "拼图完成";
Embed.LIANG_LING = "领取权益亮色";
Embed.XIA_GUAN = "下一关";

Embed.prototype.init = function(callback){
    var url = hostLink(`getEmbed`);
    httpGet(url, {
        gameId: store.gameId,
        dsm: getParamUrl("dsm"),
        usk: store.sessionKey,
        directId: store.directId
    }, (data)=>{
        this.data = changeJson(data).data;
        callback();
    })
}

Embed.prototype.readSave = function(){
    var mdata = JSON.parse(localStorage.getItem("mdata"));
    this.data = mdata;
}

Embed.prototype.getAds = function(callback){
    var col = game.size.col ? game.size.col : 0;
    var row = game.size.row ? game.size.row : 0;
    var url = hostLink(`getPuzzleAdvert`);
    var param = {
        gameId: store.gameId,
        sessionKey: store.sessionKey,
        column: col,
        row: row,
        isPreview: store.isPreview,
        dsm: getParamUrl("dsm"),
        dpm: getParamUrl("dpm"),
        dcm: getParamUrl("dcm"),
        directId: store.directId
    };

    if(getParamUrl("contextToken")){
        param.contextToken = getParamUrl("contextToken");
    }
    httpGet(url, param, (data)=>{
        data = changeJson(data);
        //data.data = null;
        if(data.data){
            data = data.data;
            var ads = data.embedDto;
            for(var i in ads){
                if(ads[i] != null){
                    this.data[i] = ads[i];
                }
            }
            this.data.advertExpose = ads.advertExpose;
            localStorage.setItem("mdata", JSON.stringify(this.data));
            callback && callback(data);

            if(data.advertId){
                this.expOtherAds();
            }
        }
        else{
            callback && callback();
            pops.overspend.show();
        }
    })
}

Embed.prototype.singleExp = function(type){
    if(!this.data){
        console.log("没有埋点数据");
        return;
    }
    var item;
    switch(type){
        case Embed.MA_SHANG:
            item = this.data.startPuzzleExpose;
            break;
        case Embed.LIANG_LING:
            item = this.data.getRewardLightExpose;
            break;
        case Embed.HUI_LING:
            item = this.data.getRewardBlackExpose;
            break;
        case Embed.GUI_ZE:
            item = this.data.gameRuleExpose;
            break;
        case Embed.JIANG_PIN:
            item = this.data.myPrizeExpose;
            break;
        default:
            item = null;
            break;
    }
    window.DB.exposure.singleExp(JSON.stringify(item));
}

Embed.prototype.singleClk = function(type){
    if(!this.data){
        console.log("没有埋点数据");
        return;
    }
    var item;
    switch(type){
        case Embed.GUI_ZE:
            item = this.data.gameRuleClick;
            break;
        case Embed.JIANG_PIN:
            item = this.data.myPrizeClick;
            break;
        case Embed.MA_SHANG:
            item = this.data.startPuzzleClick;
            break;
        case Embed.HUI_LING:
            item = this.data.getRewardBlackClick;
            break;
        case Embed.WAN_CHENG:
            item = this.data.finishPuzzleClick;
            break;
        case Embed.LIANG_LING:
            item = this.data.getRewardLightClick;
            break;
        case Embed.XIA_GUAN:
            item = this.data.nextGameClick;
            break;
        default:
            item = null;
            break;

    }
    window.DB.exposure.singleClk({data: item});
}

Embed.prototype.expOtherAds = function(){
    if(this.data.advertExpose){
        var list = [];
        for(var i in this.data.advertExpose){
            list.push(i + "=" + encodeURIComponent(this.data.advertExpose[i]));
        }
        var url = this.data.advertExpose.domain4Web + this.data.advertExpose.url + "?" + list.join("&");
        var param = {
            sessionKey: store.sessionKey,
            gameId: store.userId
        };
        if(url.indexOf("dsm=") == -1){
            param.dsm = getParamUrl("dsm");
        }
        httpGet(url, param, function(){});
    }
}