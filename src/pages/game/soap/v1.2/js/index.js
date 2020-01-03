/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:26:06 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-07-04 19:00:00
 * 页面初始化
 */
var game, rule, store, pages, embed;
var loading;
var HTTP_HOST = "";
var flyAim = 0;
//var HTTP_HOST = "//pangu.tuiatest.cn";
//var HTTP_HOST = "//play-pre.tacota.cn";


(function () {
    if (!/debug=1/.test(window.location.href)) return;
    var oHead = document.head;
    var oScript = document.createElement('script');
    oScript.type = "text/javascript";
    oScript.src = "http://yun.dui88.com/h5-mami/optimize/eruda.min.js";
    oHead.appendChild(oScript);
    oScript.onload = function () { eruda.init() }
})()

$(function(){
    CFG = CFG == "${data}" ? {} : JSON.parse(CFG);
    HTTP_HOST = CFG.pgHost;
    store = {
        otherName: getParamUrl("other"),
        online: HOST != '${host}',
        nickName: CFG.nickName || getParamUrl("nickName"),
        gameId: CFG.gameId,
        sessionKey: CFG.usk,
        isPreview: CFG.isPreview,
        curLevel: getDefaultSave("level", 1),
        turnId: 0,//局ID
        challengeId: getParamUrl("challengeId"),//局ID
        propsRuleType: CFG.propsRuleType,//道具规则类型
        levels: CFG.levels,//出道具关卡
        directId: CFG.directId || getParamUrl("directId"),
        difficultyConfigList: CFG.difficultyConfigList ? CFG.difficultyConfigList : [{"greenArea":60,"move":true,"moveSpeed":1,"orangeArea":20,"redArea":20}],
        passParam: {
            nickName: CFG.nickName || getParamUrl("nickName"),
            sessionKey: CFG.usk,
            isPreview: CFG.isPreview,
            gameId: CFG.gameId,
            openId: getParamUrl("openId"),
            slotId: getParamUrl("slotId"),
            appId: getParamUrl("appId"),
            appKey: getParamUrl("appKey")
        }
    }

    document.title = "你的好友掉了一块肥皂 需要你捡一下";
    
    embed = new Embed();
    embed.init(()=>{
        initJumpPage();
    })
})

function initJumpPage(){
    loading = new Loading();
    pages = getPagesName();
    if(location.pathname.indexOf(pages.game) != -1){
        document.body.style.background = "rgb(69,134,200)";
        new Rule();
        pageGame();
    }
    else if(location.pathname.indexOf(pages.prize) != -1){
        pagePrize();
        loading.hide();
    }
    else if(location.pathname.indexOf(pages.send) != -1){
        if(store.online){
            if(CFG.challengeType == 1){
                pageRead();
            }
            else{
                pageSend();
            }
        }
        else{
            pageSend();
        }
        loading.hide();
    }
    else if(location.pathname.indexOf(pages.read) != -1){
        if(store.online){
            if(CFG.challengeType == 1){
                pageRead();
            }
            else{
                pageSend();
            }
        }
        else{
            pageRead();
        }
        loading.hide();
    }
    else{
        document.body.style.background = "rgb(69,134,200)";
        new Rule();
        pageStart();
        loading.hide();

        httpGet("/puzzle/getPrize", {
            sessionKey: store.sessionKey,
            gameId: store.gameId,
            dsm: getParamUrl("dsm")
        }, function(data){
            CFG.nick_name = CFG.nickName;
            CFG.headUrl = data.data.headUrl;
            CFG.amount = data.data.amount;
            CFG.rewardAmount = data.data.rewardAmount;
            CFG.prizeEmbed = JSON.stringify(data.data.embed);
            CFG.firstLogin = data.data.firstLogin;
            
            // showGamePop(popUserReward);//-------------------------------------------------------------------新人弹层
            
            /*
            if(document.referrer == "" || document.referrer.indexOf("/direct/index") == -1){
                var gid = getParamUrl("id");
                if(getCookie("pop" + gid) == 1){
                    console.log("普通登录弹层已显示过");
                }
                else{
                    CFG.nick_name = CFG.nickName;
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
        });
    }
}

function getPagesName(){
    var names = {};
    if(store.online){
        names.game = "/soap/toGamePage";
        names.prize = "/soap/toPrize";
        names.send = "/soap/toPKPage";
        names.read = "/soap/toPKPage";
    }
    else{
        names.game = "game.html";
        names.prize = "prize.html";
        names.send = "send.html";
        names.read = "read.html";
    }
    return names;
}

function pageStart(){
    $(".item-1852575,.item-1828222").show();
    $(".item-1882671").click(()=>{
        localStorage.setItem("used", 0);
        embed.singleClk("startGameClick");
        localStorage.setItem("autoJump", 0);
        localStorage.setItem("state", 0);
        var obj = searchToJson();
        obj.dcm = getParamUrl("dcm");
        if(getParamUrl("dpm")){
            obj.dpm = getParamUrl("dpm");
        }
        obj.dsm = getParamUrl("dsm");
        appendJson(obj, store.passParam);
        window.location = urlJsonParam(pages.game, obj);
    })
    $(".item-1852575").click(()=>{
        embed.singleClk("myPrizeClick");
        var obj = searchToJson();
        appendJson(obj, store.passParam);
        window.location = urlJsonParam(pages.prize, obj);
    })

    embed.singleExp("gameRuleExpose");
    embed.singleExp("myPrizeExpose");
    embed.singleExp("startGameExpose");
    localStorage.setItem("index", location.href);

    startPageCartoon();

}

function pageGame(){
    $(".item-1852575,.item-1828222").hide();
    $(".item-1847430").hide();
    game = new Game();
    store.curLevel = 1;
    httpGet("/soap/startGame", {
        gameId: getParamUrl("gameId"),
        directId: getParamUrl("directId"),
        dsm: getParamUrl("dsm")
    }, function(data){
        store.turnId = data.data.id;
        localStorage.setItem("used", 0);
        game.init();
    })
}

function pagePrize(){
    $(".item-1852575,.item-1828222").hide();
    $(".item-1847430,canvas").hide();

    new Prize();
}

function pageSend(){
    $(".item-1852575,.item-1828222").hide();
    $(".item-1847430,canvas").hide();
    new SendChallenge();
}

function pageRead(){
    $(".item-1852575,.item-1828222").hide();
    $(".item-1847430,canvas").hide();
    new ReadChallenge();
}

function startPageCartoon(){
    $(".item-1828222").append('<canvas id="startCanvas" width="750" height="1206"></canvas>');
	images = images||{};
	var manifest = [
		{src:"bgsie.png", id:"bgsie", crossOrigin:true},
		{src:"duck.png", id:"duck", crossOrigin:true},
		{src:"leftthumb_1.png", id:"leftthumb_1", crossOrigin:true},
		{src:"nfeizao.png", id:"nfeizao", crossOrigin:true},
		{src:"rightthumb_1.png", id:"rightthumb_1", crossOrigin:true},
		{src:"shenti_1.png", id:"shenti_1", crossOrigin:true},
		{src:"shouxin_1.png", id:"shouxin_1", crossOrigin:true},
        {src:"sizhi_1.png", id:"sizhi_1", crossOrigin:true}
    ];
    
    if(store.online){
        manifest.forEach((item)=>{
            item.src = HOST + '/h5-mami/webgame/soap/allflash/' + item.src;
        })
    }
    else{
        manifest.forEach((item)=>{
            item.src = './newflash/images/' + item.src;
        })
    }

	var loader = new createjs.LoadQueue(false, null, true);
	loader.addEventListener("fileload", (evt)=>{
        if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
    });
	loader.addEventListener("complete", ()=>{
        var canvas = $("#startCanvas")[0];
        var exportRoot = new lib.mc_start();
        var stage = new createjs.Stage(canvas);
        stage.addChild(exportRoot);
        stage.update();
        createjs.Ticker.setFPS(24);
        createjs.Ticker.addEventListener("tick", stage);

        //var audio = new Audio(HOST + '/h5-mami/webgame/soap/newflash/images/gege.mp3');
        var audio = new Audio('//yun.dui88.com/h5-mami/webgame/soap/newflash/images/gege.mp3');
        setTimeout(() => {
            exportRoot.children[1].onClick = ()=>{
                audio.load();
                audio.play();
            }
        }, 90);
    });
    
	loader.loadManifest(manifest);
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

function getNumberDivs(str){
    var list = [];
    for(var i = 0; i < str.length; i++){
        var t = str.charAt(i);
        if(t === "("){
            t = "lf";
        }
        else if(t === ")"){
            t = "rt";
        }
        var div = '<div class="snum num' + t + '"></div>';
        list.push(div);
    }
    return list.join("");
}