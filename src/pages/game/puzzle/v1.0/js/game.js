function Game(){
    this.broadcast = new Broadcast();
    this.result = new Result();
    this.timer = new Timer();
    this.ready = new Ready();
    this.embed = new Embed();
    this.guider = new Guider();
    this.pieces = [];
    this.playing = false;
    this.complete = false;
    this.promoteURL = "";
    this.size = {};
    this.isReadSave = false;
    this.ads = null;
}

Game.prototype.init = function(data) {
    if(data){
        this.embed.readSave();
        this.start(data);
    }
    else{
        this.embed.init(()=>{
            this.embed.getAds((data)=>{
                this.start(data);
            });
        })
    }
}

Game.prototype.start = function(data){
    this.complete = false;
    this.broadcast.init();
    this.ads = data;
    
    if(!data){
        this.result.init();
        $(".item-shine").addClass("notimes");
        $(".item-4865701").hide();
        $(".item-4927445").html("今日次数已用完，请明天再来喔");
        return;
    }
    else{
        this.result.init(data.advertId);
    }

    if(this.guider.activity){
        data.puzzleInfoDto.row = 3;
        data.puzzleInfoDto.column = 3;
        this.guider.ads = data;
    }

    localStorage.setItem("ads", JSON.stringify(data));

    if(this.isReadSave && localStorage.getItem("complete") == 1){
        this.timer.readSave();
        $(".item-5052796").html(localStorage.getItem("scoretip"));
        this.result.show();
    }
    else{
        this.timer.init();
        this.setScore(data);
        this.exposureAdvert(data);
    }

    $(".item-shine").hide();
    store.info = data;
    this.promoteURL = data.promoteURL;

    $(".item-4877349").append('<div class="wait-img"></div>');
    this.drawImage(data.advertImg, (imgData)=>{
        if(this.guider.activity){
            this.showGuider();
            this.createPuzzle(data, false, imgData);
        }
        else{
            this.createPuzzle(data, true, imgData);
        }
    });
    
}

Game.prototype.exposureAdvert = function(data){
    var obj = {
        sessionKey: store.sessionKey,
        advertId: data.advertId,
        gameId: store.gameId,
        puzzleInfoDto: data.puzzleInfoDto
    };
    var url = hostLink("exposePuzzleAdvert");
    httpPost(url, JSON.stringify(obj), function(data){
        console.log(data);
    })
}

Game.prototype.showGuider = function(){
    /*
    this.guider.show(()=>{
        setTimeout(()=>{
            this.select(7);
        }, 400);
    }, ()=>{
        setTimeout(()=>{
            this.changePiece(5, 7, true);
        }, 1000);
    });
    */
    this.guider.show();
    this.result.hide();
}

Game.prototype.drawImage = function(url, callback){
    var image = new Image();
    image.crossOrigin = "anonymous";
    //url = "https://s0.2mdn.net/5585042/17_728x90WS_2017_2_Gen_Set1_Btn1_En_.jpg";
    //url = "http://play-pre.tacota.cn/babi/img/2c63yz0kt2.gif";
    //url = url.replace(/http(s?):\/\/[^\s]+?\//,"//www.baidu.com/");
    console.log("加载开始");
    image.onload = function(){
        console.log("加载图片完成 " + url);
        if(url.substr(-4) == ".gif"){
            var canvas = $("#imgcanvas")[0];
            var ctx = canvas.getContext("2d");
            ctx.save();
            ctx.clearRect(0, 0, 640, 300);
            ctx.drawImage(image, 0, 0);
            ctx.restore();
            var dataUrl = canvas.toDataURL('image/jpeg');
            callback(dataUrl);
        }
        else{
            callback(url);
        }
    }
    image.src = url;
}

Game.prototype.createPuzzle = function(data, random, imgData){
    this.setName(data.advertName);
    var $this = this;
    var row = data.puzzleInfoDto.row;
    var col = data.puzzleInfoDto.column;
    var total = row * col;
    //var url = data.advertImg;
    var cid = -1;
    this.size = {row: row, col: col};
    
    $(".item-4877349").html(dataTemplate("piece-content", {total: total}));
    var $piece = $(".piece-item");
    $piece.css("background-image", "url(" + imgData + ")");
    $piece.click(function(){
        if($this.complete){
            $this.embed.singleClk(Embed.WAN_CHENG);
            setTimeout(()=>{

                if($this.promoteURL){
                    //window.location = $this.promoteURL;

                    redirectLink($this.promoteURL);
                    /*
                    var url = $this.promoteURL;
                    if(game.embed.data.advertExpose){
                        if(url.indexOf(HOST + "/detailPage/redirect") != -1){
                            url = url + (url.indexOf("?") == -1 ? "?" : "&");
                            url = url + "dcm=" + getParamUrl("dcm") + "&dpm=" + getParamUrl("dpm") + "&dsm=" + getParamUrl("dsm");
                        }
                    }
                    window.location = url;
                    */
                }                
            }, 60);
            return;
        }
        if(!$this.playing && !$this.guider.guiding){
            return;
        }
        var cur = $(this).index();
        if($this.guider.guiding){
            if($this.guider.stepNum == 1 && cur == 7){
                $this.guider.next();
            }
            else if($this.guider.stepNum == 2 && cur == 5){
                $this.guider.next();
            }
            else{
                console.log("按提示点击");
                return;
            }
        }
        if(cid == -1){
            cid = cur;
            $this.select(cid);
        }
        else{
            $this.changePiece(cid, cur, true);
            cid = -1;
        }
    })

    this.pieces = [];
    var len = 0;
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            var piece = new Piece($piece[len++], j, i, 3.2/col, 1.5/row);
            piece.update();
            this.pieces.push(piece);
        }
    }

    if(this.isReadSave && localStorage.getItem("complete") == 1){
        this.ready.readSave();
        this.complete = true;
        this.pieces.forEach((item)=>{
            item.over();
        })
        return;
    }

    if(random){
        setTimeout(() => {
            this.ready.start(()=>{
                $this.playing = true;
                this.random();
                while(this.checkWin()){
                    this.random();
                }
                this.pieces.forEach((item)=>{
                    item.center((col - 1) / 2, (row - 1) / 2);
                })
                setTimeout(() => {
                    $this.startCounter();
                }, 1600);
            });
        }, 900);
    }
    else{
        this.changePiece(5, 7); 
    }
}

Game.prototype.startCounter = function(){
    this.timer.start();
    var url = hostLink(`startPuzzle`);
    var obj = {
        sessionKey: store.sessionKey,
        puzzleInfoDto: store.info.puzzleInfoDto
    };
    console.log(obj);
    localStorage.setItem("complete", 0);

    httpPost(url, JSON.stringify(obj), (data)=>{

    });
}

Game.prototype.finishCounter = function(){
    localStorage.setItem("read", 1);
    localStorage.setItem("complete", 1);
    this.timer.stop();
    if(this.guider.guiding){
        this.ready.over("恭喜你拼出拼图，快来挑战下一关吧");
        return;
    }
    var url = hostLink(`finishPuzzle`);
    var obj = {
        sessionKey: store.sessionKey,
        puzzleInfoDto: store.info.puzzleInfoDto,
        advertId: store.info.advertId,
        gameId: store.gameId,
        userName: store.nickName
    };

    if(getParamUrl("pageId")){
        obj.pageId = getParamUrl("pageId");
    }

    console.log(obj);
    httpPost(url, JSON.stringify(obj), (data)=>{
        if (data.data.rewardStatus) {
            if(this.timer.counter <= store.info.puzzleInfoDto.cashCondition && data.data.rewardMoney && store.info.cashRewardTimes){
                this.ready.over(`获得${translateAmount(data.data.rewardMoney)}元现金，可在我的奖品查看`);
            }
            else if(data.data.rewardGold && store.info.goldRewardTimes){
                this.ready.over(`获得${data.data.rewardGold}个金币，可在我的奖品查看`);
            }
            else if(store.info.advertId){
                this.ready.over("恭喜您拼出拼图，立即领取权益吧");
            }
        }
        else{
            this.ready.over("恭喜你拼出拼图，快来挑战下一关吧~");
        }
    });
}

Game.prototype.random = function(){
    for(var i = 0; i < this.pieces.length; i++){
        var n = Math.floor(Math.random() * this.pieces.length);
        this.changePiece(i, n); 
    }
}

Game.prototype.select = function(n){
    this.pieces[n].select(true);
}

Game.prototype.changePiece = function(id1, id2, check){
    var piece1 = this.pieces[id1];
    var piece2 = this.pieces[id2];
    piece1.select(false);
    piece2.select(false);
    if(id1 == id2){
        return;
    }

    var x = piece1.potx;
    var y = piece1.poty;

    piece1.potx = piece2.potx;
    piece1.poty = piece2.poty;

    piece2.potx = x;
    piece2.poty = y;

    piece1.update();
    piece2.update();

    if(check && this.checkWin()){
        this.over();
    }
}

Game.prototype.checkWin = function(){
    var total = 0;
    this.pieces.forEach((item)=>{
        if(item.isRight()){
            total++;
        }
    })
    if(total == this.pieces.length){
        console.log("you win");
        return true;
    }
    return false;
}

Game.prototype.over = function(){
    this.complete = true;
    this.setResult();
    this.finishCounter();
    this.playing = false;
    var img = $(".item-4877349");
    img.removeClass("complete");
    $(".item-shine").show();
    this.pieces.forEach((item)=>{
        item.over();
    })
    setTimeout(()=>{
        img.addClass("complete");
    }, 30);
}

Game.prototype.setScore = function(data){
    var str = "";
    if(data.goldRewardTimes && data.puzzleInfoDto.integral){
        str = "积分：" + data.puzzleInfoDto.integral;
    }
    $(".item-5052796").html(str);
    localStorage.setItem("scoretip", str);
}

Game.prototype.setName = function(n){
    $(".item-4927445").html(n);
}

Game.prototype.setResult = function(){
    this.result.show();
}