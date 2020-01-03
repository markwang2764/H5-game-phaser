/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:26:57 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-03-30 09:55:42
 * 权益页面
 */
function Prize(){
    this.HOST = HTTP_HOST;
    this.init();
}

Prize.prototype.init = function(){
    var param = {
        sessionKey: store.sessionKey,
        gameId: store.gameId,
        dsm: getParamUrl("dsm")
    };
    if(store.directId){
        param.directId = store.directId;
    }

    var $this = this;
    
    httpGet("/puzzle/userIncome", param, (data)=>{
        data = changeJson(data);
        var ads = data.data;
        if(ads){
            this.ads = ads;
            var list = [];
            ads.actOrders.forEach(item=>{
                list.push(JSON.parse(item.couponData));
            })
            $(".quanyi-list").html(dataTemplate("quanyi-list", {list: list})).show();
    
            if(ads.actOrders.length == 0){
                $(".quanyi-list").addClass("no-prize").html('<div class="noprize-img"></div>');
            }
            else{
                this.exposureAds(ads);
            }
        }

        $(".item-8859911,.item-8776255").click((e)=>{
            var id = $(e.currentTarget).parents(".quanyi-item").index();
            
            //window.DB.exposure.singleClk({data: ads.actOrders[id].actOrderClick});
            var url = "";
            var obj = {
                dcm: ads.actOrders[id].actOrderClick.dcm,
                dpm: ads.actOrders[id].actOrderClick.dpm,
                dsm: ads.actOrders[id].actOrderClick.dsm,
                gameId: store.gameId,
                directId: store.directId
            };
            if(list[id].acgId){
                //url = HOST + "/detailPage/get?" + 'acgId=' + list[id].acgId;
                obj.acgId = list[id].acgId;
                url = urlJsonParam($this.HOST + "/detailPage/get", obj);

                var obj = {
                    gameId: store.gameId,
                    sessionKey: store.sessionKey,
                    actOrderId: ads.actOrders[id].orderId,
                    advertId: ads.actOrders[id].advertId,
                    dcm: getParamUrl("dcm"),
                    dpm: getParamUrl("dpm"),
                    dsm: getParamUrl("dsm")
                };
    
                //var url = $this.hostLink("clickPuzzleAdvert");
                httpPost($this.hostLink("clickPuzzleAdvert"), JSON.stringify(obj), function(data){
                    console.log(data);
                    window.location = url;
                })
            }
            else{
                //url = HOST + "/detailPage/get4advert?" + 'orderId=' + ads.actOrders[id].orderId + "&sessionKey=" + store.sessionKey;
                obj.orderId = ads.actOrders[id].orderId;
                obj.sessionKey = store.sessionKey;
                url = urlJsonParam($this.HOST + "/detailPage/get4advert", obj);
                window.location = url;
            }

            //window.location = url + "&dcm=" + ads.actOrders[id].actOrderClick.dcm + "&dpm=" + ads.actOrders[id].actOrderClick.dpm + "&gameId=" + store.gameId;
            //window.location = url;
        })
    });

    /*
    var list = [1,1,1,1,1,1,1,1];
    var html = dataTemplate("quanyi-list", {list: list});
    $(".quanyi-list").show().html(html);
    */
};

Prize.prototype.exposureAds = function(ads){
    /*
    $("body").css({
        "height": "100%",
        "overflow-y" : "auto"
    });
    */

    var $doc = $("html");
    var sh = $(window).height();
    var $div = $(".quanyi-item");
    var total = $div.length;
    var list = [];

    for(var i = 0; i < total; i++){
        list[i] = false;
    }

    $(document).on('scroll', function(){
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

Prize.prototype.hostLink = function(url){
    return this.HOST + "/puzzle/" + url;
}