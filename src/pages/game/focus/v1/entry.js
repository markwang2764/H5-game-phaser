import Main from './src/Main';
import './assets/font/ziti.css'
import './entry.less'
import './src/page/detail'

import Page from './src/page/index'
import Pop from './src/pop/index'
import MessageId from './src/Message'
import { GameMode } from './src/Enums';
import bridge from '@components/bridge/index';
import { isAndroid, isWeiXin, getUrlParameter ,appendUrlParameter, toDownloadUrl, isAppDownload} from '@js/utils';

// CFG.sessionKey = GAME.tool.getParamUrl('sessionKey');
CFG.sourceUserId = GAME.tool.getParamUrl("sourceUserId") || "";
CFG.sourceToken = GAME.tool.getParamUrl("sourceToken") || "";
CFG.gameId = CFG.gameId || GAME.tool.getParamUrl("id") || GAME.tool.getParamUrl("gameId") ;
CFG.isPreview = (!!GAME.tool.getParamUrl("appPreview"));

window.Global = {
    // 标记是否点击了“PK”按钮
    startPk: false,
    // 游戏模式
    gameMode: 0,
    // 进入戳戳界面的方式
    enterPlaySource: 0,
    // 当前页面,0为起始页，1为结束页
    page: 0,
    //page_source埋点字段
    pageSource: 5,
    //游戏用时
    scoreTime: 0,
    //游戏排名百分比
    scoreRank: 24
}

if(CFG.isPreview){
    Pop.noMoney();
}
else{
    Pop.hasMoney();
}

GAME.tool.hpGet('/youtui/extreme/getEmbed', {}, (res)=>{
    CFG.embed = res;
    if(CFG.debug && !res) {
        CFG.embed = {};
    }
    switch(CFG.enterGameSource) {
        case 1://点击游戏分享卡片进入
            // 显示PK首页
            Page.showShare(false);
            Pop.hideMoney();
            Global.gameMode = GameMode.PK;
            Global.enterPlaySource = 4;
            $(".other-header").css({
                "background-image": `url(${CFG.shareHeadUrl})`
            });
            $(".other-time").html(changeTime(parseInt(CFG.scoreTime)));
            $(".other-top").html(`ta的手速击败了全国${CFG.scoreRank}%的人`);
            break;
        case 2: // 红包翻倍分享
            Pop.showDouble(true);
            Pop.showMoney();
            Global.gameMode = GameMode.LEVEL;
            break;
        case 3: // 趣晒app直接开始游戏
            Page.showGame();
            Pop.showMoney();
            Global.gameMode = GameMode.LEVEL;
            break;
        default: 
            Page.showGame();
            Global.gameMode = GameMode.LEVEL;
            break;
    }
    new Main();

    if(window.location.search.indexOf("test=1") != -1){
        return;
    }
    if (!isWeiXin() && !getUrlParameter('appPreview')) {
        // 当前页面在安卓的其他浏览器中并且不在趣晒app中 自动发起下载
        if (isAndroid()) {
            var extra = GAME.tool.paramWrapper([]);
            GAME.embed.embedExport(GAME.tool.append2Embed("download_pull_browser_click", extra));
            GAME.tool.hpGet("/youtui/system/getDownloadUrl", {
                channelString: "yysc-cc-focus"
            }, (res)=>{
                toDownloadUrl(res.data);
            })
        } else {
            location.href = '/youtui/ab/getIosDownload';
        }
    }
});



$("body").addClass("fadeIn");

GAME.event.on(MessageId.POP_RESULT, (obj)=>{
    Pop.showResult(obj);
}, this)

GAME.event.on(MessageId.showRank, (obj)=>{
    Pop.showRank(obj);
}, this)

GAME.event.on(MessageId.showShare, (obj)=>{
    if(obj.entry){
        var extra = GAME.tool.paramWrapper(["share_way"]);
        extra["enter_layer_source"] = obj.entry;
        extra["layer_type"] = obj.layer ? obj.layer : 0;//蒙层类型layer_type：1-红包蒙层 2-PK蒙层
        console.log("蒙层类型layer_type:" + obj.layer);
        GAME.embed.embedExport(GAME.tool.append2Embed("enter_share_click", extra));
    }

    if (CFG.isPreview) {
        bridge.h5Share({
            shareType: 1,
            needDraw:0, 
        });
    } else {
        Pop.showShare(obj);
    }
}, this)

GAME.event.on(MessageId.showMoney, (obj)=>{
    Pop.showMoney();
}, this)

GAME.event.on(MessageId.hideMoney, (obj)=>{
    Pop.hideMoney();
}, this)

GAME.event.on(MessageId.showTip, (obj)=>{
    Pop.toast.show(obj);
}, this);

GAME.event.on(MessageId.start, (obj)=>{
    Pop.rank.clear();
}, this);

GAME.event.on(MessageId.showDetail, (obj)=>{
    Pop.detail.show();
}, this);

GAME.event.on(MessageId.showDownload, (obj)=>{
    Pop.download.show();
})

GAME.event.on(MessageId.showCash, (obj)=>{
    Pop.cash.show();
})


window.showAccounts = function(num){
    num = numFixed(num);
    $(".yuer").html(`￥${num}元`);
    $(".fecth-num").html(`${num}元`);
}

window.numFixed = function(num){
    var s = num.toFixed(3);
    return s.substr(0, s.length - 1);
}

window.changeTime = function(num){
    var num = num / 1000;
    var h = Math.floor(num / 3600);
    var m = Math.floor(num / 60);
    var s = Math.floor(num % 60);
    var ms = num.toFixed(2).split(".")[1];
    if(h == 0){
        if(m == 0){
            return `${s}"${ms}`;
        }
        else{
            return `${Math.floor(num / 60)}'${s}"${ms}`;
        }
    }
    
    return `${Math.floor(num / 3600)}:${Math.floor(num % 3600 / m)}'${s}"${ms}`;
}

showAccounts(CFG.bonus);