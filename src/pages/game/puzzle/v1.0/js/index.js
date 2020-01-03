var pops = {
    rule: 0,//规则弹窗
    offline: 0,//掉线弹窗
    overspend: 0,//次数用完
    starting: 0,//游戏开始
    loading: 0,//游戏加载进度
    prize: 0//我的奖品
};
var store = {
    nickName: "jsz",
    info: "",
    gameId: 3,
    sessionKey: "",
    isPreview: "",
    defaultImg: "http://yun.dui88.com/h5-mami/webgame/puzzle/coupon.png",
    defaultLink: "https://www.tuipink.com/h5/activity/zhuajpg.html"
};

//var HOST = "//play-pre.tacota.cn";
var HOST = "//play.tacota.cn";
//var HOST = "//192.168.0.175:17800";
//var HOST = "//pangu.tuiatest.cn";
//var HOST = "//" + location.host;

var game;

$(function(){
    //FastClick(document.body);
    FastClick.attach(document.body);
    CFG = JSON.parse(CFG);
    HOST = CFG.pgHost;
    store.sessionKey = CFG.usk;
    store.isPreview = CFG.isPreview ? CFG.isPreview : getParamUrl("isPreview");
    store.gameId = CFG.gameId ? CFG.gameId : getParamUrl("gameId");
    store.directId = CFG.directId ? CFG.directId : localStorage.getItem("directId");

    localStorage.setItem("usk", store.sessionKey);
    localStorage.setItem("directId", store.directId);
    store.nickName = getParamUrl("nickname");
    PageInit();

    httpGet("/puzzle/getPrize", {
        sessionKey: store.sessionKey,
        gameId: store.gameId,
        dsm: getParamUrl("dsm")
    }, (data)=>{
        CFG.nick_name = data.data.nickName;
        CFG.headUrl = data.data.headUrl;
        CFG.amount = data.data.amount;
        CFG.rewardAmount = data.data.rewardAmount;
        CFG.prizeEmbed = JSON.stringify(data.data.embed);
        CFG.firstLogin = data.data.firstLogin;
        showGamePop(popUserReward);
        /*
        if(document.referrer == "" || document.referrer.indexOf("/direct/index") == -1){
            var gid = getParamUrl("id");
            if(getCookie("pop" + gid) == 1){
                console.log("普通登录弹层已显示过");
            }
            else{
                CFG.nick_name = data.data.nickName;
                CFG.headUrl = data.data.headUrl;
                CFG.amount = data.data.amount;
                CFG.rewardAmount = data.data.rewardAmount;
                CFG.prizeEmbed = JSON.stringify(data.data.embed);
                CFG.firstLogin = data.data.firstLogin;
                popUserReward();
                setCookie("pop" + gid, 1, 1);
            }
        }
        */
    })
})

function PageInit(){
    game = new Game();

    pops.prize = new Prize();
    pops.offline = new Offline('.offline');
    pops.rule = new Rule('.rule');
    pops.overspend = new Overspend('.overspend');
    pops.starting = new Starting('.starting');
    pops.loading = new Loading('.loading');

    if(location.href.indexOf("toPrize") != -1){
        pops.loading.hide();
        pops.starting.hide();
        pops.prize.initView();
        pops.prize.show();
        localStorage.setItem("back", 1);
    }
    else if(location.href.indexOf("toGame") != -1){
        if(localStorage.getItem("read") == 1 || localStorage.getItem("back") == 1){
            //localStorage.setItem("read", 0);
            localStorage.setItem("back", 0);
            var ads = localStorage.getItem("ads");
            ads = JSON.parse(ads);
            game.isReadSave = true;
            game.init(ads);
        }
        else{
            game.init();
        }
        pops.loading.hide();
        pops.starting.hide();
        pops.prize.hide();
    }
    else{
        pops.starting.initView();
        pops.prize.hide();
        $(".room-gesture").show();
    }

    $("body").append('<canvas id="imgcanvas" width="640" height="300" style="display: none"></canvas>');
    //$(".my-prize").hide();

    //游戏介绍
    $(".item-4203781").click(()=>{
        pops.rule.show();
        game.embed.singleClk(Embed.GUI_ZE);
    })

    //我的奖品
    $(".item-4210189").click(()=>{
        //pops.prize.show();
        game.embed.singleClk(Embed.JIANG_PIN);
        var url = urlJsonParam(`${HOST}/detailPage/toPrize`, {
            usk: store.sessionKey,
            gameId: store.gameId,
            isPreview: store.isPreview,
            dpm: getParamUrl("dpm"), 
            dcm: getParamUrl("dcm"),
            dsm: getParamUrl("dsm")
        })
        //window.location = HOST + "/detailPage/toPrize?usk=" + store.sessionKey + "&gameId=" + store.gameId + "&isPreview=" + store.isPreview;
        window.location = url;
    })
}

function redirectLink(link){
    if(!game.ads.luckFlag){
        httpPost("/puzzle/clickPuzzleAdvert", JSON.stringify({
            sessionKey: store.sessionKey,
            gameId: store.gameId,
            advertId: game.ads.advertId,
            actOrderId: game.ads.orderId,
            packageId: game.ads.packageId,
            dcm: getParamUrl("dcm"),
            dpm: getParamUrl("dpm"),
            dsm: getParamUrl("dsm")
        }), (data)=>{
            redirectJump(link);
        })
    }
    else{
        redirectJump(link);
    }
}

function redirectJump(link){
    var url = link;
    if(game.embed.data.advertExpose){
        if(url.indexOf(HOST + "/detailPage/redirect") != -1){
            url = url + (url.indexOf("?") == -1 ? "?" : "&");
            url = url + "dcm=" + getParamUrl("dcm") + "&dpm=" + getParamUrl("dpm") + "&dsm=" + getParamUrl("dsm");
        }
    }
    window.location = url;
}


function popUserReward(){
    var expdata = null;
    var clkdata = null;
    var loginType = 0;
    var embedData = JSON.parse(CFG.prizeEmbed);
    if(CFG.firstLogin == 0){
        loginType = 3;
        expdata = embedData.st_info_exposure_normal_choose_game;
        clkdata = embedData.st_info_click_normal_choose_game;
    }
    else if(CFG.firstLogin == 1){
        loginType = 2;
        expdata = embedData.st_info_exposure_first_choose_game;
        clkdata = embedData.st_info_click_first_choose_game;
    }
    else if(CFG.firstLogin == 2){
        loginType = 1;
        expdata = embedData.st_info_exposure_daily_choose_game;
        clkdata = embedData.st_info_click_daily_choose_game;
    }
    window.addEventListener("message", function(event){
        if(event.data === "showpop"){
            document.getElementById("pop").contentWindow.postMessage(JSON.stringify({
                loginType: loginType,
                userHeader: CFG.headUrl,
                userName: CFG.nick_name,
                inHall: false,
                amount: CFG.amount,
                rewardMoney: CFG.rewardAmount
            }), "*");
            $("#pop").show();

            window.DB.exposure.singleExp(JSON.stringify(expdata));
        }
        else if(event.data === "hidepop"){
            $("#pop").remove();
            window.DB.exposure.singleClk({data: JSON.stringify(clkdata)});
        }
    })

    $("body").append();
    var $div = $('<iframe id="pop"></iframe>');
    $div.css({
        position: "fixed",
        "z-index": 8,
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        border: "none",
        display: "none"
    });
    $div.attr("src", "//yun.dui88.com/h5-mami/webgame/user-pop/index.html");
    $div.appendTo($("body"));
}

function getCookie(cname) {
    var name = cname + "=",
        ca = document.cookie.split(';'), i, c,
        ca_length = ca.length;
    for (i = 0; i < ca_length; i += 1) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) !== -1) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(variable, value, day) {
    var d = new Date();
    d = new Date(d.getTime() + 1000 * 3600 * 24 * day);
    document.cookie = variable + '=' + value + '; expires=' + d.toGMTString() + ';';
}