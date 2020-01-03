/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:25:28 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-06-29 18:40:50
 * 游戏主逻辑
 */
function Game(){
    this.fromJump = false;
    this.cache = null;
    this.canvas = null;
    this.stage = null;
    this.soap = null; 
    this.power = null;
    this.scene = null;
    this.levelConfig = null;
    this.guider = null;
    this.trick = null;
    this.over = null;
    this.result = null;
    this.shared = null;
    this.compete = null;
    this.board = null;
    this.score = null;
    this.passEffect = null;
}

/**
 * 每局开始
 * state=0 正常状态
 * state=1 点击道具弹窗图片，跳转落地页，返回使用道具动画
 * state=2 点击游戏结束弹窗图片或领取按钮，跳转落地页，返回结果页面
 * state=3 点击使用道具，结束本局游戏后跳转落地页，返回结果页面
 */
Game.prototype.turnStart = function(){
    loading.hide();
    pushHistory();
    
    window.addEventListener("popstate", function(e) {  
        self.location.reload();  
    }, false);

    function pushHistory() {
        var state = {
            title : "",  
            url : "#"
        };
        window.history.replaceState(state, "", "#");
    };

    this.cache = new Cache();
    this.canvas = document.getElementById("canvas");

    this.guider = new Guider();
    this.trick = new Trick();
    this.result = new Result();
    this.over = new Over();
    this.shared = new Shared();
    this.compete = new Compete();
    this.board = new Board();
    this.score = new Score();
    //this.soap = new Soap();
    this.scene = new Scene();
    this.passEffect = new PassEffect();

    var isTrick = false;

    if(this.cache.getState() == 1){
        this.score.readCache();
        store.curLevel = getDefaultSave("level", 1);
        isTrick = true;
        setTimeout(() => {
            this.cache.setState(0, "点击道具弹窗图片，跳转落地页返回");
            this.useTrick();
        }, 60);
    }
    else if(this.cache.getState() == 2){
        isTrick = true;
        this.score.readCache();
        store.curLevel = getDefaultSave("level", 1);
        setTimeout(() => {
            this.cache.setState(0, "点击游戏结束弹窗点击，跳转落地页返回");
            this.fromJump = true;
            game.showResult();
            this.fromJump = false;
        }, 60);
    }

    if(localStorage.getItem("autoJump") == 2){
        isTrick = true;
        this.score.readCache();
        store.curLevel = getDefaultSave("level", 1);
        setTimeout(() => {
            embed.update(this.cache.resultData);
            localStorage.setItem("autoJump", 0);
            this.fromJump = true;
            game.showResult();
            this.fromJump = false;
        }, 60);
    }
    
    this.levelStart(isTrick);
};

/**
 * 每局结束
 */
Game.prototype.turnEnd = function(){
    var param = {
        sessionKey: store.sessionKey,
        id: store.turnId,
        gameId: store.gameId,
        directId: store.directId,
        dsm: getParamUrl("dsm"),
        dpm: getParamUrl("dpm"),
        dcm: getParamUrl("dcm")
    };

    if(store.challengeId){
        param.challengeId = store.challengeId;
    }

    httpGet("/soap/getResult", param, (data)=>{
        data = changeJson(data);
        var isSuccess = data.data.soapPropsRsp.isSuccess; // 是否有券
        embed.update(data.data.soapyEmbedDto);
        if(!data.data.soapPropsRsp || !isSuccess){
            if(this.cache.resultData){
                var ss = this.cache.resultData.soapPropsRsp;
                data.data.soapPropsRsp = ss;
            }
            this.cache.saveResultData(data.data);
        }
        else{
            this.cache.saveResultData(data.data);
        }
        var soapProp = this.cache.resultData.soapPropsRsp;
        if(localStorage.getItem("autoJump") == 1){
          localStorage.setItem("autoJump", 2);
          this.trick.autoJump();
        }
        else{
            if(data.data.soapPropsRsp && isSuccess){
                this.over.show(data);
            }
            else{
              this.over.show(data, true);
                // game.showResult();
            }
        }
    })
};

/**
 * 每关开始
 */
Game.prototype.levelStart = function(isTrick){
    var clickDelay = 20;
    if(isTrick){
        this.passEffect.hide();
    }
    else{
        if(store.curLevel == 1){
            this.passEffect.hide();
        }
        else{
            clickDelay = 800;
            this.passEffect.show(store.curLevel);
        }
    }

    localStorage.setItem("level", store.curLevel);
    this.levelConfig = this.getLevelConfig();
    var $canvas = $(this.canvas);
    setTimeout(()=>{
        $canvas.on("touchstart", ()=>{
            console.log("touchstart");
            this.power.stop();
            this.guider.hide();
            var score = this.power.score;
            if(score == 0){
                //this.scene.play(new lib.scene1_c());
                this.scene.play("die");
            }
            else{
                //this.scene.play(new lib.scene1_b());
                if(score > 5){
                    flyAim = -1380;
                }
                else{
                    flyAim = -600;
                }
                this.scene.play("fly");
            }
    
            setTimeout(() => {
                this.playAnimation(score);
            }, 400);
    
            $canvas.off("touchstart");
        });
    }, clickDelay);

    httpGet("/soap/nextCheckpoint", {
        id: store.turnId,
        round: store.turnId,
        level: store.curLevel,
        sessionKey: store.sessionKey,
        directId: store.directId,
        gameId: store.gameId,
        dsm: getParamUrl("dsm"),
        dpm: getParamUrl("dpm"),
        dcm: getParamUrl("dcm")
    }, (data)=>{
        embed.update(data.data);
        embed.singleExp("soapyPageExpose");
    })

    this.drawStage();
    createjs.Ticker.setFPS(24);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", this.stage);
};

/**
 * 每关结束
 */
Game.prototype.levelEnd = function(pass){
    createjs.Ticker.removeEventListener("tick", this.stage);
    httpPost("/soap/updateResult", JSON.stringify({
        id: store.turnId,
        round: store.turnId,
        level: store.curLevel,
        score: this.power.score,
        sessionKey: store.sessionKey
    }), (data)=>{
        if(pass){
            store.curLevel++;
            this.levelStart();
        }
        else{
            this.turnEnd();
        }
    })    
};


/**
 * 游戏重新开始
 */
Game.prototype.restart = function(pk){
    localStorage.setItem("used", 0);
    this.score.reset();
    this.trick.reset();
    if(pk){
        location.reload();
    }
    else{
        var obj = searchToJson();
        if(obj.challengeId){
            delete obj.challengeId;
            var url = urlJsonParam(location.pathname, obj);
            location.replace(url);
        }
        else{
            location.reload();
        }
    }
};

/**
 * 游戏初始化
 */
Game.prototype.init = function(){
    var manifest =[
        {src:"long_1.jpg", id:"_long"},
        {src:"long_1.jpg", id:"long_1"},
        {src:"long_5.jpg", id:"long_2"},
        {src:"long_4.jpg", id:"long_3"},
        {src:"long_7.jpg", id:"long_4"},
        {src:"long_3.jpg", id:"long_5"},
        {src:"long_6.jpg", id:"long_6"},

        /*{src:"nqq1.png", id:"qq1"},
        {src:"nqq2.png", id:"qq2"},*/
        {src:"nqq3.png", id:"qq3"},
        {src:"nqq4.png", id:"qq4"},
        /*{src:"nqq5.png", id:"qq5"},*/
        {src:"nqq6.png", id:"qq6"},

        {src:"cloudbg.png", id:"cloudbg"},
		{src:"levelcolor.png", id:"levelcolor"},
        {src:"slider.png", id:"slider"},
        

        {src:"ban.png", id:"ban"},
        {src:"bu1.png", id:"bu1"},
        /*{src:"bgsie.png", id:"bgsie"},
		{src:"duck.png", id:"duck"},*/
		{src:"goodsa.png", id:"goodsa"},
		{src:"kuchax.png", id:"kuchax"},
		{src:"leftthumb_1.png", id:"leftthumb_1"},
		{src:"_long.png", id:"_long"},
		{src:"muzhi3.png", id:"muzhi3"},
		{src:"nfeizao.png", id:"nfeizao"},
		{src:"rightthumb_1.png", id:"rightthumb_1"},
		{src:"s1_kujiao.png", id:"s1_kujiao"},
		{src:"s1_yifu1.png", id:"s1_yifu1"},
		{src:"s3_shenti.png", id:"s3_shenti"},
		{src:"s3_youmuzhi.png", id:"s3_youmuzhi"},
		{src:"s3_yousizhi.png", id:"s3_yousizhi"},
		{src:"s3_zuomuzhi.png", id:"s3_zuomuzhi"},
		{src:"s4_shenti.png", id:"s4_shenti"},
		{src:"s4_shou.png", id:"s4_shou"},
		{src:"s5_shenti.png", id:"s5_shenti"},
		{src:"shenti_1.png", id:"shenti_1"},
		{src:"shoudix.png", id:"shoudix"},
		{src:"shoushiz4.png", id:"shoushiz4"},
		{src:"shouxin_1.png", id:"shouxin_1"},
		{src:"sizhi_1.png", id:"sizhi_1"},
		{src:"sui1.png", id:"sui1"},
		{src:"sui2.png", id:"sui2"},
		{src:"sui3.png", id:"sui3"},
		{src:"sui4.png", id:"sui4"},
		{src:"sui5.png", id:"sui5"},
		{src:"xiaochou.png", id:"xiaochou"},
		{src:"youshoua3.png", id:"youshoua3"},
		{src:"zuoyou1.png", id:"zuoyou1"}
    ];

    if(store.online){
        manifest.forEach((item)=>{
            item.src = HOST + '/h5-mami/webgame/soap/allflash/' + item.src + "";
        })
    }
    else{
        manifest.forEach((item)=>{
            item.src = './newflash/images/' + item.src;
        })
    }

    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", (evt)=>{
        if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
    });

    loader.addEventListener("complete", ()=>{
        this.turnStart();
    });
    loader.loadManifest(manifest);
};

/**
 * 绘制舞台
 */
Game.prototype.drawStage = function(){
    this.stage = new createjs.Stage(this.canvas);
    this.stage.removeAllChildren();

    this.stage.addChild(this.scene.view);

    this.power = new Power();
    this.power.init(80, 750, images["slider"], this.levelConfig.isMove, this.levelConfig.moveSpeed);
    this.power.draw(this.levelConfig.redArea, this.levelConfig.orangeArea, this.levelConfig.greenArea);
    this.stage.addChild(this.power.view);

    //this.soap.init();
    //this.stage.addChild(this.soap.view);

    if(this.cache.getState() > 0 || localStorage.getItem("autoJump") == 2){
        //this.soap.readCache(true);
        this.scene.init();
    }
    else{
        //this.soap.readCache(false);
        this.scene.init(this.scene.getRandom());
        this.scene.play("wait");
    }
    //this.scene.play("wait");

    this.guider.show();
};

/**
 * 获取难度数据
 */
Game.prototype.getLevelConfig = function(){
    var n = store.curLevel - 1;
    if(n >= store.difficultyConfigList.length){
        n = store.difficultyConfigList.length - 1;
    }
    return store.difficultyConfigList[n];
};

/**
 * 播放动画
 */
Game.prototype.playAnimation = function(score){
    var aim = 0;
    if(score > 5){
        aim = -300 - Math.random() * 400;
        //this.soap.playGreen(aim);
        setTimeout(() => {
            this.levelEnd(true);
        }, 3200);
    }
    else if(score > 0){
        aim = 400 + Math.random() * 40;
        //this.soap.playYellow(aim);
        setTimeout(() => {
            this.trick.show();
        }, 3200);
    }
    else{
        aim = 240 + Math.random() * 120;
        setTimeout(() => {
            this.levelEnd(false);
        }, 1000);
    }

    //this.scene.move(score > 0);
 
    setTimeout(()=>{
        this.score.add(score);
    }, 1000);
};

/**
 * 使用道具
 */
Game.prototype.useTrick = function(){
    embed.data.usePageExpose = JSON.parse(localStorage.getItem("usePageExpose"));
    embed.singleExp("usePageExpose");
    if (!this.trick.isVideoShow) {
      this.board.show(this.cache.trickData.materialUrl);
    } else {
      let urlArr = ['//yun.tuisnake.com/h5-mami/webgame/soap/board-img.png', '//yun.tuisnake.com/h5-mami/webgame/soap/board-img2.png'];
      this.board.show(urlArr[Math.floor(Math.random() * urlArr.length)]);
    }
    //this.soap.playJump();
    this.scene.playJump();
    setTimeout(()=>{
        this.board.hide();
        this.power.score = parseInt(localStorage.getItem("power"));
        var tid = localStorage.getItem("turnId");
        if(tid && tid != 0){
            store.turnId = localStorage.getItem("turnId");
            localStorage.setItem("turnId", 0);
        }
        this.levelEnd(true);
    }, 2400);
};

/**
 * 展示结果
 */
Game.prototype.showResult = function(){
    this.shared.setSharedData();
    if(getParamUrl("challengeId")){
        this.compete.show((n)=>{
            if(n == 0){
                //game.restart();
                game.restart(true);
            }
            else if(n == 1){
                this.shared.show();
            }
            else if(n == 2){
                var param = searchToJson();
                param.page = "soap/index";
                delete param.challengeId;
                location.replace(urlJsonParam("/wxLogin/toLoginPage", param));
            }
            else if(n == 3){
                game.restart(true);
            }
        });
    }
    else{
        this.result.show((n)=>{
            if(n == 0){
                game.restart();
            }
            else if(n == 1){
                this.shared.show();
            }
        });
    }
};