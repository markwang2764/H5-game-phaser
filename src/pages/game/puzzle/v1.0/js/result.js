function Result(){
    this.has = false;
    this.div = $(".item-4229749");
    this.ads = $(".item-4260037");
    this.next = $(".next-level");
    this.take = $(".item-4914956");
    //this.over = false;

    this.take.click(()=>{
        if(game.complete){
            game.embed.singleClk(Embed.LIANG_LING);
            localStorage.setItem("complete", 1);
        }
        else{
            game.embed.singleClk(Embed.HUI_LING);
            localStorage.setItem("complete", 0);
        }

        localStorage.setItem("read", 1);

        setTimeout(()=>{
            redirectLink(game.promoteURL);
            /*
            var url = game.promoteURL;
            if(game.embed.data.advertExpose){
                if(url.indexOf(HOST + "/detailPage/redirect") != -1){
                    url = url + (url.indexOf("?") == -1 ? "?" : "&");
                    url = url + "dcm=" + getParamUrl("dcm") + "&dpm=" + getParamUrl("dpm") + "&dsm=" + getParamUrl("dsm");
                }
             
            }
            window.location = url;
            */
        }, 60);
    })

    this.next.click(()=>{
        if(this.next.hasClass("next-cant")){
            return;
        }
        localStorage.setItem("read", 0);
        localStorage.setItem("complete", 0);
        game.embed.getAds((data)=>{
            game.start(data);
            game.embed.singleClk(Embed.XIA_GUAN);
        });
    })
}

Result.prototype.init = function(has){
    //this.over = false;
    this.has = has;

    this.show(true);

    if(has){
        this.take.show();
        game.embed.singleExp(Embed.HUI_LING);
        this.next.hide();
    }
    else{
        this.take.hide();
        this.next.addClass("next-cant");
        this.next.show();
    }
    this.take.removeClass("open");

    this.ads.show();
    this.div.removeClass("has-right");
    $(".result-btns").show();
}

Result.prototype.show = function(isInit){
    //this.over = true;
    if(this.has){
        this.div.addClass("has-right");
        if(!isInit){
            game.embed.singleExp(Embed.LIANG_LING);
        }
    }
    this.next.show().removeClass("next-cant");
    this.ads.hide();
    this.take.addClass("open");
}

Result.prototype.hide = function(){
    this.ads.hide();
    this.next.hide();
}