import JTemp from '../page/template';
import { DataSystemType, GameMode } from '../Enums';
import MessageId from '../Message'
import { isAndroid, isWeiXin, getUrlParameter ,appendUrlParameter, toDownloadUrl, isAppDownload} from '@js/utils';

var type = 0;
var level = 0;
var map = {};

export default class Rank{
    constructor(){
        this.entry = 1;
        $(".rank-close").click(()=>{
            $(".rank-mask").hide();
        })

        $(".rank-nav-btn").click((e)=>{
            var $this = $(e.currentTarget);
            var index = $this.index();
            // $(".rank-nav-btn").removeClass("selected").eq(index).addClass("selected");
            // $(".rank-box").attr("class", "rank-box move" + (index + 1));
            type = index;
            level = 0;
            window.Global.enterPlaySource = 5 + index;
            this.change(true);
        })
        
        $(".size-nav").click((e)=>{
            var $this = $(e.currentTarget);
            var index = $this.index();
            level = index;
            this.change();

            // $(this).addClass("selected").siblings().removeClass("selected");
        })

        $(".rank-mask").delegate(".item-pk", "click", (e)=>{
            var id = e.target.getAttribute("data-id");
            var obj = map[type][level][id];
            // 这里应该先发起gamemode切换的请求，成功后，执行以下逻辑
            GAME.tool.hpGet("/youtui/extreme/switchGameMode", {gameMode: GameMode.PK}, ()=>{
                var user = GAME.data.getById(DataSystemType.USER);
                if(obj.usk == user.selfId) {
                    obj.usk += 'r';
                }
                user.rival = user.createUser(obj.usk, {
                    headUrl: obj.headUrl,
                    name: obj.nickName,
                    id: obj.usk,
                    best: obj.score
                });
                user.curLevelId = level + 1;
                GAME.event.send(GAME.EventType.INTER, MessageId.start);
                GAME.event.send(GAME.EventType.INTER, MessageId.playAgain);
                Global.gameMode = GameMode.PK;
                $(".rank-mask,.result-mask").hide();
            })

        })

        $(".rank-mask").delegate(".item-fenxiang", "click", (e)=>{
            var $this = $(e.target);
            if($this.hasClass("nones")){
                return;
            }
            var scoreTime = $this.attr("data-time");
            var tip = $this.siblings(".item-shijian").html();
            console.log(tip);
            GAME.event.send(GAME.EventType.UI, MessageId.showShare, {tip: `哇，仅用了${tip}就完成了游戏<br/>分享给好友，PK谁的手速更快吧！`, entry: 5, scoreTime: scoreTime});
        });

        this.isInit = false;

    }

    clear(){
        map = {};
    }

    change(send){
        if(send){
            var extra = GAME.tool.paramWrapper([]);
            extra["page_source"] = Global.pageSource;//来源
            if(type == 0){
                GAME.embed.embedExport(GAME.tool.append2Embed("friend_rank_click", extra));
            }
            else if(type == 1){
                GAME.embed.embedExport(GAME.tool.append2Embed("global_rank_click", extra));
            }
            else if(type == 2){
                GAME.embed.embedExport(GAME.tool.append2Embed("personal_rank_click", extra));
            }
            else{
                GAME.embed.embedExport(GAME.tool.append2Embed("enter_rank_click", extra));
            }
        }

        $(".rank-nav-btn").removeClass("selected").eq(type).addClass("selected");
        $(".rank-box").attr("class", "rank-box move" + (type + 1));
        $(".haoyou-box").eq(type).find(".size-nav").eq(level).addClass("selected").siblings().removeClass("selected");

        if(!map[type]){
            map[type] = {};
        }
        if(!map[type][level]){
            var url = "/youtui/extreme/getRank";
            var param = {
                gameId: CFG.gameId,
                rankType: type + 1,
                checkPointType: level + 1,
                sourceToken: CFG.sourceToken,
                sessionKey: CFG.sessionKey
            }

            if(type == 2){
                url = "/youtui/extreme/getMyRecord";
            }
            
            GAME.tool.hpGet(url, param, (data)=>{
                console.log(data);
                map[type][level] = this.makeData(data.data, type);
                var html = this.getHtmlByData(type == 2 ? "history-list" : "rank-list", {list: map[type][level]});
                if(map[type][level].length == 0){
                    html = $("#rank-none").html();
                }
                $(".haoyou-list").eq(type).html(html);
                $(".haoyou-list").scrollTop(0);
            })
        }
        else{
            var html = this.getHtmlByData(type == 2 ? "history-list" : "rank-list", {list: map[type][level]});
            if(map[type][level].length == 0){
                html = $("#rank-none").html();
            }
            $(".haoyou-list").eq(type).html(html);
            $(".haoyou-list").scrollTop(0);
        }
    }

    makeData(data, type){
        if(type != 2){
            return data;
        }
        var list = [];
        for(var i = 1; i <= 7; i++){
            var obj = {};
            obj.name = (i + 2) + "x" + (i + 2);
            if(i <= 3){
                obj.name += " 简单";
            }
            else if(i <= 5){
                obj.name += " 中等";
            }
            else{
                obj.name += " 困难";
            }
            var temp = data[i];
            obj.time = temp;
            if(temp){
                obj.score = changeTime(temp);
                obj.cls = "";
            }
            else{
                obj.score = "暂无";
                obj.cls = " nones";
            }
            list.push(obj);
        }
        return list;
    }

    show(entry){

        if(!this.isInit){
            this.isInit = true;
            type = 1;
            $(".rank-nav-btn").eq(0).hide();
            window.Global.enterPlaySource = 6;

            // if(isWeiXin() && !getUrlParameter('appPreview')){
                
            // }
            // else{
            //     type = 1;
            //     $(".rank-nav-btn").eq(0).hide();
            //     window.Global.enterPlaySource = 6;
            // }
        }

        this.entry = entry;
        $(".rank-mask").show();
        this.change(true);

        var extra = GAME.tool.paramWrapper([]);
        if(window.Global.enterPlaySource == 0){
            extra["page_source"] = 5;
        }
        else{
            extra["page_source"] = Global.pageSource;
        }
        GAME.embed.embedExport(GAME.tool.append2Embed("enter_rank_click", extra));
    }

    getHtmlByData (sid, data) {
        var jtemp = new JTemp(sid);
        var html = jtemp.build(data);
        return html;
    }
}