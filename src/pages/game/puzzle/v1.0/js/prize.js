function Prize(){
    Pop.call(this);
    this.init(".my-prize");

    this.hide();
    
    this.ads = null;
    this.gameUrl = "#";
}

Prize.prototype = new Pop();
Prize.prototype.constructor = Prize;

Prize.prototype.initView = function(){
    this.setData();
    this.showPage(0);
    var $nav = $('.nav-item');

    $nav.eq(0).click(()=>{
        this.showPage(0);
        $nav.eq(0).addClass("selected").siblings().removeClass("selected");
    })

    $nav.eq(1).click(()=>{
        this.showPage(1);
        $nav.eq(1).addClass("selected").siblings().removeClass("selected");
    })

    //选择金额
    $(".jine-item").click(function(){
        $(this).addClass("selected").siblings().removeClass("selected");
    })

    //立即提现
    $(".my-tixian").click(()=>{
        this.showDetail(false);
        $(".my-yue").addClass("topcenter");
    })

    //马上开玩
    $(".my-kaiwan").click(()=>{
        //url: '/puzzle/getDirectUrl',
        window.location = this.gameUrl;
    })

    //返回
    $(".item-8772157").click(()=>{
        this.showDetail(true);
        $(".my-yue").removeClass("topcenter");
    })

    var $jine = $(".jine-num");
    $jine.eq(0).html("50元");
    $jine.eq(1).html("100元");
    $jine.eq(2).html("200元");
    $(".xuanzhe-tip").html("（奖励金额累计到50元以上才能提现哦）");
}

Prize.prototype.setData = function(){
    var url = hostLink("userIncome?sessionKey=" + store.sessionKey + "&gameId=" + store.gameId + "&directId=" + store.directId);
    httpGet(url, {
        dsm: getParamUrl("dsm")
    }, (data)=>{
        data = changeJson(data);
        var ads = data.data;
        if(ads){
            this.ads = ads;
            var list = [];
            ads.actOrders.forEach(item=>{
                if(item.couponData){
                    list.push(JSON.parse(item.couponData));
                }
            })
            $(".prize-page").html(dataTemplate("old-content", {list: list}));
    
            if(ads.actOrders.length == 0){
                $(".prize-page").addClass("no-prize");
            }
            $(".my-money-tip").html(translateAmount(ads.ubDto.rmbAmount));
            if(ads.ubDto.amount > 0){
                $(".my-jinbi").show();
                $(".my-jinbi-tip").html(ads.ubDto.amount);
            }
            else{
                $(".my-jinbi").hide();
            }

            this.setDetail(ads);
            this.fetchGameUrl();
            this.exposureAds(ads);
            this.showDetail(true);
        }
        else{
            pops.offline.setData(data.msg, data.code);
            this.showDetail(false);
        }
        

        $(".item-1438825,.item-1347345").click(function(){
            var id = $(this).parents(".prize-item").index();
            var obj = {
                gameId: store.gameId,
                sessionKey: store.sessionKey,
                actOrderId: ads.actOrders[id].orderId,
                advertId: ads.actOrders[id].advertId,
                dsm: getParamUrl("dsm"),
                dpm: getParamUrl("dpm"),
                dcm: getParamUrl("dcm")
            };

            window.DB.exposure.singleClk({data: ads.actOrders[id].actOrderClick});
            
            var url = "";
            var obj = {
                gameId: store.gameId
            };
            if(list[id].acgId){
                //url = HOST + "/detailPage/get?" + 'acgId=' + list[id].acgId;
                url = HOST + "/detailPage/get";
                obj.acgId = list[id].acgId;
            }
            else{
                //url = HOST + "/detailPage/get4advert?" + 'orderId=' + ads.actOrders[id].orderId + "&sessionKey=" + store.sessionKey;
                url = HOST + "/detailPage/get4advert";
                obj.orderId = ads.actOrders[id].orderId;
                obj.sessionKey = store.sessionKey;
            }
            obj.dcm = ads.actOrders[id].actOrderClick.dcm;
            obj.dpm = ads.actOrders[id].actOrderClick.dpm;
            obj.dsm = ads.actOrders[id].actOrderClick.dsm;

            url = urlJsonParam(url, obj);

            //window.location = url + "&dcm=" + ads.actOrders[id].actOrderClick.dcm + "&dpm=" + ads.actOrders[id].actOrderClick.dpm + "&gameId=" + store.gameId;
            //window.location = url;
            
            httpPost(hostLink("clickPuzzleAdvert"), JSON.stringify(obj), function(data){
                console.log(data);
                window.location = url;
            })
        })

        
    })
}

Prize.prototype.exposureAds = function(ads){
    var $doc = $(".my-prize");
    var sh = $(window).height();
    var $div = $(".prize-item");
    var total = $div.length;
    var list = [];

    for(var i = 0; i < total; i++){
        list[i] = false;
    }

    $doc.on('scroll', function(){
        console.log($doc.scrollTop());
        checkShow();
    })

    checkShow();

    function checkShow(){
        for(var i = 0; i < total; i++){
            var t = isShow(i);
            if(t && list[i] == false){
                list[i] = true;
                console.log("singleExp");
                var str = JSON.stringify(ads.actOrders[i].actOrderExpose);
                window.DB.exposure.singleExp(str);
            }
        }
        console.log(list);
    }

    function isShow(n){
        return sh + $doc.scrollTop() > n * 116 + 100;
    }
}

Prize.prototype.fetchGameUrl = function(){
    var url = hostLink("getDirectUrl?usk=" + store.sessionKey + "&gameId=" + store.gameId);
    httpGet(url, {
        dsm: getParamUrl("dsm")
    }, (data)=>{
        this.gameUrl = changeJson(data).data;
        if(this.gameUrl == ""){
            $(".my-kaiwan").addClass("disabled");
        }
    });
}

Prize.prototype.showPage = function(n){
    if(n == 0){
        $(".prize-page").show().siblings().hide();
    }
    else if(n == 1){
        $(".my-page").show().siblings().hide();
    }
}

Prize.prototype.showDetail = function(n){
    if(n){
        $(".mingxi-cxt").show();
        $(".tixian-cxt").hide();
        $(".my-tixian").show();
        $(".item-8772157").hide();
        if(this.ads.ubDto.amount){
            $(".my-jinbi").show();
        }
        else{
            $(".my-jinbi").hide();
        }
    }
    else{
        $(".mingxi-cxt").hide();
        $(".tixian-cxt").show();
        $(".my-tixian").hide();
        $(".item-8772157").show();
        $(".my-jinbi").hide();
    }
}

Prize.prototype.setDetail = function(data){
    var list = this.formatData(data);
    console.log(list);
    $(".mingxi-list").html(dataTemplate("detail-content", {list: list}));
}

Prize.prototype.formatData = function(data){
    var list = []
    // 遍历余额
    for (var i = 0; i < data.balanceRecordDtos.length; i++) {
        var item = data.balanceRecordDtos[i];
        // 是否提现
        item.isWithdraw = false;
        // 提现类型
        switch (item.recordType) {
          case 1:
            item.pageFrom = '首次登录奖励';
            break;
          case 2:
            item.pageFrom = '活动奖励';
            break;
          case 3:
            item.pageFrom = '任务奖励';
            break;
          case 4:
            item.pageFrom = '惊喜福利';
            break;
          case 5:
            item.pageFrom = '提现';
            item.isWithdraw = true;
            break;
          case 6:
            item.pageFrom = '游戏奖励';
            break;
          case 7:
            item.pageFrom = '游戏消耗';
            break;
          case 8:
            item.pageFrom = '每日首次';
            break;
        }
        // 交易类型添加提示文案
        item.addInfo = item.currencyType == 1 ? '（现金）' : '（金币）';
        item.pageFrom += item.addInfo;
        // 广告时间
        item.time = this.formatTime(item.gmtModified);
        // 提现金额
        //item.count = (item.isWithdraw ? '-' : '+') + (item.currencyType == 1 ? (translateAmount(item.amount) + '元') : (formatAmount(item.amount) + '个'));
        item.count = (item.changeType == 2 ? '-' : '+') + (item.currencyType == 1 ? (translateAmount(item.amount) + '元') : (formatAmount(item.amount) + '个'));
        if(item.count[0] == "-"){
            item.count = '<span class="red">' + item.count + '</span>';
        }

        list.push(item);
    }
    return list;
}

Prize.prototype.formatTime = function (str) {
    var date = new Date(str);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}