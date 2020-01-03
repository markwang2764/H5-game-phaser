function Task(){
    this.init();
    this.aimList;
    this.aimObj;
    this.adsData = null;
    this.adsEmbed = null;
}

Task.prototype.init = function(){
    this.data = JSON.parse(CFG.gameTasks);
    this.data.forEach(element => {
        element.taskNum = 0;
    });

    var $this = this;
    var $list = $(".renwu-list");

    $list.delegate(".renwu-lingqu", "click", function(){
        var key = this.getAttribute("data-key");
        console.log(key);
        $this.fetch(key);
    })

    $(".renwu-wancheng").click(function(){
        var obj = $this.getComplateNotGet();
        $this.fetch(obj.taskKey);
    })

    $(".renwu-rows,.renwu-img").click(function(){
        $list.toggle();
        embed.numClick("7.1");
        setTimeout(() => {
            if($list.css("display") !== "none"){
                embed.numExport("7.2");
                if($(".renwu-wancheng").css("display") !== "none"){
                    if($this.hasComplate()){
                        embed.numExport("7.3");
                    }
                }
            }
        }, 30);
    })

    document.addEventListener('touchstart', function(e){
        var $this = $(e.target);
        if($this.parents(".renwu-short").length !== 0){
            return;
        }
        var $div = $this.parents(".renwu-list");
        if($div.length == 0){
            if($list.css("display") == "block"){
                $list.hide();
            }
        }
    })

    $(".quan-btn").click(function(){
        setTimeout(() => {
            window.location = $this.adsData.clickUrl;
        }, 120);
        $this.saveData();
        embed.numClick("7.8");
    })

    $(".quan-img").click(function(){
        setTimeout(() => {
            window.location = $this.adsData.clickUrl;
        }, 120);
        $this.saveData();
        embed.numClick("7.7");
    })

    $(".quan-close").click(function(){
        $(".quan").hide();
        embed.numClick("7.6");
        game.setPlay(true);
    })
}


Task.prototype.hasComplate = function(){
    var obj = this.aimList.find(function(value, index, arr){
        return value.num >= value.total && value.rewardStatus != 1;
    });
    return obj;
}

Task.prototype.saveData = function(){
    localStorage.setItem('autoStart', '1');
    localStorage.setItem('autoTimer', game.timer.num);
}

Task.prototype.showTip = function(){
    var n = Number(store.amount);
    var money = "约等于" + changeMoney(n) + "元现金哦~";

    var $tip1 = $(".qipao-left.qipao-box");
    var tip = "每日任务已全部完成，太棒啦~";
    if(this.aimObj){
        tip = this.aimObj.tip;
    }
    else{
        $(".renwu-rows").hide();
    }

    $(".qipao-left .qipao").width($(".qipao-left .qipao-tip").html(tip).width() - 20);

    var $tip2 = $(".qipao-right.qipao-box");
    $(".qipao-right .qipao").width($(".qipao-right .qipao-tip").html(money).width() - 20);
    
    $tip2.show();
    setTimeout(() => {
        $tip2.hide();
        $tip1.show();
    }, 2400);

    setTimeout(() => {
        $tip1.hide();
    }, 5000);

}

Task.prototype.update = function(callback){
    var $this = this;
    var data = this.data;
    $.get("/fish/getFishTaskResult", {
        gameId: getParamUrl("id")
    }, function(list){
        console.log(list);
        list = JSON.parse(list);
        list.forEach(element => {
            var obj = data.find(function(value, index, arr){
                return value.taskKey == element.taskKey;
            });
            obj.taskNum = Number(element.result);
            obj.rewardStatus = element.rewardStatus;
        });
        $this.aimList = $this.getDealList();
        $this.aimObj = $this.aimList.find(function(value, index, arr){
            return !value.rewardStatus;
        });
        callback && callback($this.aimList);
    })
}

Task.prototype.flash = function(callback){    
    var $this = this;
    this.update(function(data){
        console.log(data);
        var html = dataTemplate("renwu-items", {list: data});
        $(".renwu-items").html(html);
    
        var obj = $this.getComplateNotGet();
        if(obj){
            $(".renwu-tip").html(obj.tip);
            $(".renwu-rows .tip-color, .right-renwu .tip-color").html(obj.num);
            $(".renwu-rows .tip-total, .right-renwu .tip-total").html(obj.total);
            $(".renwu-title, .renwu-kill").css("background-image", `url(${obj.img})`);
            $(".renwu-row2").html(obj.num + "/" + obj.total);

            // if($this.aimObj.num >= $this.aimObj.total){                
            //     $(".renwu-wancheng").show();
            // }
            // else{
            //     $(".renwu-wancheng").hide();
            // }

            if(obj.taskKey == "play"){
                $(".renwu-label").html("通关");
            }
            else{
                $(".renwu-label").html("击杀");
            }
        }
        else{
            // $(".renwu-title,.renwu-box").hide();
        }
        callback && callback();
        var unobj = $this.getUnCompleteObj();

        if(unobj){
            
            if($this.allComplate()){
                $(".rank-renwu-tip").hide();
            }

            $(".rank-renwu-wz").html(unobj.warn);
            $(".rank-kill").css("background-image", `url(${unobj.img})`);
            $(".renwu-title").css("background-image", `url(${unobj.img})`);
            $(".rank-renwu-tip").show();

            $(".renwu-tip").html(unobj.tip);
            $(".renwu-box .tip-color").html(unobj.num);
            $(".renwu-box .tip-total").html(unobj.total);
            
        }
        else{
            $(".rank-renwu-tip").hide();
        }
       
        if($this.hasComplate()){
            $(".renwu-wancheng").show();
        }
        else{
            $(".renwu-wancheng").hide();
        }
    })
}

Task.prototype.fetch = function(taskKey){
    var $this = this;
    if(!taskKey){
        embed.numClick("7.4");
        setTimeout(() => {
            window.location = CFG.url;
        }, 90);
        return;
    }
    embed.numClick("7.3");
    var param = {};
    param.gameId = getParamUrl("id");
    param.taskKey = taskKey;
    if(getParamUrl("pageId")){
        param.pageId = getParamUrl("pageId");
    }
    $.get("/fish/fishTaskReward", param, function(data){
        if(typeof data == "string"){
            data = JSON.parse(data);
        }
        
        if(data.code == "200"){
            var obj = $this.getObjByKey(taskKey);
            if(taskKey !== "boss"){
                $this.showGetMoney(obj.rewardAmount);
                game.setPlay(false);
            }
            if(taskKey !== "boss" && taskKey !== "lev2"){
                setTimeout(() => {
                    $this.getReward();
                }, 1000);
            }
            else{
                setTimeout(() => {
                    game.setPlay(true);
                }, 1600);
            }

            store.amount = data.data;
            game.amount.update();
        }
        else{
            game.toast("领取失败，请重试");
        }
        $this.flash();
    })
    if(taskKey === "boss"){
        this.getBossRewardUrl();
    }
}

Task.prototype.getObjByKey = function(key){
    var obj = this.aimList.find(function(value, index, arr){
        return value.taskKey == key;
    });
    return obj;
}

Task.prototype.getBossRewardUrl = function(){
    this.saveData();
    $.get("/fish/getBossRewardUrl", {}, function(url){
        window.location = url;
    })
}

Task.prototype.showGetMoney = function(num){
    var $div = $(".receive-mask");
    $div.css("display", "flex");
    $(".receive-tip").html(num + "金币");
    setTimeout(() => {
        $div.hide();
    }, 3000);
}

Task.prototype.getDealList = function(){
    var list = [];
    var imgs = JSON.parse(CFG.monsters);
    this.data.forEach(element => {
        var item = {};
        item.taskKey = element.taskKey;
        item.rewardStatus = element.rewardStatus;
        item.rewardAmount = element.rewardAmount;
        var level = element.taskCondition - element.taskNum;
        if(element.taskKey == "play"){
            item.img = "//yun.tuisnake.com/h5-mami/webgame/fish/index/paotong5.png";
            item.tip = `玩<span class="num-color">${element.taskCondition}</span>次泡泡堂，得${element.rewardAmount}金币`;
            item.warn = `再玩<span class="num-color">${level}</span>次泡泡堂就能赢${element.rewardAmount}金币`;
        }
        else if(element.taskKey == "boss"){
            item.img = imgs[imgs.length - 1].imgUrl;
            item.tip = `击杀<span class="num-color">${element.taskCondition}</span>只boss，抽iPhone X`;
            item.warn = `再击杀<span class="num-color">${level}</span>只boss就能抽iPhone X`;
        }
        else{
            var n = parseInt(element.taskKey.substr(-1));
            item.img = imgs[n - 1].imgUrl;
            item.tip = `击杀<span class="num-color">${element.taskCondition}</span>只糖果怪赢${element.rewardAmount}金币`;
            item.warn = `再击杀<span class="num-color">${level}</span>只糖果怪就能赢${element.rewardAmount}金币`;
        }
        item.num = element.taskNum;
        item.total = element.taskCondition;
        list.push(item);
    });
    return list;
}

Task.prototype.getAimObj = function(){
    return this.aimObj;
}

Task.prototype.getUnCompleteObj = function(){
    var obj = this.aimList.find(function(value, index, arr){
        return value.total > value.num;
    });
    return obj;
}

Task.prototype.getReward = function(){
    var $this = this;
    this.getAds(function(data){
        console.log("请求券接口完成");
        var adsData = data.data;
        if(adsData){
            var adsEmbed = JSON.parse(adsData.embed);
            $this.adsData = adsData;
            $this.adsEmbed = adsEmbed;
            embed.append(adsEmbed);
            $this.expAds();
            $(".quan-img").css("background-image", `url(${adsData.materialUrl})`);
            $(".quan-name").html(adsData.advertName);
            $(".quan").css("display", "flex");

            embed.numExport("7.6");
            embed.numExport("7.7");
            embed.numExport("7.8");
        }
        else{
            game.setPlay(true);
        }
    });
}


Task.prototype.getAds = function(callback){
    var timer = Date.now();
    $.ajax({
        url: "/third/V1/getAdvert",
        type: 'GET',
        data: {
            consumerId: CFG.userId,
            param: CFG.param,
            timeStamp: timer,
            token: this.getToken(CFG.userId, timer)
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

Task.prototype.expAds = function(){
    var adsData = this.adsData;
    $.get("/third/V1/showLog", {
        consumerId: CFG.userId,
        param: CFG.param,
        materialId: adsData && adsData.materialId,
        advertId: adsData && adsData.advertId,
        orderId: adsData && adsData.orderId
    }, function(){
        
    })
}

Task.prototype.getToken = function(userId, timer){
    var token = hex_md5(userId + timer + "vicky");
    return token;
}

Task.prototype.allComplate = function(){
    var num = 0;
    this.aimList.forEach(element=>{
        if(element.num >= element.total){
            num++;
        }
    })
    if(num == this.aimList.length){
        return true;
    }
    return false;
}


Task.prototype.getComplateNotGet = function(){
    var obj = this.aimList.find(element=>{
        return element.num >= element.total && element.rewardStatus != 1;
    })
    if(!obj){
        obj = this.getUnCompleteObj();
    }
    return obj;
}

Task.prototype.allGet = function(){
    var num = 0;
    this.aimList.forEach(element=>{
        if(element.rewardStatus == 1){
            num++;
        }
    })
    if(num == this.aimList.length){
        return true;
    }
    return false;
}