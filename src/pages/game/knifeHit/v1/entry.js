import './src/Main'
import './entry.less'
import './src/dom/pop'

/*
var adsData = null;
var adsEmbed = null;
var embedData = null;
var resultState = "win";
var CK = CK || {};
var waiting = false;
var resultShowing = false;
var tid = 0;
var willExport = [];

$(function(){
    $.get("/common/getChickenEmbed", {
        userId: CFG.userId,
        param: CFG.param,
        gameId: getParamUrl("id")
    }, function(data){
        embedData = data.data;
        while(willExport.length){
            embedExport(willExport.shift());
        }
    })
})


function embedClick(item){
    if (item && typeof item === 'object') {
        item = JSON.stringify(item);
    }
    window.DB.exposure.singleClk({data:item});
}

function embedExport(item){
    if(!embedData){
        willExport.push(item);
        return;
    }
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

function showResultByGame(result, action){

  console.log("游戏结果：" + result);
    resultState = result;
    var rival = CK.data.getUserById(CK.data.self.rivalId) || {};

    getAds(function(data){
        console.log("请求券接口完成");
        resultShowing = true;
        adsData = data.data;
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

        if(adsData){
            adsEmbed = JSON.parse(adsData.embed);
            param.ticket = {
                ads: adsData && adsData.materialUrl,
                link: adsData && adsData.clickUrl
            }
            expAds();
        }

        popResult(param, action);
        $(".mask-bg").css("display", "flex");
    });
    
}

function hideResultByGame(){
    $(".mask-bg").css("display", "none");
    resultShowing = false;
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
            callback && callback({});
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

function popResult(arg, action){
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

        setTimeout(function(){
            window.location.reload();
        }, 300);
    })
    

    //重玩
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
                }
                else if(resultState === "lost"){
                    embedClick(embedData.img_fail_leave_click);
                }
                else{
                    embedClick(embedData.img_draw_leave_click);
                }
            }
            //CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_restart"});
            setTimeout(function(){
                window.location.reload();
            }, 300);
        }
        else if(tip === "再虐一盘"){
            embedClick(embedData.img_success_again_click);//再虐一盘
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            waiting = true;
        }
        else if(tip === "不服再战"){
            embedClick(embedData.img_fail_again_click);//不服再战
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
            waiting = true;
        }
        else if(tip === "再来一次"){
            embedClick(embedData.img_draw_again_click);//再来一次
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_again"});
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
            CK.app.evtMgr.emit({type: CK.EventType.INTER, id: "evt_agree"});
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
                    CK.app.evtMgr.emit({type: CK.EventType.INTER, id: CK.NetMsgID.leaveRsp});
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
*/