import MessageId from '../Message'
import WelcomePop from '../page/welpop/index'
import { GameMode } from '../Enums';

export default class Result{
    constructor(){
        this.data = {};
        this._timer = 0;
        this.welcomePop = new WelcomePop({
            onDouble: ()=>{
                GAME.event.send(GAME.EventType.UI, MessageId.showShare, {tip: "玩游戏拿了" + this.data.triggerRedPack.toFixed(2) + "块，帮我点一下翻倍", entry: 1, layer: 1});
            },
            onClose: ()=>{
                GAME.event.send(GAME.EventType.UI, MessageId.showCash, {});
            }
        });

        $(".rank-see").click(()=>{
            GAME.event.send(GAME.EventType.UI, MessageId.showRank, this.data.currentScore <= this.data.bestScore ? 1 : 2);
        })
        
        $(".tixian").click(()=>{
            GAME.event.send(GAME.EventType.UI, MessageId.showCash, {});
            var extra = GAME.tool.paramWrapper([]);
            extra["page_source"] = Global.pageSource;
            extra["bonus"] = parseFloat($(".fecth-num").html());
            GAME.embed.embedExport(GAME.tool.append2Embed("pick_out_bonus_click", extra));
        })

        $(".mingxi").click(()=>{
            GAME.event.send(GAME.EventType.UI, MessageId.showDetail, {num: 100});
        })

        $(".result-close").click(()=>{
            // 这里应该先发起gamemode切换的请求，成功后，执行以下逻辑
            GAME.tool.hpGet("/youtui/extreme/switchGameMode", {gameMode: GameMode.LEVEL}, (res)=>{
                if(res.success){
                    GAME.event.send(GAME.EventType.UI, MessageId.returnStart, {num: 100});
                    Global.gameMode = GameMode.LEVEL;
                }
                
                this.hide();
                Global.page = 0;
                Global.pageSource = 5;
            })
        })

        $(".again-btn").click(()=>{
            GAME.event.send(GAME.EventType.UI, MessageId.playAgain, {num: 100});
            GAME.event.send(GAME.EventType.INTER, MessageId.start, null);
            this.hide();
            window.Global.enterPlaySource = 3;
        })

        $(".shared-btn").click(()=>{
            var entry = 2;
            // var tip = "本次全球排名第" + this.data.global + "名，<br/>分享到群让大家来挑战下吧";
            var tip = "我的手速超过全世界" + this.data.prevail + "%的人，你敢来挑战吗？";
            if(this.data.prevail < 60){
                tip = `这道题太难了，我只战胜了全世界${this.data.prevail}%的人`;
                entry = 3;
            }
            GAME.event.send(GAME.EventType.UI, MessageId.showShare, {tip: tip, entry: entry});
        })

    }

    show(data){
        Global.page = 1;
        data.currentScore = Math.floor(data.currentScore);
        this.data = data;
        console.log(data);
        showAccounts(data.bonus);
        $(".result-mask").show();
        this.newStep($(".score-now"), data.currentScore, Math.floor(data.currentScore / 40));
        $(".score-history").html(changeTime(data.bestScore));
        $(".rank-per").html(data.prevail + '%');
        $(".rank-number").html(data.global);
        
        if(data.currentScore <= data.bestScore){
            console.log("new recorde");
            $(".result-jilu").hide();
            setTimeout(function(){
                $(".result-jilu").show();
            }, 1200);
        }
        else{
            $(".result-jilu").hide();
        }

        // console.warn("debug");
        // this.welcomePop.show("3.18");

        if(!CFG.isPreview && data.triggerRedPack){
            setTimeout(() => {
                var num = data.triggerRedPack;
                this.welcomePop.show(num.toFixed(2));

                var extra = GAME.tool.paramWrapper([]);
                GAME.embed.embedExport(GAME.tool.append2Embed("red_pack_click", extra));
            }, 1200);
        }

        Global.scoreTime = data.currentScore;
        Global.scoreRank = data.prevail;
        
        var extra = GAME.tool.paramWrapper([]);
        if(data.prevail < 60){
            $(".shared-btn").addClass("fail");
            Global.pageSource = 1;
            $(".result-chaoyue").html("太遗憾了，您的手速还需多加练习！");
            $(".result-kexuejia").html(`<img src="//yun.dui88.com/h5-mami/webgame/game/focus/v1/assets/headers.png" class="kexuejia-img">`);
        }
        else if(data.prevail < 75){
            $(".shared-btn").removeClass("fail");
            Global.pageSource = 2;
            $(".result-chaoyue").html(`恭喜您，您的手速超越了<span class="mingren">西门吹雪、容嬷嬷</span>`);
            $(".result-kexuejia").html(`<img src="//yun.dui88.com/h5-mami/webgame/game/focus/v1/assets/xue.png" class="kexuejia-img"><img src="//yun.dui88.com/h5-mami/webgame/game/focus/v1/assets/rong.png" class="kexuejia-img">`);
        }
        else if(data.prevail < 85){
            $(".shared-btn").removeClass("fail");
            Global.pageSource = 3;
            $(".result-chaoyue").html(`恭喜您，您的手速超越了<span class="mingren">小李飞刀、贝多芬</span>`);
            $(".result-kexuejia").html(`<img src="//yun.dui88.com/h5-mami/webgame/game/focus/v1/assets/dao.png" class="kexuejia-img"><img src="//yun.dui88.com/h5-mami/webgame/game/focus/v1/assets/bei.png" class="kexuejia-img">`);
        }
        else{
            $(".shared-btn").removeClass("fail");
            Global.pageSource = 4;
            $(".result-chaoyue").html(`恭喜您，您的手速超越了<span class="mingren">加藤鹰</span>`);
            $(".result-kexuejia").html(`<img src="//yun.dui88.com/h5-mami/webgame/game/focus/v1/assets/teng.png" class="kexuejia-img">`);
        }

        extra["result_type"] = Global.pageSource;

        if(Global.gameMode == GameMode.LEVEL){
            extra["page_source_type"] = 1;
        }
        else if(Global.gameMode == GameMode.PK){
            extra["page_source_type"] = 2;
        }
        else{
            extra["page_source_type"] = 3;
        }
        GAME.embed.embedExport(GAME.tool.append2Embed("game_result_click", extra));
    }

    hide(){
        $(".result-mask").hide();
    }

    newStep($div, num, step) {
        setTimeout(()=>{
            if(this._timer >= num) {
                this._timer = num;
                var str = changeTime(this._timer);
                $div.html(str);
                this._timer = 0;
                return;
            } else {
                this._timer += step;
                var str = changeTime(this._timer);
                $div.html(str);
                this.newStep($div, num, step);
            }
        }, 20)
    }

    stepInt($div, num){
        var obj = {aim: 0};
        anime({
            targets: obj,
            aim: num,
            round: 1,
            duration: 2000,
            update: function(){
                var str = changeTime(obj.aim);
                $div.html(str);
            }
        })
    }

    stepFloat($div, num, format){
        var obj = {aim: 0};
        format = format || "";
        anime({
            targets: obj,
            aim: num,
            duration: 2000,
            update: function(){
                $div.html(obj.aim.toFixed(2) + format);
            }
        })
    }
}