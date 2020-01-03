var adsData = null;
var adsEmbed = null;
var embedData = null;
var resultState = "win";
var CK = CK || {};
var waiting = false;
var resultShowing = false;
var tid = 0;
var willExport = [];
var fromHall = getParamUrl('tenter') ? false : true;
var shunt;
var HTTP_HOST;
var retObj = {win:'win', lost: 'lose', draw: 'draw'};

$(function(){
    shunt = new Shunt();
    HTTP_HOST = CFG.pgHost;
    $.get("/common/getChickenEmbed", {
        userId: CFG.userId,
        param: CFG.param,
        gameId: getParamUrl("id")
    }, function(data){
        embedData = data.data;
        while(willExport.length){
            embedExport(embedData[willExport.shift()]);
        }
    })
})

function gameMatching(){
    setTimeout(()=>{
        embedExport(embedData.img_matching_expose_exposure);
        if(fromHall){
          embedExport(embedData.button_task_matching_hall_exposure);
        }
        else{
          embedExport(embedData.button_task_matching_exposure);
        }
    }, 600);
}

function embedAppend(obj) {
    for (var i in obj) {
      if (obj[i]) {
        embedData[i] = obj[i];
      }
    }
    console.warn("append");
}

function embedClick(item){
    if (item && typeof item === 'object') {
        item = JSON.stringify(item);
    }
    window.DB.exposure.singleClk({data:item});
}

function embedExport(item, start){
    if(start){
        if(embedData){
            item = embedData[item];
        }
        else{
            willExport.push(item);
            return;
        }
    }
    // console.log(item);
    if (item && typeof item === 'object') {
        item = JSON.stringify(item);
    }

    window.DB.exposure.singleExp(item);
}


function getParamUrl(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null;
  }
}
/**
 * 
 * @param {string} result 赢、平、输字符串标识
 * @param {number} action 其他玩家的请求或者广播：再战、离开
 * @param {number} giftId 福利道具代码
 * @param {boolean} isBack 游戏道具领取返回标识
 * @param {object} brival 跳转后返回游戏从服务器请求到的对手玩家信息
 */
function showResultByGame(result, action, giftId, isBack, brival){
    console.log("游戏结果：%s, 福利id：%s", result, giftId);
    resultState = result;
    var rival = CK.data.getUserById(CK.data.self.rivalId) || {};

    if(!rival.name) {
        rival = brival;
    }

    getAds(function(data){
        console.log("请求券接口完成");
        resultShowing = true;
        var param = {
            you:{
                name: shortWord(CFG.nickName),
                sex: ["", "boy", "girl"][CFG.sex],
                header: CFG.headUrl
            },
            other:{
                name: shortWord(rival.name),
                sex: ["", "boy", "girl"][rival.sex],
                header: rival.avator
            },
            state: result
        };

        if(data && data.data && data.data.success){
            adsData = data.data;
            adsEmbed = adsData.advertEmbedBase;
            param.ticket = {
                ads: adsData && adsData.materialUrl,
                link: adsData && adsData.clickUrl
            }
            expAds();
            popResult(param, action, giftId, isBack, true);
        }
        else{
            popResult(param, action, giftId, isBack, false);
        }

        $(".mask-bg").css("display", "flex");
    });
    
}

function hideResultByGame(){
    $(".mask-bg").css("display", "none");
    $(".qs-dl").hide();
    resultShowing = false;
    CK.hideTask();
}

function showInviteByGame(){
    console.log("显示邀请");
    waiting = false;
    $(".mask-btns .sort-normal").eq(0).html($("#dianji-btn").html());
    if(resultShowing){
        if(resultState === "win"){
            embedExport(embedData.img_success_accept_exposure);
        }
        else if(resultState === "lost"){
            embedExport(embedData.img_fail_accept_exposure);
        }
        else{
            embedExport(embedData.img_draw_accept_exposure);
        }
    }
}

function showLeaveByGame(){
    console.log("显示对方离开");
    waiting = false;
    $(".mask-btns .sort-normal").eq(0).html($("#likai-btn").html());
    clearInterval(tid);
    if(resultShowing){
        if(resultState === "win"){
            embedExport(embedData.img_success_leave_exposure);
        }
        else if(resultState === "lost"){
            embedExport(embedData.img_fail_leave_exposure);
        }
        else{
            embedExport(embedData.img_draw_leave_exposure);
        }
    }
}

function shortWord(str){
    if(!str){
        return "";
    }

    if(str.length > 5){
        return str.substr(0, 5) + "...";
    }
    return str;
}

function getAds(callback){
    /*
    var timer = Date.now();
    $.ajax({
        url: "/third/V1/getAdvert",
        type: 'GET',
        data: {
            consumerId: CFG.userId,
            param: CFG.param,
            timeStamp: timer,
            token: getToken(CFG.userId, timer)
        },
        timeout: 2400,
        dataType: 'json',
        success: function(data){
            callback && callback(data);
        },
        error: function(xhr){
            console.log(xhr);
            callback && callback();
        }
    })
    */
    $.ajax({
        url: "/advert/getAdvert",
        type: 'GET',
        data: {
            gameId: getParamUrl("id"),
            sessionKey: CFG.uskA,
            dsm: getParamUrl("dsm"),
            dcm: getParamUrl("dcm"),
            dpm: getParamUrl("dpm"),
        },
        timeout: 2400,
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

function expAds(){
    $.get("/third/V1/showLog", {
        consumerId: CFG.userId,
        param: CFG.param,
        materialId: adsData && adsData.materialId,
        advertId: adsData && adsData.advertId,
        orderId: adsData && adsData.orderId
    }, function(){
        
    })
}

function getToken(userId, timer){
    var token = hex_md5(userId + timer + "vicky");
    return token;
}

function showLog(){
    $.get("/third/V1/commonLog", {
        type: 6,
        log: JSON.stringify({
            consumerId: CFG.userId,
            param: CFG.param,
            action: "",
            wanzhu_type: Date.now()
        })
    }, function(){
        
    })
}
// flag表明是否居中
/**
 * 弹出浮动提示信息
 * @param {string} tips 提示语句
 * @param {boolean} flag 是否居中显示标识
 * @param {boolean} keep 动画结束后是否常驻保持
 */
function showToast(tips, flag, keep) {
    $('.toast-mask').hide();
    setTimeout(()=>{
        $('.toast-mask').css('display', 'flex');
    }, 550);
    if(flag) {
        $('.toast-word').addClass("center");
    } else {
        $('.toast-word').removeClass("center");
    }
    $('.toast-word').html(tips);
    if(keep) {
        $('.toast-word').css('animation', 'keeppops 2000ms');
    } else {
        setTimeout(()=>{
            $('.toast-mask').hide();
        }, 2600)
    }
}

/**
 * 设置结果页弹层最下方”关闭“按钮的点击逻辑
 * @param {string} state 输赢标识
 */
function setCloseBtn(state) {
    $(".mask-close-btn").removeClass('guide');
    if(CFG.gameVersion == CK.Version.QsUser) {
        $(".mask-close-btn").hide();
        return;
    }
    $(".mask-close-btn").one("click", function(){
        if(state === "win"){
            embedClick(embedData.img_success_close_click);
        }
        else if(state === "lost"){
            embedClick(embedData.img_fail_close_click);
        }
        else{
            embedClick(embedData.img_draw_close_click);
        }
        $(".mask-bg").hide();
        resultShowing = false;

        setTimeout(function(){
            window.location.reload();
        }, 300);
    });
}
/**
 * 设置结果弹层中双方玩家个人信息，头像、名称、性别等
 * @param {object} arg 游戏基本信息，包括玩家信息
 */
function setPlayerInfo(arg) {
    $(".mask-left .mask-name").html(arg.you.name).addClass("mask-" + arg.you.sex);
    $(".mask-right .mask-name").html(arg.other.name).addClass("mask-" + arg.other.sex);

    $(".mask-left .mask-hander").css("background-image", "url(" + arg.you.header + ")");
    $(".mask-right .mask-hander").css("background-image", "url(" + arg.other.header + ")");

    $(".mask-content").attr("class", "mask-content mask-" + arg.state);
    if(arg.state === "win") {
        $(".mask-left .mask-qq").attr("class", "mask-qq mask-xiaolian");
        $(".mask-right .mask-qq").attr("class", "mask-qq mask-kulian");
        $(".mask-right .mask-hander").addClass("mask-scale");
        $(".mask-again-btn").addClass("mask-btn-zainue");
        $(".mask-tip").html("太棒了！送你一份小礼物");
    } else if(arg.state === "lost") {
        $(".mask-left .mask-qq").attr("class", "mask-qq mask-kulian");
        $(".mask-right .mask-qq").attr("class", "mask-qq mask-xiaolian");
        $(".mask-left .mask-hander").addClass("mask-scale");
        $(".mask-again-btn").addClass("mask-btn-bufu");
        $(".mask-tip").html("没关系，送你一份安慰奖");
    } else {
        $(".mask-left .mask-qq").attr("class", "mask-qq mask-shengqi");
        $(".mask-right .mask-qq").attr("class", "mask-qq mask-shengqi");
        $(".mask-again-btn").addClass("mask-btn-zailai");
        $(".mask-tip").html("来份礼物加加油，下局一定打败TA");
    }
}

/**
 * 设置主要操作按钮的标签文本
 * @param {number} action 对手玩家请求广播代码
 */
function setButtonLabel(action) {
    //更新按钮
    if(action){
        setTimeout(function(){
            //请求再战
            if(action === 211){
                showInviteByGame();
            }
            //玩家已离开
            else if(action === 213){
                showLeaveByGame();
            }
        }, 900);
    }
}

/**
 * 设置弹层封面区域展示内容，可能是广告券，也可能是引流入口
 * @param {object} arg 对战信息对象
 * @param {boolean} hasAds 是否有券
 */
function setBanner(arg, hasAds) {
    if(hasAds){//有广告券
        if(arg.ticket){
            $(".mask-ads").css("background-image", "url(" + arg.ticket.ads + ")");
            $(".mask-ads").unbind().click(function(){
                if(arg.state === "win"){
                    embedClick(adsEmbed.img_victory_click);
                }
                else if(arg.state === "lost"){
                    embedClick(adsEmbed.img_fail_click);
                }
                else{
                    embedClick(adsEmbed.img_draw_click);
                }
                window.location = arg.ticket.link;
            })
            $(".mask-bar").removeClass("mask-no-ticket");
            $(".mask-btns").removeClass("mask-no-btns");
        } else {
            $(".mask-bar").addClass("mask-no-ticket");
            $(".mask-btns").addClass("mask-no-btns");
        }
        $(".other-games-box").hide();
        $(".mask-gift,.mask-ads").show();
    } else { //无广告券
        $(".mask-bar").removeClass("mask-no-ticket");
        $(".mask-btns").removeClass("mask-no-btns");
        shunt.show();//展示引流入口
        $(".other-games-box").show();
        $(".mask-gift,.mask-ads").hide();
    }
}
/**
 * 设置趣晒版本封面内容
 * @param {string} state 胜负状态标识
 */
function setBannerQs(state) {
    if(!state) return;
    var url,
        host = '//yun.dui88.com/h5-mami/webgame/chicken/pop/';
    if(state === 'win') {
        url = 'qs_banner_win.png';
    } else url = 'qs_banner_lost.png';
    $(".mask-ads").css("background-image", "url(" + host + url + ")");
    $('.mask-ads').unbind().click(function () {
        var ret = retObj[state];
        embedClick(embedData["qushai_share_result_" + ret + "_click"]);
        $('.qs-share-guide').css({
            "justify-content": "center",
            "display": "flex"
        });
    });
    $(".mask-bar").removeClass("mask-no-ticket");
    $(".mask-btns").removeClass("mask-no-btns");
    $(".other-games-box").hide();
    $(".mask-tip").html("本游戏由趣晒游戏独家提供");
}

/**
 * 设置曝光信息
 * @param {object} arg 
 */
function setExposure(arg) {
    //曝光
    if(arg.state === "win"){
        if(arg.ticket && hasAds){
            embedExport(adsEmbed.img_victory_exposure);//广告券
            embedExport(adsEmbed.btn_victory_exposure);//立即领取
        }
        embedExport(embedData.img_success_again_exposure);//再虐一盘
        embedExport(embedData.img_success_close_exposure);//关闭
    } else if(arg.state === "lost"){
        if(arg.ticket && hasAds){
            embedExport(adsEmbed.img_fail_exposure);//广告券
            embedExport(adsEmbed.btn_fail_exposure);//立即领取
        }
        embedExport(embedData.img_fail_again_exposure);//不服再战
        embedExport(embedData.img_fail_close_exposure);//关闭
    } else{
        if(arg.ticket && hasAds){
            embedExport(adsEmbed.img_draw_exposure);//广告券
            embedExport(adsEmbed.btn_draw_exposure);//立即领取
        }
        embedExport(embedData.img_draw_again_exposure);//再来一次
        embedExport(embedData.img_draw_close_exposure);//关闭
    }
}
/**
 * 趣晒埋点曝光
 * @param {*} arg 
 */
function setExposureQs(arg) {
    var ret = retObj[arg.state];
    embedExport(embedData["qushai_share_result_" + ret + "_exposure"]);//立即领取
    embedExport(embedData["qushai_play_again_result_" + ret + "_exposure"]);//再虐一盘
}
/**
 * 设置游戏道具奖励提示气泡信息
 * @param {object} ticket 广告券信息
 * @param {number} giftId 福利道具id
 */
function setGiftTip(ticket, giftId) {
    if(ticket){
        if(!!giftId || giftId === 0) {
            if(giftId == 2) {
                $(".mask-gift-item").addClass('gift2');
            } else {
                $(".mask-gift-item").removeClass('gift2');
            }
            $(".mask-gift-item").show();
        } else {
            $(".mask-gift-item").hide();
        }
    }
}

/**
 * 设置趣晒奖励提示气泡
 * @param {string} state 输赢标识
 */
function setGiftTipQs(state, giftId) {
     
    var span,
        giftArr = ['', '保护罩', '子弹数+1'];
    if(state === 'win'){
        $('.qs-share-tip').removeClass('qs-lost');
        var rank = Math.floor(Math.random() * 296) + 5;
        span = "<span>30秒内全球排名</span>" + "<span style='color: #ff0000'>" + rank + "名</span>" +
        "<span>，分享到群让大家来挑战下吧";
        $('.qs-share-tip').css({
            "left": "0.15rem",
        });
        $('.qs-share-words').css({
            "left": "0.15rem",
            "width": "3.21rem",
        });
        $('.qs-share-tip').show();
        $('.qs-share-words').html(span);
    } else {
        $('.qs-share-tip').addClass('qs-lost');
        if(!!giftId) {
            span = "<span>立即分享到群解锁道具【</span>" + "<span style='color: #ff0000'>" + giftArr[giftId]
            + "</span><span>】</span>";
            $('.qs-share-tip').show();
            $('.qs-share-words').html(span);
        }
    }
    
}

function setAgainBtn(waiting, isBack) {
    $(".mask-btns .sort-normal").eq(0).unbind().click(function(){
        if(CK.app.netMgr.socket.readyState === 3){
            window.location.reload();
        }
        if(waiting){
            console.log("邀请中");
            return;
        }
        var $this = $(this);
        var tip = $this.find(".btn-word").text();
        console.log(tip);
        if(tip === "换个对手吧"){
            if($this.find(".btn-tip").text() === "（对方已离开）"){
                if(resultState === "win"){
                    embedClick(embedData.img_success_leave_click);
                } else if(resultState === "lost"){
                    embedClick(embedData.img_fail_leave_click);
                } else{
                    embedClick(embedData.img_draw_leave_click);
                }
            }
            setTimeout(function(){
                window.location.reload();
            }, 300);
        } else if(tip === "再虐一盘"){
            embedClick(embedData.img_success_again_click);//再虐一盘
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            waiting = true;
        } else if(tip === "不服再战"){
            embedClick(embedData.img_fail_again_click);//不服再战
            if(isBack) {// 处理领取道具之后的再战请求
                CK.app.netMgr.send(CK.NetMsgID.fakeMatchReq);
            } else {
                CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            }
            waiting = true;
            
        } else if(tip === "再来一次"){
            embedClick(embedData.img_draw_again_click);//再来一次
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            waiting = true;
        } else if(tip === "点击接受"){
            if(resultState === "win"){
                embedClick(embedData.img_success_accept_click);
            } else if(resultState === "lost"){
                embedClick(embedData.img_fail_accept_click);
            } else{
                embedClick(embedData.img_draw_accept_click);
            }
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_agree"});
        }
        if(waiting){
            if(resultState === "win"){
                embedExport(embedData.img_success_wait_exposure);
            } else if(resultState === "lost"){
                embedExport(embedData.img_fail_wait_exposure);
            } else{
                embedExport(embedData.img_draw_wait_exposure);
            }
            var num = 3;
            $this.html($("#yaoqing-btn" + num).html());
            tid = setInterval(function(){
                if(--num === 0){
                    clearInterval(tid);
                    waiting = false;
                    $this.html($("#bugan-btn").html());
                    CK.app.evtMgr.emit({type: CK.EventType.INTER, id: CK.NetMsgID.leaveRsp});
                } else{
                    $this.html($("#yaoqing-btn" + num).html());
                }
            }, 1000);
        }
    });
}

function setAgainBtnQs(arg, waiting, isBack) {
    $(".mask-btns .sort-normal").eq(0).unbind().click(function(){
        if(CK.app.netMgr.socket.readyState === 3){
            window.location.reload();
        }
        if(waiting){
            console.log("邀请中");
            return;
        }
        var $this = $(this);
        var tip = $this.find(".btn-word").text();
        console.log(tip);
        var ret = retObj[arg.state];
        embedClick(embedData["qushai_play_again_result_" + ret + "_click"]);
        if(tip === "换个对手吧"){
            setTimeout(function(){
                window.location.reload();
            }, 300);
        } else if(tip === "再虐一盘"){
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            waiting = true;
        } else if(tip === "不服再战"){
            if(isBack) {// 处理领取道具之后的再战请求
                CK.app.netMgr.send(CK.NetMsgID.fakeMatchReq);
            } else {
                CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            }
            waiting = true;
        } else if(tip === "再来一次"){
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            waiting = true;
        } else if(tip === "点击接受"){
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_agree"});
        }
        if(waiting){
            var num = 3;
            $this.html($("#yaoqing-btn" + num).html());
            tid = setInterval(function(){
                if(--num === 0){
                    clearInterval(tid);
                    waiting = false;
                    $this.html($("#bugan-btn").html());
                    CK.app.evtMgr.emit({type: CK.EventType.INTER, id: CK.NetMsgID.leaveRsp});
                } else{
                    $this.html($("#yaoqing-btn" + num).html());
                }
            }, 1000);
        }
    });
}

/**
 * 设置领取按钮的点击逻辑
 * @param {object} arg 
 */
function setRecieveBtn(arg) {
    //立即领取
    $(".mask-btns .sort-normal").eq(1).unbind().click(function(){
        if(arg.state === "win"){
            embedClick(adsEmbed.btn_victory_click);
        }
        else if(arg.state === "lost"){
            embedClick(adsEmbed.btn_fail_click);
        }
        else{
            embedClick(adsEmbed.btn_draw_click);
        }
        setTimeout(function(){
            if(arg.state === "lost" && (!!giftId)) {
                CK.app.netMgr.send(CK.NetMsgID.rcvReq, {gift: giftId});
            }
            window.location = arg.ticket.link;
            // 如果跳转，则不执行以下逻辑，如果不跳转直接下载app，则在本页面处理道具奖励领取
            setTimeout(()=>{
                var arr = ['', '保护罩', '子弹数+1'];
                var tips = '领取成功！<br>下局游戏将获得【' + arr[giftId] + '】，退出游戏道具失效。';
                window.showToast(tips);
            }, 500);
        }, 240);
    });
}

/**
 * 设置趣晒版本的领取按钮，文本修改为”立即分享“
 * @param {*} arg 
 */
function setRecieveBtnQs(arg) {
    $(".mask-btns .sort-normal").eq(1).find(".btn-word").html("立即分享");
    $(".mask-btns .sort-normal").eq(1).unbind().click(function(){
        var ret = retObj[arg.state];
        embedClick(embedData["qushai_share_result_" + ret + "_click"]);
        $('.qs-share-guide').css({
            "justify-content": "center",
            "display": "flex"
        });
    });
}
/**
 * 设置下载通栏样式与逻辑
 * @param {*} arg 
 */
function setQsDlBar(arg) {
    var ug = navigator.userAgent;
    if(ug.indexOf('Android') > -1) {
        var ret = retObj[arg.state];
        embedExport(embedData["qushai_download_result_" + ret + "_exposure"]);
        $('.qs-btn').unbind().click(function () {
            embedClick(embedData["qushai_download_result_" + ret + "_click"]);
            $('.qs-dl-guide').css({
                "justify-content": "center",
                "display": "flex"
            });
        });
        $('.qs-dl').show();
    }
}

function setGuideQs(arg, giftId) {
    $('.qs-share-guide').unbind().click(function () {
        $('.qs-share-guide').hide();
    });

    $('.qs-dl-guide').unbind().click(function () {
        $('.qs-dl-guide').hide();
    });
    
}
/**
 * 创建微信分享配置
 * @param {*} arg 
 * @param {*} giftId 
 */
function setWXShared(arg, giftId) {
    var parArr = [
        {prop: "gameId", key: "id"},
        {prop: "appKey", key: "appKey"},
        {prop: "slotId", key: "slotId"},
        {prop: "deviceId", key: "openId"},
        {prop: "appId", key: "appId"},
        {prop: "contextToken", key: "contextToken"},
        {prop: "deep", key: "deep"},
        {prop: "share_way", key: "share_way"},
    ];
    var param = {
        type: 2,
        url: window.location.href.split("#")[0],
        nickname: CFG.nickName
    };
    parArr.forEach((val)=>{
        var value = getParamUrl(val.key);
        if(!!value) param[val.prop] = value;
    });
    $.ajax({
        url: HTTP_HOST + "/wxLogin/share",
        dataType: "json",
        type: "get",
        data: param,
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
                var onshared = function() {
                    if(arg.state !== "win" && (!!giftId)) {
                        CK.app.netMgr.send(CK.NetMsgID.rcvReq, {gift: giftId});
                        var arr = ['', '保护罩', '子弹数+1'];
                        var tips = '领取成功！<br>下局游戏将获得【' + arr[giftId] + '】，12小时内有效。';
                        window.showToast(tips, true, false);
                    }
                    window.onSharedExposure(8);
                }
                var shareData = {
                    title: res.title,
                    desc: res.desc,
                    link: res.url,
                    imgUrl: res.imgUrl,
                    success: onshared
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
}

function popResult(arg, action, giftId, isBack, hasAds){
    setCloseBtn(arg.state);
    waiting = false;
    adsEmbed = adsEmbed || {};
    setPlayerInfo(arg);
    setButtonLabel(action);
    if(CFG.gameVersion == CK.Version.QsUser) {
        setBannerQs(arg.state);
        setExposureQs(arg);
    } else {
        CK.showTask('result');
        setBanner(arg, hasAds);
        setExposure(arg);
    }
    var html = $("#" + arg.state + "-btns").html();
    console.log(html);
    $(".mask-btns").html(html);
    if(CFG.debug) {
        arg.ticket = 1;
    } 
    if(CFG.gameVersion == CK.Version.QsUser) {
        setGiftTipQs(arg.state, giftId);
        setRecieveBtnQs(arg);
        setAgainBtnQs(arg, waiting, isBack);
        setQsDlBar(arg);
        setGuideQs(arg, giftId);
        setWXShared(arg, giftId);
    } else {
        setGiftTip(arg.ticket, giftId);
        setRecieveBtn(arg);
        setAgainBtn(waiting, isBack);
    }
    
}


function onSharedExposure(t) {
    $.get(CFG.ytHost, {
        user_id: CFG.userId,
        game_id: getParamUrl("id"),
        share_way: getParamUrl("share_way"), 
        contextToken: getParamUrl("contextToken"), 
        deep: getParamUrl("deep"), 
        shareTextId: getParamUrl("shareTextId"), 
        type : t,
    });
}
