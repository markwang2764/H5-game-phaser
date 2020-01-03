function Broadcast(){
    var $div = $('.item-4260037');
    this.div = $div[0];
    this.list = [];
    this.tips = [];
}

Broadcast.prototype.init = function(){
    var url = hostLink("rewardInfos?nickName=jsz");
    httpGet(url, {
        sessionKey: store.sessionKey,
        gameId: store.gameId,
        dsm: getParamUrl("dsm")
    }, (data)=>{
        if(!data){
            return;
        }
        this.list = changeJson(data).data;
        $(".item-6831365").html(dataTemplate("tip-content", {list: this.list}));
    
        this.tips = [];
        if(this.list.length > 3){
            var $tips = $(".tip-cast");
            $tips.forEach((item, index)=>{
                this.tips.push(new ScrollTxt(item, index * 0.2));
            })
            setInterval(()=>{
                this.run();
            }, 30);
        }
    })
}

Broadcast.prototype.run = function(){
    var max = 0;
    this.tips.forEach((item, index)=>{
        
        if(item.y > max){
            max = item.y;
        }
    })
    this.tips.forEach((item, index)=>{
        item.update(max);
    })
}

Broadcast.prototype.show = function(){
    this.div.style.display = 'block';
}

Broadcast.prototype.hide = function(){
    this.div.style.display = 'none';
}