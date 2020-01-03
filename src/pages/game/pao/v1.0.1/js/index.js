var w = window.innerWidth;
var h = 1206;
var game;
var store;
var embed;
var scale = 0;

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

window.dataTemplate = function (sid, data) {
    var jtemp = new JTemp(sid);
    var html = jtemp.build(data);
    return html;
}

window.getParamUrl = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null; 
    }
}

window.httpGet = function(url, data, callback){
    $.ajax({
        url: url,
        type: 'GET',
        data: data,
        timeout: 1200,
        dataType: 'json',
        success: function(data){
            callback && callback(data);
        },
        error: function(xhr){
            console.log(xhr);
            callback && callback();
        }
    })
}

window.httpPost = function(url, data, callback){
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        timeout: 1200,
        dataType: 'json',
        success: function(data){
            callback && callback(data);
        },
        error: function(xhr){
            console.log(xhr);
            callback && callback();
        }
    })
}

window.onload = function () {
    scale = window.innerWidth / 750;
    if(window.innerHeight / window.innerWidth > 1206 / 750){
        $(".stage, .bg, .mask").css("height", window.innerHeight + "px");
        $(".bottom").css("top", window.innerHeight - 171 * scale + "px");
        $(".info-ico").css("top", window.innerHeight - 234 * scale + "px");
    }
    embed = new Embed();
    embed.init(function(suc){
        console.log(suc);
        store = new Store(function(){
            game = new Game(scale);
            game.init();
            addEvent();
        });
    })    

    showGamePop(popUserReward);
    /*
    if(document.referrer == "" || document.referrer.indexOf("/direct/index") == -1){
        var gid = getParamUrl("id");
        if(getCookie("pop" + gid) == 1){
            console.log("普通登录弹层已显示过");
        }
        else{
            popUserReward();
            setCookie("pop" + gid, 1, 1);
        }
    }
    */
}

function initStartGuider(){
    var type = CFG.gameVersion;
    if(location.search.indexOf("debug=1") !== -1){
      type = getParamUrl("type");
    }
    // if(type === "2.1"){
    //   $(".start-btn-cir").show().addClass("scale-guider").css("transform-origin", "center center");
    // }
    // else if(type === "2.2"){
    //   $(".start-btn-cir,.room-gesture").show();
    // }
    if(type === "1.1"){
      $(".start-btn-rect").show().addClass("scale-guider");
      $(".start-btn-rect,.start-btn-rect-light").css("transform-origin", "center center");
      setInterval(function(){
        $(".start-btn-rect-light").toggleClass("shine");
      }, 1000);
    }
    else{
      $(".start-btn-rect").show();
      $(".room-gesture").show();
      setInterval(function(){
        $(".start-btn-rect-light").toggleClass("shine");
      }, 1000);
    }
}

function addEvent(){
    // $(".modes").show().append('<div class="mode start-btn"></div>');
    $(".modes").show();
    initStartGuider();

    $(".bg").css("background-image", "url(" + store.background + ")");
    $(".top").css("background-image", "url(" + store.banner + ")");

    $(".start-btn-rect-light").css("transform", `scale(${document.documentElement.clientWidth / 750 })`);

    $(".new-startbtn").click(function() {
        $(".modes").hide();
        embed.singleClk(Embed.TYPE_1);
        game.ready();
    });

    $(".mask.modes").click(function(e){
        if($(e.target).hasClass("new-startbtn")){
            console.warn("aim");
            return;
        }
        console.warn("other");
        $(".modes").hide();
        embed.singleClk(Embed.TYPE_13);
        game.ready();
    })

    $(".arena").click(function() {
        $(".modes").hide();
        embed.singleClk(Embed.TYPE_1);
        game.ready();
    });

    $(".infinite").click(function() {
        $(".modes").hide();
        embed.singleClk(Embed.TYPE_2);
        game.ready();
    });

    // $(".get").click(function(){
    //     embed.singleClk(Embed.TYPE_4);
    //     window.location = store.moreUrl;
    // })

    $(".rank-take, .rank-pic").click(function(){
        if(store.rankData.lottery && store.rankData.lottery.imgurl){
            if($(this).hasClass("rank-take")){
                embed.singleClk(Embed.TYPE_7);
            }
            else{
                embed.singleClk(Embed.TYPE_6);
            }
            
            if(navigator.userAgent.indexOf('Android') > -1){
                window.location = store.rankData.lottery.androidDownloadUrl;
            }
            else{
                window.location = store.rankData.lottery.iosDownloadUrl;
            }  
        }
        else{
            embed.singleClk(Embed.TYPE_10);
            $(".rank").hide();
            //game.ready();
            //$(".modes").show();
            game.replay();
        }
    })

    $(".none-get").click(function(){
        embed.singleClk(Embed.TYPE_12);
        window.location = store.moreUrl;
    })

    $(".mask").on("touchmove", function(e){
        var $this = $(e.target).parents(".info-scroll");
        if($this.length == 0){
            e.preventDefault();
        }
    })

    embed.singleExp(Embed.TYPE_1);
    //embed.singleExp(Embed.TYPE_2);
    embed.singleExp(Embed.TYPE_3);
    embed.singleExp(Embed.TYPE_4);
    embed.singleExp(Embed.TYPE_13);

    var jumpInto = false;
    if(jumpInto){
        $(".modes").hide();
        game.ready();
    }

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