function Guider(){
    this.div = $(".guider");
    this.hander = $(".hander");
    this.cir = $(".hander-cir");
    this.activity = this.getState(store.nickName);//false 已经展示过， true 未展示
    this.guiding = false;
    this.ads = null;
    this.stepNum = 1;
}

Guider.prototype.show = function(fun1, fun2){
    this.activity = false;
    this.guiding = true;
    this.div.show();
    this.cir.hide();
    $(".mask-canvas").append('<canvas id="maskcanvas" width="750" height="1206"></canvas>');
    $(".item-4865701").hide();
    $(".guider-btn").click(()=>{
        this.guiding = false;
        game.init(this.ads);
        this.hide();
    })

    $(".guider-tip1").show();

    setTimeout(() => {
        this.step(1);
        this.drawMask(235 * 2, 276 * 2);
    }, 800);

    /*
    setTimeout(()=>{
        this.step(1);
        this.cir.hide();
        setTimeout(()=>{
            this.cir.show();
        }, 300)
        fun1();
    }, 800);

    setTimeout(()=>{
        this.step(2);
        this.cir.hide();
        setTimeout(()=>{
            this.cir.show();
        }, 300)
        fun2();
    }, 2400);
    
    setTimeout(()=>{
        this.cir.hide();
        this.hander.hide();
    }, 3000)
    */
}

Guider.prototype.drawMask = function(x, y){
    var canvas = $("#maskcanvas")[0];
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, 750, 1206);
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 750, 1206);
    if(x == 0 && y == 0){
        return;
    }
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.rect(x, y, 210, 100);
    ctx.fill();
    ctx.restore();
}

Guider.prototype.next = function(){
    if(this.stepNum == 1){
        this.step(2);
        $(".guider-tip1").hide();
        $(".guider-tip2").show();
        this.drawMask(127 * 2, 329 * 2);
        this.stepNum = 2;
    }
    else if(this.stepNum == 2){
        this.cir.hide();
        this.hander.hide();
        this.div.css("pointer-events", "auto");
        $(".guider-tip2").hide();
        $(".guider-tip3").show();
        $(".guider-btn").show();
        this.drawMask(0, 0);
    }
}

Guider.prototype.hide = function(){
    this.div.remove();
}

Guider.prototype.step = function(n){
    var x, y;
    if(n == 1){
        x = 290 * 2 / 200;
        y = 294 * 2 / 200;
    }
    else if(n == 2){
        x = 183 * 2 / 200;
        y = 353 * 2 / 200;
    }
    this.hander.css("transform", `translate(${x}rem, ${y}rem)`);
    this.cir.hide();
    setTimeout(()=>{
        this.cir.show();
    }, 300)
}

Guider.prototype.getState = function(nickName){
    var app = getParamUrl("id");
    var names = localStorage.getItem(app);
    nickName = nickName ? nickName : "0";
    if(!names){
        var list = [nickName];
        var str = encodeURIComponent(JSON.stringify(list));
        localStorage.setItem(app, str);
        return true;
    }

    var str = decodeURIComponent(names);
    var list = JSON.parse(str);
    if(list.indexOf(nickName) == -1){
        list.push(nickName);
        var str = encodeURIComponent(JSON.stringify(list));
        localStorage.setItem(app, str);
        return true;
    }
    
    return false;
}