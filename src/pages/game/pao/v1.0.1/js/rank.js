function Rank(div){
    this.div = div;
}

Rank.prototype.show = function(){
    embed.rank = store.rankData.embed;

    embed.singleExp(Embed.TYPE_5);
    embed.singleExp(Embed.TYPE_8);

    this.div.style.display = "block";
    var data = {
        list:this.getList(store.rankData.leaderboards),
        userRank: store.rankData.rank,
        userName: store.nickName,
        userGet: store.rankData.amount
    }
    if(store.rankData.lottery && store.rankData.lottery.imgurl){
        var url = store.rankData.lottery.imgurl;
        $(".rank-pic").css("background-image", "url(" + url + ")");
        $(".rank-gift, .rank-pic").show();
        $(".rank-content").removeClass("no-ticket");
        data.list.splice(3);
        embed.singleExp(Embed.TYPE_6);
        embed.singleExp(Embed.TYPE_7);
        if(store.rankData.rank < 100){
            $(".rank-tip").html("恭喜你！获得意外收获！");
        }
        else{
            $(".rank-tip").html("别灰心，送你一份小礼物");
        }
        if(store.rankData.lottery.st_info_dpm_exposure){
            window.DB.exposure.singleExp(store.rankData.lottery.st_info_dpm_exposure);
        }
    }
    else{
        $(".rank-gift, .rank-pic").hide();
        $(".rank-content").addClass("no-ticket");
        data.list.splice(7);
        embed.singleExp(Embed.TYPE_10);
    }
    if(data.userGet > 0){
        data.userGet = "x" + data.userGet;
    }
    else{
        data.userGet = "--";
    }
    var html = dataTemplate("rank-content", data);
    $(".rank-list").html(html);
    if(store.rankData.amount == 0){
        $(".rank-last .rank-coin").hide();
    }
    /*
    if(store.rankData.rank > 4){
        $(".rank-last").show();
    }
    else{
        $(".rank-last").hide();
    }
    */
}

Rank.prototype.getList = function(list){
    var aim = [];
    for(var i = 0; i < list.length; i++){
        aim.push({
            name: list[i].userName,
            money: "x" + list[i].amount
        })
    }
    return aim;
}

Rank.prototype.hide = function(){
    this.div.style.display = "none";
}