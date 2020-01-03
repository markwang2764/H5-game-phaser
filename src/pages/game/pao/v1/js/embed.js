function Embed(){
    this.data = null;
    this.rank = null;
    this.lottery = null;
}

Embed.TYPE_1 = "竞速模式按钮";
Embed.TYPE_2 = "无尽模式按钮";
Embed.TYPE_3 = "游戏介绍按钮";
Embed.TYPE_4 = "获得金币按钮";
Embed.TYPE_5 = "排行榜关闭按钮";
Embed.TYPE_6 = "排行榜出券";
Embed.TYPE_7 = "排行榜立即领取按钮";
Embed.TYPE_8 = "排行榜返回按钮";
Embed.TYPE_9 = "游戏规则关闭按钮";
Embed.TYPE_10 = "排行榜知道啦按钮";
Embed.TYPE_11 = "金币弹窗关闭按钮";
Embed.TYPE_12 = "金币弹窗获取金币按钮";
Embed.TYPE_12 = "金币弹窗获取金币按钮";


Embed.prototype.init = function(callback){
    var $this = this;
    var param = {
        gameId: getParamUrl("id"),
        dsm: getParamUrl("dsm")
    }
    
    httpGet("/game/getFishEmbed", param, function(data){
        console.log(data);
        $this.data = data;
        callback && callback();
    })
}

Embed.prototype.singleExp = function(type){
    if(!this.data){
        console.log("没有埋点数据");
        return;
    }
    var item;
    switch(type){
        case Embed.TYPE_1:
            item = this.data.st_info_exposure_race;
            break;
        case Embed.TYPE_2:
            item = this.data.st_info_exposure_endless;
            break;
        case Embed.TYPE_3:
            item = this.data.st_info_exposure_introduce;
            break;
        case Embed.TYPE_4:
            item = this.data.st_info_exposure_get;
            break;
        case Embed.TYPE_5:
            item = this.rank.st_info_exposure_close;
            break;
        case Embed.TYPE_6:
            item = this.rank.st_info_exposure_advert;
            break;
        case Embed.TYPE_7:
            item = this.rank.st_info_exposure_advert_button;
            break;
        case Embed.TYPE_8:
            item = this.rank.st_info_exposure_refresh_button;
            break;
        case Embed.TYPE_9:
            item = this.data.st_info_exposure_rule_close;
            break;
        case Embed.TYPE_10:
            item = this.rank.st_info_exposure_know_button;
            break;
        case Embed.TYPE_11:
            item = this.data.st_info_exposure_amount_close;
            break;
        case Embed.TYPE_12:
            item = this.data.st_info_exposure_get_amount;
            break;
        default:
            item = null;
            break;
    }
    window.DB.exposure.singleExp(item);
}

Embed.prototype.singleClk = function(type){
    if(!this.data){
        console.log("没有埋点数据");
        return;
    }
    var item;
    switch(type){
        case Embed.TYPE_1:
            item = this.data.st_info_click_race;
            break;
        case Embed.TYPE_2:
            item = this.data.st_info_click_endless;
            break;
        case Embed.TYPE_3:
            item = this.data.st_info_click_introduce;
            break;
        case Embed.TYPE_4:
            item = this.data.st_info_click_get;
            break;
        case Embed.TYPE_5:
            item = this.rank.st_info_click_close;
            break;
        case Embed.TYPE_6:
            item = this.rank.st_info_click_advert;
            break;
        case Embed.TYPE_7:
            item = this.rank.st_info_click_advert_button;
            break;
        case Embed.TYPE_8:
            item = this.rank.st_info_click_refresh_button;
            break;
        case Embed.TYPE_9:
            item = this.data.st_info_click_rule_close;
            break;
        case Embed.TYPE_10:
            item = this.rank.st_info_click_know_button;
            break;
        case Embed.TYPE_11:
            item = this.data.st_info_click_amount_close;
            break;
        case Embed.TYPE_12:
            item = this.data.st_info_click_get_amount;
            break;
        default:
            item = null;
            break;

    }
    window.DB.exposure.singleClk({data: item});
}