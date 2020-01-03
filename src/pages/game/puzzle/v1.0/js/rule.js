function Rule(sel){
    Pop.call(this);
    this.init(sel);

    this.hide();

    //知道啦
    $('.item-8741438').click(()=>{
        this.hide();
    })

    //关闭
    $('.item-8719238').click(()=>{
        this.hide();
    })

    this.setData();
}

Rule.prototype = new Pop();
Rule.prototype.constructor = Rule;

Rule.prototype.setData = function(){
    var url = hostLink("getPuzzleGame?gameId=" + store.gameId);
    httpGet(url, {
        sessionKey: store.sessionKey,
        dsm: getParamUrl("dsm")
    }, (data)=>{
        data = changeJson(data);
        if(data.data){
            $(".item-8761886").html(data.data.extInfo.ruleConfig);
            setTimeout(() => {
                $(".item-8649222").append('<div class="scroll-bar"></div>');
                setTimeout(() => {
                    this.scroll();
                }, 60);
            }, 30);
        }
        else{
            pops.offline.setData(data.msg, data.code);
        }
    })
}

Rule.prototype.scroll = function(){
    var bar = $(".scroll-bar")[0];
    var $doc = $(".item-8761886");
    $doc.on('scroll', function(){
        var n = $doc.scrollTop();
        var total = $doc[0].scrollHeight - $doc.height();
        n = n / total * 90;
        bar.style.transform = "translateY(" + n + "px)";
    })
}