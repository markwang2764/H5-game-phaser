function Starting(sel){
    Pop.call(this);
    this.init(sel);

    if(getParamUrl("contextToken")){
        var url = `${CFG.ytHost}?user_id=${CFG.userId}&game_id=${store.gameId}&share_way=${getParamUrl("share_way")}&contextToken=${getParamUrl("contextToken")}&deep=${getParamUrl("deep")}&shareTextId=${getParamUrl("shareTextId")}&needCharge=0&type=1`;
        $.get(url, function(){
            console.log("start log");
        })
    }

    //马上挑战
    $('.item-2180542').click(()=>{
        /*
        this.div.style.transform = "translateY(-7.2rem)";
        setTimeout(()=>{
            this.hide();
        }, 600);
        game.init();
        game.embed.singleClk(Embed.MA_SHANG);
        */
        localStorage.setItem("back", 0);
        localStorage.setItem("read", 0);
        localStorage.setItem("complete", 0);
        game.embed.singleClk(Embed.MA_SHANG);
        setTimeout(()=>{
            //window.location = HOST + "/detailPage/toGame?usk=" + store.sessionKey + "&gameId=" + store.gameId + "&isPreview=" + store.isPreview;
            //game.embed.init(()=>{
                var obj = searchToJson();
                var param = {
                    usk: store.sessionKey,
                    gameId: store.gameId,
                    isPreview: store.isPreview,
                    dcm: getParamUrl("dcm"),
                    dsm: getParamUrl("dsm")
                };

                if(getParamUrl("dpm")){
                    param.dpm = getParamUrl("dpm");
                }
                if(getParamUrl("pageId")){
                    param.pageId = getParamUrl("pageId");
                }
                appendJson(obj, param);
                var url = urlJsonParam(`${HOST}/detailPage/toGame`, obj);
                //window.location = `${HOST}/detailPage/toGame?usk=${store.sessionKey}&gameId=${store.gameId}&isPreview=${store.isPreview}&dpm=${game.embed.data.startPuzzleClick.dpm}&dcm=${game.embed.data.startPuzzleClick.dcm}`;
                window.location = url;
            //})
            
        }, 120);
    })
}

Starting.prototype = new Pop();
Starting.prototype.constructor = Starting;

Starting.prototype.initView = function(){
    game.embed.init(()=>{
        game.embed.singleExp(Embed.MA_SHANG);
        game.embed.singleExp(Embed.GUI_ZE);
        game.embed.singleExp(Embed.JIANG_PIN);
    });
};