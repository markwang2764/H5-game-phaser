function Rank(div){
    this.div = div;
    this.shunt = new Shunt();
    this.init();
}

Rank.prototype.init = function(){
    $(".boxs-list .boxs-item").click(function(){
        var n =  $(this).index();
        if(n == 0){
            $(".gx-jinbi").show();
            $(".gx-jiangli").css("display", "flex");
            $(".gx-liji").hide();
            var tid = setTimeout(()=>{
                $(".gx-jiangli").unbind().hide();
            }, 1000)

            $(".gx-jiangli").unbind().click(()=>{
                $(".gx-jiangli").unbind().hide();
                clearTimeout(tid);
            })
        }
        else if(n == 1){
            task.getReward(true);
        }
    })
}

//显示宝箱榜单
Rank.prototype.show = function(){
    embed.rank = store.rankData.embed;
    embed.append(store.rankData.embed);

    task.openType = 1;

    // embed.singleExp(Embed.TYPE_5);
    embed.singleExp(Embed.TYPE_8);
    embed.numExport("3.8");

    $(".boxs-item").eq(1).hide();
    $(".other-games-box").hide();

    $(".rank-pic").css({
        "background-image": `url(//yun.tuisnake.com/h5-mami/webgame/fish/v4/ads-bg4.png)`
    })

    this.div.style.display = "block";
    var data = {
      list:this.getList(store.rankData.leaderboards, store.rankData.rank >= 5),
      userName: store.rankData.userName,
      userGet: convertNumber(store.rankData.amount),
      userGender: getSexClass(store.rankData.sex),
      userRankClass: getRankClass(store.rankData.rank - 1),
      userRankStr: convertNumber(store.rankData.rank <= 3 ?  '' : store.rankData.rank),
      userAvatar: store.rankData.img
    }

    $(".rank-gift, .rank-pic").show();
    $(".rank-content").removeClass("no-ticket");
    data.list.splice(3);

    // embed.singleExp(Embed.TYPE_6);
    // embed.singleExp(Embed.TYPE_7);

    $(".gx-liji,.gx-jinbi").hide();

    $(".boxs-list").hide();
    $(".boxs-big").show().unbind().click(()=>{
        $(".boxs-big").hide();
        $(".boxs-list").show();

        var param = {};
        param.gameId = getParamUrl("id");
        param.dsm = getParamUrl("dsm");
        param.dcm = getParamUrl("dcm");
        if(getParamUrl("pageId")){
            param.pageId = getParamUrl("pageId");
        }
        if(getParamUrl("contextToken")){
            param.contextToken = getParamUrl("contextToken");
        }
    
        httpGet("/fish/killTreasureBox", param, function(str){
            console.log(str);
            boxData = str;
            embed.append(str.adRsp.advertEmbedBase);
            localStorage.setItem("pao_boxData", JSON.stringify(boxData));
            localStorage.setItem("pao_embed", JSON.stringify(embed));
            store.amount += str.reward;
            game.amount.update();
            game.rank.playBox();

            // embed.numExport("4.2");
            // embed.numExport("4.3");

            // embed.embedExport(embed.data.treasure_box_pic_exposure);
            // embed.embedExport(embed.data.treasure_box_pic_button_exposure);

            if(boxData.adRsp.success){
                $(".boxs-item").eq(1).show();
            }
        })
    });

    // if(autoStart || phbox.opened){
    if(phbox.opened){
        $(".boxs-big").hide();
        $(".boxs-list").show();
        if(boxData.adRsp.success){
            $(".boxs-item").eq(1).show();
        }
        $(".rank-tip").html("恭喜你！宝箱获得以下奖品：");
    }
    else{
        $(".rank-tip").html("恭喜你！获得神秘宝箱！");
    }

    $(".rank-take").unbind().click(()=>{
        autoStart = false;
        embed.numClick("3.4");
        game.ready();
        $(".result-pop, .rank").hide();
        $("#result-canvas").empty();
    });

    var html = dataTemplate("rank-content", data);
    $(".rank-list").html(html);

    if(store.rankData.rank >= 5){
        $(".third .item-rank").css("background", "none").html(store.rankData.rank - 1);
    }
}

//打开宝箱
Rank.prototype.playBox = function(){
    $(".gx-jiangli").css("display", "flex");
    $(".gx-jinbi").show();
    $(".gx-liji").hide();
    $(".gx-ads-img").css("background-image", "url(" + boxData.adRsp.materialUrl + ")");
    $(".gx-jinbi .ss").html(`恭喜获得${boxData.reward}金币`);
    $(".boxs-tip").eq(0).html(`金币X${boxData.reward}`);

    // embed.embedExport(embed.data.treasure_box_pic_exposure);
    // embed.embedExport(embed.data.treasure_box_pic_button_exposure);

    var tid = setTimeout(()=>{
        $(".gx-jinbi").hide();
        // $(".gx-liji").show();
        $(".gx-jiangli").hide();
        task.getReward(true);
        $(".gx-jiangli").unbind();
    }, 1000);

    $(".gx-jiangli").unbind().click(()=>{
        $(".gx-jiangli").unbind();
        clearTimeout(tid);
        $(".gx-jinbi").hide();
        $(".gx-jiangli").hide();
        task.getReward(true);
    })

    $(".gx-btn").unbind().click(()=>{
        // embed.numClick("4.3");
        embed.embedClick(embed.data.treasure_box_pic_button_click);
        setTimeout(()=>{
            window.location = boxData.adRsp.clickUrl;
        }, 120);

    });

    $(".gx-ads-img").unbind().click(()=>{
        // embed.numClick("4.2");
        embed.embedClick(embed.data.treasure_box_pic_click);
        setTimeout(()=>{
            window.location = boxData.adRsp.clickUrl;
        }, 120);
    });
    
    // embed.numExport("4.3");
    // embed.numExport("4.2");
    // embed.numExport("4.1");
}

Rank.prototype.jumpLink = function(data){
    var link = data.clickUrl;
    if (data.customAd === false) {
        link = link + `&dpm=${getParamUrl("dpm")}&dcm=${getParamUrl("dcm")}&dsm=${getParamUrl("dsm")}`;
    }
    setTimeout(()=>{
        window.location = link;
    }, 120);
}

Rank.prototype.getList = function(list, newRank){
    if(newRank){
        list.splice(2);
        list.push(store.rankData.preUser);
    }
    var aim = [];
    for(var i = 0; i < list.length; i++){
        var n = i;
        if(newRank && i == 1){
            n = -1;
        }
        aim.push({
            name: list[i].userName,
            money: convertNumber(list[i].amount),
            gender: getSexClass(list[i].sex),
            rankClass: getRankClass(n),
            rankStr: convertNumber(i < 3 ?  '' :i + 1),
            avatar: list[i].img
        })
    }
    return aim;
}

//直接显示广告券榜单
Rank.prototype.showAds = function(ads){
    embed.rank = store.rankData.embed;
    task.openType = 1;
    embed.append(store.rankData.embed);

    embed.singleExp(Embed.TYPE_8);
    embed.numExport("3.8");

    $(".boxs-item").eq(1).hide();
    $(".other-games-box,.boxs-big,.boxs-list").hide();

    $(".rank-pic").css("background-image", `url(${ads.materialUrl})`);
    $(".rank-take,.rank-replay,.rank-renwu-tip").addClass("show");

    this.div.style.display = "block";
    var data = {
        list:this.getList(store.rankData.leaderboards, store.rankData.rank >= 5),
        userName: store.rankData.userName,
        userGet: convertNumber(store.rankData.amount),
        userGender: getSexClass(store.rankData.sex),
        userRankClass: getRankClass(store.rankData.rank - 1),
        userRankStr: convertNumber(store.rankData.rank <= 3 ?  '' : store.rankData.rank),
        userAvatar: store.rankData.img
    }

    $(".rank-gift, .rank-pic").show();
    $(".rank-content").removeClass("no-ticket");
    data.list.splice(3);

    // embed.singleExp(Embed.TYPE_6);
    // embed.singleExp(Embed.TYPE_7);

    // embed.numExport("4.2");
    // embed.numExport("4.3");

    embed.embedExport(embed.data.treasure_box_pic_button_exposure);
    embed.embedExport(embed.data.treasure_box_pic_exposure);

    // embed.embedExport(embed.data.task_advert_get_exposure);
    // embed.embedExport(embed.data.task_advert_exposure);


    var html = dataTemplate("rank-content", data);
    $(".rank-list").html(html);

    $(".rank-pic").unbind().click(()=>{
        this.jumpLink(ads);
        // embed.singleClk(Embed.TYPE_6);
        // embed.numClick("4.2");
        
        // embed.embedClick(embed.data.treasure_box_pic_click);
        embed.embedClick(embed.data.treasure_box_pic_click);
        $(".rank-pic").unbind();
    });

    $(".rank-take").unbind().click(()=>{
        this.jumpLink(ads);
        // embed.singleClk(Embed.TYPE_7);
        // embed.numClick("4.3");
        $(".rank-take").unbind();
        // embed.embedClick(embed.data.treasure_box_pic_button_click);
        embed.embedClick(embed.data.treasure_box_pic_button_click);
    });

    if(store.rankData.rank >= 5){
        $(".third .item-rank").css("background", "none").html(store.rankData.rank - 1);
    }
}

//显示流量游戏榜单
Rank.prototype.showOtherGames = function(){
    embed.rank = store.rankData.embed;
    embed.append(store.rankData.embed);

    $(".rank-gift,.rank-pic,.boxs-big,.boxs-list").hide();
    $(".other-games-box").show();
    this.shunt.show();

    this.div.style.display = "block";
    var data = {
        list:this.getList(store.rankData.leaderboards, store.rankData.rank >= 5),
        userName: store.rankData.userName,
        userGet: convertNumber(store.rankData.amount),
        userGender: getSexClass(store.rankData.sex),
        userRankClass: getRankClass(store.rankData.rank - 1),
        userRankStr: convertNumber(store.rankData.rank <= 3 ?  '' : store.rankData.rank),
        userAvatar: store.rankData.img
    }

    data.list.splice(3);
    // embed.singleExp(Embed.TYPE_6);
    // embed.singleExp(Embed.TYPE_7);

    var html = dataTemplate("rank-content", data);
    $(".rank-list").html(html);

    $(".rank-take").unbind().click(()=>{
        autoStart = false;
        embed.numClick("3.4");
        game.ready();
        $(".result-pop, .rank").hide();
        $("#result-canvas").empty();
    });

    if(store.rankData.rank >= 5){
        $(".third .item-rank").css("background", "none").html(store.rankData.rank - 1);
    }
}


Rank.prototype.hide = function(){
    this.div.style.display = "none";
}