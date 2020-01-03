function Game(scale) {
  this.listening = false;
  this.scale = scale;
  // this.row1 = new Row(-2, this.scale, -30);
  // this.row2 = new Row(2, this.scale, 10);
  // this.row3 = new Row(-2, this.scale, 0);
  this.running = false;
  this.gun = new Gun(this.scale, $(".pao")[0]);
  this.monsters = [];
  this.timer = new Timer($(".timer")[0]);
  this.timerId = 0;
  this.score = new Score($(".score")[0]);
  this.countdown = new Countdown($(".countdown")[0], $(".count-1")[0], $(".count-2")[0], $(".count-3")[0], $(".count-go")[0]);
  this.result = new Result($(".result")[0]);
  // this.coins = [];
  // for (var i = 1; i <= 4; i++) {
  //   this.coins.push(new Coin($(".coins" + i)[0], $(".coins" + i + " .coin")));
  // }
  this.tip = new Tip($(".tip")[0], $(".tip-img")[0], $(".tip-name")[0], $(".tip-money")[0]);
  this.rank = new Rank($(".rank")[0]);
  this.info = new Info($(".info")[0]);
  //this.guider = new Guider($(".guider")[0]);
  this.effect = new Effect($(".add-coin")[0]);
  this.started = false;
  this.guiderMonster = null;
  this.amount = new Amount($('.player-info .amount')[0]);
  //this.effect.show(90, 400, 200);

  //store.rankData = {"rank":32,"leaderboards":[{"amount":8900.0,"rank":2,"userName":"dashabi"},{"amount":4100.0,"rank":3,"userName":"***"}],"lottery":{}};//--------
  //this.rank.show();//--------
}

Game.prototype.reset = function () {
  // this.row1.reset();
  // this.row2.reset();
  // this.row3.reset();

  /*
  phrows.forEach(function(item){
      item.reset();
  })
  */

  /*
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
  */
  this.amount.init();
  this.score.init();
  phcombo && phcombo.reset(true);
  phclock && phclock.reset();
  phbox && phbox.reset();
}

Game.prototype.init = function () {

  $(".warning-mask").css({
    "width": window.innerWidth + "px",
    "height": window.innerHeight + "px"
  })

  this.reset();

  var $this = this;
  $(".cut").click(function () {
    $this.gun.cut();
  });

  $(".add").click(function () {
    $this.gun.add();
  });

  $(".rank-close").click(function () {
    embed.singleClk(Embed.TYPE_16);
    
    $this.rank.hide();
    onExitGame();
    
    /*
    embed.numClick("3.8");
    var pageId = getParamUrl("pageId");
    var param = {};
    if(pageId){
      param.pageId = pageId;
    }
    $.get("//" + location.host + "/common/getDuibaUrl", param, function(data){
      window.location = JSON.parse(data).data;
    })
    */
  });

  $(".rank-replay").click(function () {
    embed.singleClk(Embed.TYPE_8);
    $this.rank.hide();
    $this.ready();
    $(".rank-take,.rank-replay,.rank-renwu-tip").removeClass("show");
  });

  $(".info-ico").click(function () {
    embed.singleClk(Embed.TYPE_3);
    embed.singleExp(Embed.TYPE_9);
    $this.info.show();
    if ($this.started) {
      $this.running = false;
    }
  });

  $(".info-close").click(function () {
    embed.singleClk(Embed.TYPE_9);
    $this.info.hide();
    if ($this.started) {
      $this.running = true;
    }
  });

  this.addEvents();

}

Game.prototype.addEvents = function () {
  var $this = this;
  var canFire = true;
  var responed = true;

  hitSignal.add(function (e) {
    if (e.type === "show_guider") {
      phguider.show(e.x, e.y);
      phready = false;
      $this.guiderMonster = e.aim;
      this.running = false;
    }
    else if (e.type === "show_boss") {
      setTimeout(function () {
        $(".warning").show();
      }, 1200);
      setTimeout(function () {
        $(".warning").hide();
      }, 4200);
      showBoss();
    }
    else if (e.type === "game_over") {
      phboss.hide();
      stopMusic();
      /*
      if(!phover){
          App = {game: phgame};
          phover = new MG.OverPage();

          phover.show({
              new: true,
              gold: 1345,
              kill: 555
          });
      }
      */
    }
    else if (e.type === "hide_boss") {
      $this.monsterEnter("hide boss");
      stopMusic();
    }
    else {
      if (!canFire) {
        console.log("点击太快");
        return;
      }
      if (!responed) {
        console.log("服务未响应");
        return;
      }
      canFire = false;
      setTimeout(function () {
        canFire = true;
      }, 120);

      if (store.isPreview) {
        alert("预览页面无法进行游戏");
        return;
      }

      $this.gun.play(e.x * scale, e.y * scale);

      if ($this.gun.freeTimes <= 0 && store.amount < $this.gun.getValue()) {
        phready = false;
        $this.running = false;
        $this.showNoMoney();
        return;
      }

      var monster = null;
      if (e.type === "hit_monster") {
        monster = phrows[e.row].getMonster(e.id);
        phboom.show(e.x, e.y);
        phguider.hide();
      }
      else if(e.type === "hit_box"){
        console.log("hit box");
        return;
      }
      else {
        phbossFire.show(e.x, e.y);
        //phcombo.show(e.x, e.y);
        //phboss.die();
      }

      var param = {
        id: store.gameId,
        singleId: store.singleId,
        round: store.singleId,
        attackValue: $this.gun.getValue(),
        level: monster ? monster.level : store.boss.level,
      };

      if (getParamUrl("pageId")) {
        param.pageId = getParamUrl("pageId");
      }

      //monster.addHit();
      responed = false;
      httpGet('/fish/singleDoJoin', param, function (data) {
        // ajax进入error，避免出现一次ajax error后导致后面游戏无法参与
        if (!data) {
          responed = true;
        }
        // console.log(data);
        // var num = -$this.gun.getValue();
        var num = 0; // 本局金币只计算获取到的金币数

        if (data.message) {
          $this.toast(data.message);
          responed = true;
          return;
        }

        if (data.success) {
          pheffect.show(e.x, e.y, 12);

          if (monster) {
            //monster.shake();
            num += monster.getPrizeAmount();
            $this.tip.hit(monster.level);
            $this.effect.show(e.x, e.y, monster.getPrizeAmount());
            monster.die();
            playCoinMusic();
          }
          else {
            num += store.boss.prizeAmount;
            $this.tip.showKillBoss();
            $this.effect.show(e.x, e.y, store.boss.prizeAmount);
            phboss.die();
            bossIsDie = true;
            phcombo.hide();
            phclock.hideFire();
            $this.monsterEnter("boss die");
            phcombo.show(e.x, e.y, store.boss.prizeAmount);
            $this.timer.jumpOver();
          }

          task.flash();
        }
        else {
          //monster.addTape();
          //$this.effect.show(e.changedTouches[0].clientX, e.changedTouches[0].clientY, data.reward ? data.reward : 0);
          if (data.reward) {
            pheffect.show(e.x, e.y, 12);

            $this.effect.show(e.x, e.y, data.reward);
            num += data.reward;
            if (!monster) {
              phcombo.show(e.x, e.y, data.reward);
            }

          }
          else {
            if (monster) {
              monster.showMiss();
            }
            else {
              phcombo.reset();
            }
          }
        }
        store.amount = data.balance;
        $this.score.add(num);
        responed = true;
      });

    }
  }, this);
};


Game.prototype.toast = function (str) {
  $(".toast-mask").show();
  $(".toast").html(str);
  setTimeout(function () {
    $(".toast-mask").hide();
  }, 2000);
}

Game.prototype.monsterEnter = function (tip) {
  console.log(`---------${tip}--------`);
  console.log("monster enter");
  phrows.forEach(function (item) {
    item.reset();
  })
}

Game.prototype.ready = function () {
  phbox && phbox.reset();
  store.gameReady = true;
  var $this = this;
  // this.countdown.play(function () {
  //   $this.start();
  // });
  var $mask = $(".toast-mask");
  var $toast = $(".toast");
  var num = 0;
  var tid = setInterval(function () {
    if (phrows.length > 0) {
      $this.start();
      clearInterval(tid);
      $mask.hide();
      $toast.css({
        "animation": "fadeIns 1200ms",
        opacity: 0
      });
      localStorage.removeItem("pao_store");
    }
    else {
      console.log("loading");
      $mask.show();
      $toast.html("拼命加载中" + "....".substr(0, ++num % 3 + 1)).css({
        "animation": "none",
        opacity: 1
      });
    }
  }, 300);


  if(!autoStart){
    httpGet('/fish/startGame', {userName: store.nickName, gameId: getParamUrl("id")}, function (data) {
      store.singleId = data.id;
      hitTreasureBox = false;
      treasureBoxProbability = data.treasureBoxProbability;
      bossBoxProbability = data.bossBoxProbability;
      bossIsDie = false;
      if(!treasureBoxProbability){
        phbox && phbox.die();
      }
      else{
        phbox && phbox.showBox();
      }
      //store.amount = data.amount;
      localStorage.setItem("pao_singleId", store.singleId);
      store.amountGet = 0;
    })
  }
  else{
    store.amountGet = localStorage.getItem('amountGet');
    store.amountGet = store.amountGet ? parseInt(store.amountGet) : 0;
    store.singleId = localStorage.getItem("pao_singleId");
    boxData = localStorage.getItem("pao_boxData");
    if(boxData){
      boxData = JSON.parse(boxData);
    }
    treasureBoxProbability = localStorage.getItem("treasureBoxProbability") == 1;
    hitTreasureBox = localStorage.getItem("hitTreasureBox") == 1;
    bossBoxProbability = localStorage.getItem("bossBoxProbability") == 1;
    phbox && phbox.resee();
  }
  
  httpGet('/fish/getWinPublic', {}, function (data) {
    console.log(data);
    $this.tip.init(data);
  })
  task.showTip();
}

Game.prototype.replay = function () {
  this.ready();
}

Game.prototype.start = function () {
  var $this = this;
  this.running = true;
  this.started = true;

  phready = true;

  this.timerId = setInterval(function () {
    $this.update();
  }, 30);

  store.reset();
  this.timer.start();

  this.monsterEnter("game start");

  if (this.listening) {
    return;
  }

}

Game.prototype.over = function () {
  task.flash();

  phready = false;
  phrows.forEach(function (item) {
    item.over();
  })
  phcombo.hide();
  pheffect.hide();

  hitSignal.dispatch({type: "game_over"});
  
  this.running = false;
  this.started = false;
  clearInterval(this.timerId);
  var $this = this;

  httpGet('/fish/getResult', {
    singleId: store.singleId,
    round: store.singleId,
  }, function (data) {
    /*
    setTimeout(function(){
        $this.result.show(data);
    }, 480);
    */
    httpGet('/fish/getRank', {
      id: store.gameId,
      singleId: store.singleId,
      round: store.singleId,
      dsm: getParamUrl("dsm"),
      dpm: getParamUrl("dpm"),
      dcm: getParamUrl("dcm")
    }, function (data) {
      task.openType = 1;
      store.rankData = data;
      var hasBox = (treasureBoxProbability && hitTreasureBox) || (bossBoxProbability && bossIsDie);
      localStorage.setItem("pao_store", JSON.stringify(store));
      localStorage.setItem("pao_hasBox", hasBox ? 1 : 0);
      $this.popResult(hasBox);
    });
  })

}

Game.prototype.popResult = function(hasBox){
  $(".game-page").show();
  if(hasBox){
    this.rank.show();
  }
  else{
    /*
    // data.amountHighest = true;
    // data.killNumHighest = true;

    new MG.Main({
      new: store.rankData .amountHighest,
      gold: store.amountGet,
      amountHighest: store.rankData.amountHighest,
      kill: store.amount,
      killNumHighest: false,
      perKillNum: store.rankData.perKillNum,
      perKillNumHighest: store.rankData.perKillNumHighest,
      monsters: CFG.monsters,

      callback: function () {

      }
    });

    $(".result-pop").show();
    */

    task.getAds(data=>{
      embed.append(data.data.advertEmbedBase);
      if(data.data.success){
        this.rank.showAds(data.data);
      }
      else{
        this.rank.showOtherGames();
      }
    })
  }

  this.reset();
}

Game.prototype.setPlay = function(b){
  if(this.timer.num > 0){
    this.running = b;
    phready = b;
  }
  else{
    this.running = false;
    phready = false;
  }
}

Game.prototype.showNoMoney = function () {
  let _ = this;
  if (CFG.thirdRate) {
    phready = false;
    this.running = false;
    window.CREATE && new window.CREATE.ExchangePop({
      embed: CFG.prizeEmbed,
      exchangeSuccess: function (data) {
        store.amount = data.amount;
        _.amount.update();
      },
      onClose: function () {
        _.running = true;
        phready = true;
      }
    }).show();
  } else {
    $(".none").show();
    embed.singleExp(Embed.TYPE_11);
    embed.singleExp(Embed.TYPE_12);
    phready = false;
    this.running = false;

    $(".none-close").one("click", function () {
      $(".none").hide();
      _.running = true;
      phready = true;
      embed.singleClk(Embed.TYPE_11);
    })
  }
};

Game.prototype.update = function () {
  // if(this.guider.activity){
  //     phguider.show(300, 400);
  //     this.guider.activity = false;
  // }
  if (!this.running) {
    return;
  }

  // this.row1.update();
  // this.row2.update();
  // this.row3.update();

  this.tip.update();
  this.amount.update();
  this.score.update();
  if (this.timer.over) {
    this.over();
  }

  stats.update();
}