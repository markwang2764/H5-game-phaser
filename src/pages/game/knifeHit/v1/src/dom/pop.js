/// <reference path="../../../../core/ts/core.d.ts" />
import NetMsgId from "../game/NetMsgId";

var adsData = null;
var adsEmbed = null;
var embedData = null;
var resultState = "win";
var waiting = false;
var resultShowing = false;
var tid = 0;
var btnStateChange = [];
var shunt;

$(function(){
    shunt = new Shunt();
    console.log("123");
    $.get("/common/getChickenEmbed", {
        userId: CFG.userId,
        param: CFG.param,
        gameId: window.GAME.tool.getParamUrl("id"),
    }, function(data){
        console.log(data);
        embedData = data.data;
        GAME.embed.append(embedData);
        // GAME.event.on(NetMsgId.showInviteByGame, showInviteByGame);
        GAME.event.on(NetMsgId.leaveRsp, showLeaveByGame);
        GAME.event.on(NetMsgId.showLeaveByGame, showLeaveByGame);
        GAME.event.on(NetMsgId.showResultByGame, showResultByGame);
        GAME.event.on(NetMsgId.hideResultByGame, hideResultByGame);
        GAME.event.on(NetMsgId.playAgainRsp, showInviteByGame);
        // GAME.event.send(GAME.EventType.INTER, NetMsgId.playAgainRsp);
        // GAME.event.send(GAME.EventType.INTER, NetMsgId.showResultByGame, {result: "win", action: 213, word: 2});
    })
})

function Shunt(){
    this.data = null;
}

Shunt.prototype = {
    append: function(obj){
        for(var i in obj){
            if(obj[i]){
                embedData[i] = obj[i];
            }
        }
        console.warn("append");
    },
    init: function(){
        var $this = this;
        var param = {
            usk: CFG.uskA,
            gameId: window.GAME.tool.getParamUrl('id'),
            dsm: window.GAME.tool.getParamUrl('dsm'),
            dcm: window.GAME.tool.getParamUrl('dcm')
        }; 
        if (window.GAME.tool.getParamUrl("pageId")) {
            param.pageId = window.GAME.tool.getParamUrl("pageId");
        }
        
        $.get("/common/getGameGuideInfo", param, (data)=>{
            // data = JSON.parse(data);

            //更新埋点
            for(var i = 0; i < data.data.length; i++){
                $this.append(data.data[i].embed);
            }

            //保存数据
            $this.data = data.data;

            $(".other-games-item").click(function(){
                var n = $(this).index();
                var url = "";
                if(n === 0){
                    //点击埋点
                    embedClick(embedData.img_guide_first_click);
                }
                else{
                    //点击埋点
                    embedClick(embedData.img_guide_second_click);
                }
                setTimeout(()=>{
                    window.location = $this.data[n].url;
                }, 120)
            });

            $this.show();
        })
    },
    show: function(){
        if(this.data){
            //设置引流图片地址
            $(".other-games-item").eq(0).css("background-image", `url(${this.data[0].image})`);
            $(".other-games-item").eq(1).css("background-image", `url(${this.data[1].image})`);

            //曝光埋点
            embedExport(embedData.img_guide_first_exposure);
            embedExport(embedData.img_guide_second_exposure);
        }
        else{
            this.init();
        }
    }
}


function embedClick(item){
    GAME.embed.embedClick(item);
}

function embedExport(item){
    GAME.embed.embedExport(item);
}

/**
 * 外部调用显示游戏结果
 * @param {结果数据} param 
 */
function showResultByGame(param){
    var result = param.result;
    var action = param.action;
    var word = param.word;

    console.log("游戏结果：" + result);
    resultState = result;
    var userSys = GAME.data.getById(0);
    var rival = userSys.getUserById(userSys.self.rivalId) || {};

    resultShowing = true;

    if(word == 3){
        action = 213;
    }

    getAds(function(data){
        console.log("请求券接口完成");
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
            popResult(param, action, adsData.success);
        }
        else{
            popResult(param, action, false);
        }
        
        
        // popResult(param, action, adsData.success);

        if(btnStateChange.length > 0){
            btnStateChange.pop()();
            btnStateChange = [];
        }

        // resultShowing = true;
        $(".mask-bg").css("display", "flex");

        // KnifeHitWin: 0,
        // TimeWin: 1,
        // ScoreWin: 2,
        // FleeWin: 3,
        // Draw: 4,
        // KnifeHitLost: 5,
        // TimeLost: 6,
        // ScoreLost: 7,

        // 失败：
        // 扎中小球：好可惜，手滑扎中小球啦！(5)
        // 时间到：时间到！你的针数略少一些哟~(6)
        // 数量到：40针里你略逊一筹，不服再来！(7)

        // 胜利：
        // 扎中小球：好棒，手稳如你！让对手甘拜下风(0)
        // 时间到：时间到！对方针数不及你！佩服佩服~(1)
        // 数量到：40针里你遥遥领先，再虐一盘！(2)
        // 对方已离开：你太厉害啦，对方已逃跑(3)

        // 平局：
        // 棋逢对手，你们旗鼓相当~(4)

        var obj = {
            "0": "tt-suc1",
            "1": "tt-suc2",
            "2": "tt-suc3",
            "3": "tt-suc4",
            "4": "tt-draw",
            "5": "tt-los1",
            "6": "tt-los2",
            "7": "tt-los3",
        }

        $(".mask-say-tip").attr("class", "mask-say-tip " + obj[word + ""]);
        // if(word == 3){
        //     showInviteByGame();
        // }
    });
    
}

/**
 * 外部调用隐藏游戏结果
 */
function hideResultByGame(){
    $(".mask-bg").css("display", "none");
    resultShowing = false;
}

/**
 * 外部调用显示邀请
 */
function showInviteByGame(){
    console.log("显示邀请");
    waiting = false;
    
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
        $(".mask-btns .sort-normal").eq(0).html($("#dianji-btn").html());
    }
    else{
        btnStateChange.push(showInviteByGame);
        // $(".mask-btns .sort-normal").eq(0).html($("#dianji-btn").html());
    }
}

/**
 * 外部调用显示对方离开
 */
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

/**
 * 截取名字
 * @param {名字} str 
 */
function shortWord(str){
    if(!str){
        return "";
    }

    if(str.length > 5){
        return str.substr(0, 5) + "...";
    }
    return str;
}

/**
 * 请求广告券
 * @param {回调函数} callback 
 */
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
            gameId: window.GAME.tool.getParamUrl("id"),
            sessionKey: CFG.uskA,
            dsm: window.GAME.tool.getParamUrl("dsm"),
            dcm: window.GAME.tool.getParamUrl("dcm"),
            dpm: window.GAME.tool.getParamUrl("dpm"),
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

/**
 * 日志广告曝光
 */
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

/**
 * 获取用户编号
 * @param {用户编号} userId 
 * @param {时间戳} timer 
 */
function getToken(userId, timer){
    var token = hex_md5(userId + timer + "vicky");
    return token;
}


/**
 * 显示结果弹层
 * @param {玩家数据} arg 
 * @param {动作编码} action 
 */
function popResult(arg, action, hasAds){
    console.log("动作编码：" + action);
    waiting = false;
    adsEmbed = adsEmbed || {};
    $(".mask-left .mask-name").html(arg.you.name).addClass("mask-" + arg.you.sex);
    $(".mask-right .mask-name").html(arg.other.name).addClass("mask-" + arg.other.sex);

    $(".mask-left .mask-hander").css("background-image", "url(" + arg.you.header + ")");
    $(".mask-right .mask-hander").css("background-image", "url(" + arg.other.header + ")");

    $(".mask-content").attr("class", "mask-content mask-" + arg.state);

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

    //有广告券
    if(hasAds){
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
            embedExport();
            $(".mask-bar").removeClass("mask-no-ticket");
            $(".mask-btns").removeClass("mask-no-btns");
        }
        else{
            $(".mask-bar").addClass("mask-no-ticket");
            $(".mask-btns").addClass("mask-no-btns");
        }

        $(".other-games-box").hide();
        $(".mask-gift,.mask-ads").show();
    }
    else{
        $(".mask-bar").removeClass("mask-no-ticket");
        $(".mask-btns").removeClass("mask-no-btns");
        shunt.show();
        $(".other-games-box").show();
        $(".mask-gift,.mask-ads").hide();
    }
    

    //曝光
    if(arg.state === "win"){
        $(".mask-left .mask-qq").attr("class", "mask-qq mask-xiaolian");
        $(".mask-right .mask-qq").attr("class", "mask-qq mask-kulian");

        $(".mask-right .mask-hander").addClass("mask-scale");

        $(".mask-again-btn").addClass("mask-btn-zainue");

        if(arg.ticket){
            embedExport(adsEmbed.img_victory_exposure);//广告券
            embedExport(adsEmbed.btn_victory_exposure);//立即领取
        }

        embedExport(embedData.img_success_again_exposure);//再虐一盘
        embedExport(embedData.img_success_close_exposure);//关闭

        $(".mask-tip").html("太棒了！送你一份小礼物");
    }
    else if(arg.state === "lost"){
        $(".mask-left .mask-qq").attr("class", "mask-qq mask-kulian");
        $(".mask-right .mask-qq").attr("class", "mask-qq mask-xiaolian");
        $(".mask-left .mask-hander").addClass("mask-scale");

        $(".mask-again-btn").addClass("mask-btn-bufu");

        if(arg.ticket){
            embedExport(adsEmbed.img_fail_exposure);//广告券
            embedExport(adsEmbed.btn_fail_exposure);//立即领取
        }

        embedExport(embedData.img_fail_again_exposure);//不服再战
        embedExport(embedData.img_fail_close_exposure);//关闭

        $(".mask-tip").html("没关系，送你一份安慰奖");
    }
    else{
        $(".mask-left .mask-qq").attr("class", "mask-qq mask-shengqi");
        $(".mask-right .mask-qq").attr("class", "mask-qq mask-shengqi");

        $(".mask-again-btn").addClass("mask-btn-zailai");

        if(arg.ticket){
            embedExport(adsEmbed.img_draw_exposure);//广告券
            embedExport(adsEmbed.btn_draw_exposure);//立即领取
        }

        embedExport(embedData.img_draw_again_exposure);//再来一次
        embedExport(embedData.img_draw_close_exposure);//关闭

        $(".mask-tip").html("来份礼物加加油，下局一定打败TA");
    }

    var html = $("#" + arg.state + "-btns").html();
    console.log(html);
    $(".mask-btns").html(html);

    //关闭
    $(".mask-close-btn").one("click", function(){
        if(arg.state === "win"){
            embedClick(embedData.img_success_close_click);
        }
        else if(arg.state === "lost"){
            embedClick(embedData.img_fail_close_click);
        }
        else{
            embedClick(embedData.img_draw_close_click);
        }
        //CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_restart"});
        $(".mask-bg").hide();
        resultShowing = false;
        console.log('close pop.');

        //发送匹配请求
        GAME.event.send(GAME.EventType.INTER, NetMsgId.matchAgain);

        // setTimeout(function(){
        //     window.location.reload();
        // }, 300);
    })
    

    //重玩
    $(".mask-btns .sort-normal").eq(0).unbind().click(function(){
        if(GAME.net.socket.readyState === 3){
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
                }
                else if(resultState === "lost"){
                    embedClick(embedData.img_fail_leave_click);
                }
                else{
                    embedClick(embedData.img_draw_leave_click);
                }
            }
            //CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_restart"});
            GAME.event.send(GAME.EventType.INTER, NetMsgId.matchAgain);
            // setTimeout(function(){
                // window.location.reload();
            // }, 300);
        }
        else if(tip === "再虐一盘"){
            embedClick(embedData.img_success_again_click);//再虐一盘
            // CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            GAME.net.send(NetMsgId.playAgainReq);
            waiting = true;
        }
        else if(tip === "不服再战"){
            embedClick(embedData.img_fail_again_click);//不服再战
            // CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            GAME.net.send(NetMsgId.playAgainReq);
            waiting = true;
        }
        else if(tip === "再来一次"){
            embedClick(embedData.img_draw_again_click);//再来一次
            // CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            GAME.net.send(NetMsgId.playAgainReq);
            waiting = true;
        }
        else if(tip === "点击接受"){
            if(resultState === "win"){
                embedClick(embedData.img_success_accept_click);
            }
            else if(resultState === "lost"){
                embedClick(embedData.img_fail_accept_click);
            }
            else{
                embedClick(embedData.img_draw_accept_click);
            }
            // CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_agree"});
            GAME.net.send(NetMsgId.decideReq, {code: 1});
            GAME.event.send(GAME.EventType.INTER, NetMsgId.playAgree);
            hideResultByGame();
        }

        if(waiting){
            if(resultState === "win"){
                embedExport(embedData.img_success_wait_exposure);
            }
            else if(resultState === "lost"){
                embedExport(embedData.img_fail_wait_exposure);
            }
            else{
                embedExport(embedData.img_draw_wait_exposure);
            }
            
            var num = 3;
            $this.html($("#yaoqing-btn" + num).html());
            tid = setInterval(function(){
                if(--num === 0){
                    clearInterval(tid);
                    waiting = false;
                    $this.html($("#bugan-btn").html());
                    // CK.app.evtMgr.emit({type: CK.EventType.INTER, id: CK.NetMsgID.leaveRsp});
                    // GAME.event.send(GAME.EventType.INTER, NetMsgId.leaveRsp);
                }
                else{
                    $this.html($("#yaoqing-btn" + num).html());
                }
            }, 1000);
        }
    })


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
            window.location = arg.ticket.link;
        }, 240);
    })
}