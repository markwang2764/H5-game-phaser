function Game(scale){
    this.listening = false;
    this.scale = scale;
    this.row1 = new Row(-2, this.scale, -30);
    this.row2 = new Row(2, this.scale, 10);
    //this.row2 = new Row(2, this.scale, 210);
    this.row3 = new Row(-2, this.scale, 0);
    this.running = false;
    this.gun = new Gun(this.scale, $(".pao")[0]);
    this.monsters = [];
    this.timer = new Timer($(".timer")[0]);
    this.timerId = 0;
    this.score = new Score($(".score")[0]);
    this.countdown = new Countdown($(".countdown")[0], $(".count-1")[0], $(".count-2")[0], $(".count-3")[0], $(".count-go")[0]);
    this.result = new Result($(".result")[0]);
    this.coins = [];
    for(var i = 1; i <= 4; i++){
        this.coins.push(new Coin($(".coins" + i)[0], $(".coins" + i + " .coin")));
    }
    this.tip = new Tip($(".tip")[0], $(".tip-img")[0], $(".tip-name")[0], $(".tip-money")[0]);
    this.rank = new Rank($(".rank")[0]);
    this.info = new Info($(".info")[0]);
    this.guider = new Guider($(".guider")[0]);
    this.effect = new Effect($(".add-coin")[0]);
    this.started = false;
    $(".toast-mask").hide();

    //this.effect.show(90, 400, 200);

    //store.rankData = {"rank":32,"leaderboards":[{"amount":8900.0,"rank":2,"userName":"dashabi"},{"amount":4100.0,"rank":3,"userName":"***"}],"lottery":{}};//--------
    //this.rank.show();//--------
}

Game.prototype.reset = function(){
    this.row1.reset();
    this.row2.reset();
    this.row3.reset();
    this.monsters = [];
    var $monster1 = $(".row1 .monster");
    for(var i = 0; i < $monster1.length; i++){
        var monster = new Monster($monster1[i], this.monsters.length);
        this.row1.addMonster(monster);
        this.monsters.push(monster);
    }
    var $monster2 = $(".row2 .monster");
    for(var i = 0; i < $monster2.length; i++){
        var monster = new Monster($monster2[i], this.monsters.length);
        this.row2.addMonster(monster);
        this.monsters.push(monster);
    }
    var $monster3 = $(".row3 .monster");
    for(var i = 0; i < $monster3.length; i++){
        var monster = new Monster($monster3[i], this.monsters.length);
        this.row3.addMonster(monster);
        this.monsters.push(monster);
    }
    this.score.init();
}

Game.prototype.init = function(){
    this.reset();

    var $this = this;
    $(".cut").click(function(){
        $this.gun.cut();
    });

    $(".add").click(function(){
        $this.gun.add();
    });

    $(".rank-close").click(function(){
        embed.singleClk(Embed.TYPE_5);
        $this.rank.hide();
        $(".modes").show();

        //$this.ready();
        //history.back();
    });

    $(".rank-replay").click(function(){
        embed.singleClk(Embed.TYPE_8);
        $this.rank.hide();
        $this.ready();
    });

    $(".info-ico").click(function(){
        embed.singleClk(Embed.TYPE_3);
        embed.singleExp(Embed.TYPE_9);
        $this.info.show();
        if($this.started){
            $this.running = false;
        }
    });

    $(".info-close").click(function(){
        embed.singleClk(Embed.TYPE_9);
        $this.info.hide();
        if($this.started){
            $this.running = true;
        }
    });

    CFG.thirdRate && window.DB.exposure.singleExp(JSON.stringify(embed.data.st_info_exposure_get));
    $(".get").click(function(){
        embed.singleClk(Embed.TYPE_4);
        //$this.showToastMoney();
        $this.running = false;
        if (CFG.thirdRate) {
            window.CREATE && new window.CREATE.ExchangePop({
                embed: CFG.prizeEmbed,
                exchangeSuccess: function (data) {
                    //$('.new-money').text(data.amount);
                    store.amount = data.amount;
                    $this.score.update();
                },
                onClose: function(){
                    $this.running = true;
                }
            }).show();
            window.DB.exposure.singleClk({
                data: JSON.stringify(embed.data.st_info_click_get),
                callback: () => {}
            });
        }
        else{
            setTimeout(function(){
                window.location = store.moreUrl;
            }, 120);
        }
    })
}

Game.prototype.showToastMoney = function(){
    var $this = this;
    $this.running = false;
    if (CFG.thirdRate) {
        window.CREATE && new window.CREATE.ExchangePop({
            embed: CFG.prizeEmbed,
            exchangeSuccess: function (data) {
                //$('.new-money').text(data.amount);
                store.amount = data.amount;
                $this.score.update();
            },
            onClose: function(){
                $this.running = true;
            }
        }).show();
        window.DB.exposure.singleClk({
            data: JSON.stringify(embed.data.st_info_click_get),
            callback: () => {}
        });
    }
    else{
        $(".none").show();
        embed.singleExp(Embed.TYPE_11);
        embed.singleExp(Embed.TYPE_12);
        $this.running = false;

        $(".none-close").one("click", function(){
            $(".none").hide();
            $this.running = true;
            embed.singleClk(Embed.TYPE_11);
        })
        // setTimeout(function(){
        //     window.location = store.moreUrl;
        // }, 120);
    }
}

Game.prototype.ready = function(){
    var $this = this;
    this.countdown.play(function(){
        $this.start();
    });

    httpGet('/game/startGame', {userName: store.nickName}, function(data){
        store.singleId = data.id;
        //store.amount = data.amount;
    })

    httpGet('/game/getWinPublic', {}, function(data){
        console.log(data);
        $this.tip.init(data);
    })
}

Game.prototype.replay = function(){
    this.ready();
}

Game.prototype.start = function(){
    var $this = this;
    this.running = true;
    this.started = true;

    this.timerId = setInterval(function(){
        $this.update();
    }, 30);
    store.reset();
    this.timer.start();

    if(this.listening){
        return;
    }

    /*
    if(this.guider.activity){
        setTimeout(function(){
            $this.running = false;
            $this.row2.showGuider(function(monster){
                $this.guider.show(monster.x - 20, 480 * $this.scale);
            });
        }, 1200);
    }
    */

    this.listening = true;

    var canFire = true;
    var responed = true;

    document.addEventListener("touchstart", function(e){
        //e.preventDefault();
        if(e.target.className.indexOf("monster") != -1){
            if(!canFire){
                console.log("点击太快");
                return;
            }
            if(!responed){
                console.log("服务未响应");
                return;
            }
            canFire = false;
            setTimeout(function(){
                canFire = true;
            }, 125);

            if(store.isPreview){
                alert("预览页面无法进行游戏");
                return;
            }

            if($this.guider.activity){
                //return;
            }
            responed = false;
            
            if($this.running == false){
                $this.running = true;
                $this.guider.hide();
            }
            var id = e.target.getAttribute("data-id");
            var monster = $this.monsters[parseInt(id)];
            console.log(id + ", monster" + monster.monsterType + " - " + $this.gun.getValue());
            $this.gun.play(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            
            if(store.amount < $this.gun.getValue()){
                // $(".none").show();
                // embed.singleExp(Embed.TYPE_11);
                // embed.singleExp(Embed.TYPE_12);
                // $this.running = false;

                // $(".none-close").one("click", function(){
                //     $(".none").hide();
                //     $this.running = true;
                //     embed.singleClk(Embed.TYPE_11);
                // })
                e.preventDefault();
                e.stopImmediatePropagation();
                setTimeout(function(){
                    $this.showToastMoney();
                }, 300);
                responed = true;
                return false;
            }
            var param = {
                id: store.gameId,
                singleId: store.singleId,
                round: store.singleId,
                attackValue: $this.gun.getValue(),
                level: monster.monsterType
            };

            if(getParamUrl("pageId")){
                param.pageId = getParamUrl("pageId");
            }

            monster.addHit();
  
            httpGet('/game/singleDoJoin', param, function(data){
                console.log(data);
                var num = -$this.gun.getValue();

                if(data.message){
                    $this.toast(data.message);
                    responed = true;
                    return;
                }

                if(data.success){
                    monster.hide();
                    num += monster.getPrizeAmount();
                    $this.tip.hit(monster.monsterType);
                    $this.gun.showBoom(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                    $this.effect.show(e.changedTouches[0].clientX, e.changedTouches[0].clientY, monster.getPrizeAmount());
                }
                else{
                    monster.addTape();
                    $this.effect.show(e.changedTouches[0].clientX, e.changedTouches[0].clientY, data.reward ? data.reward : 0);
                }
                store.amount = data.balance;
                //$this.score.add(num);
                responed = true;
            });

            for(var i = 0; i < $this.coins.length; i++){
                if(!$this.coins[i].running){
                    $this.coins[i].show(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                    break;
                }
            }
        }
    });
}


Game.prototype.toast = function(str){
    $(".toast-mask").show();
    $(".toast").html(str);
    setTimeout(function(){
        $(".toast-mask").hide();
    }, 2000);
}

Game.prototype.over = function(){
    this.reset();
    this.running = false;
    this.started = false;
    clearInterval(this.timerId);
    var $this = this;
    httpGet('/game/getResult', {
        singleId: store.singleId,
        round: store.singleId,
    }, function(data){
        setTimeout(function(){
            $this.result.show(data);
        }, 480);
    })

    httpGet('/game/getRank', {
        id: store.gameId, 
        singleId: store.singleId, 
        round: store.singleId,
        dsm: getParamUrl("dsm"), 
        dpm: getParamUrl("dpm"), 
        dcm: getParamUrl("dcm")
    }, function(data){
        store.rankData = data;
    });

    setTimeout(function(){
        $this.rank.show();
    }, 3600);

    setTimeout(function(){
        $this.result.hide();
    }, 5000);
}

Game.prototype.update = function(){
    if(this.guider.activity){
        var monster = this.row2.getCenterMonster();
        if(monster){
            this.running = false;
            this.guider.show(monster.x - 20, 480 * this.scale);
            this.guider.activity = false;
        }
    }
    if(!this.running){
        return;
    }
    this.row1.update();
    this.row2.update();
    this.row3.update();
    this.tip.update();
    this.score.update();
    if(this.timer.over){
        this.over();
    }
}