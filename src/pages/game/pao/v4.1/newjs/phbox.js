function PhBox(directions, ys) {
    this.directions = directions;
    this.ys = ys;
    this.direction = directions[0];
    // this.signal = signal;
    this.sprite = $(".treasure").css('background-image', `url('${CFG.treasureBoxMonster}')`);
    // this.sprite.anchor.set(0.5, 1);
    this.x = 750;
    this.y = ys[0];
    this.xspeed = 3 * this.direction;
    this.yspeed = 0;
    this.timer = 0;
    this.visible = true;
    this.fast = false;
    this.opened = false;
    this.hasShow = false;
    this.hited = false;
    this.init();
    this.reset();
  }
  
  PhBox.prototype = {
    init: function () {
      // this.sprite.inputEnabled = true;
      // this.sprite.events.onInputDown.add(function (e) {
      //   this.hit(e);
      // }, this);

      this.sprite.click((e)=>{
        this.hit(e);
      })

      this.addStyle();
    },
    showBox: function(){
      this.sprite.css("transform", `translate(${-600}px, ${this.y}px)`);
      this.sprite.show();
    },
    resee: function(){
      if(!treasureBoxProbability){
        this.die();
        return;
      }

      this.opened = localStorage.getItem("pao_opened") == 1;
      this.hited = localStorage.getItem("pao_hited") == 1;

      if(this.hited){
        this.sprite.addClass("opened");
        $(".treasure-pop").hide();
        if(boxData){
          $(".boxs-tip").eq(0).html(`金币X${boxData.reward}`);
          $(".gx-jinbi .ss").html(`恭喜获得${boxData.reward}金币`);
        }
        if(this.opened){
          $(".treasure").css('background-image', `url(//yun.dui88.com/h5-mami/webgame/fish/v4/boxopen4.png)`);
        }
        else{
          $(".treasure").css('background-image', `url(${CFG.treasureBox})`);
        }
      }
    },
    reset: function(){
      this.sprite.removeClass("opened");
      $(".treasure-pop").show();
      this.sprite.css('background-image', `url('${CFG.treasureBoxMonster}')`);
      var i = Math.floor(Math.random() * 100) % 3;
      this.direction = this.directions[i];
      this.y = (this.ys[i] - 100) * window.innerWidth / 750;
      if(this.direction > 0){
        this.x = -1200 - Math.random() * 1200;
      }
      else{
        this.x = Math.random() * 1200 + 1200;
      }
      this.hasShow = false;
      this.xspeed = 3 * this.direction;
      this.visible = true;
      this.opened = false;
      this.hited = false;
      this.move();
    },
    hit: function (e) {
      // hitSignal.dispatch({
      //   type: "hit_box",
      //   x: e.input.downPoint.x,
      //   y: e.input.downPoint.y
      // });
      hitTreasureBox = true;
      if(this.hited){
        game.setPlay(false);
        
        this.die();

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
      
        if(!this.opened){
          this.opened = true;
          httpGet("/fish/killTreasureBox", param, function(data){
            console.log(data);
            boxData = data;
            embed.append(data.adRsp.advertEmbedBase);
            localStorage.setItem("pao_boxData", JSON.stringify(boxData));
            localStorage.setItem("pao_embed", JSON.stringify(embed));
            store.amount += data.reward;
            game.amount.update();
  
            // embed.embedExport(embed.data.treasure_box_pic_button_exposure);
            // embed.embedExport(embed.data.treasure_box_pic_exposure);
            game.rank.playBox();

          })
        }
        else{
          game.toast("宝箱已经被开过了~");
          game.setPlay(true);
          //game.rank.playBox();
        }
        task.openType = 1;
        $(".treasure").css('background-image', `url(//yun.dui88.com/h5-mami/webgame/fish/v4/boxopen4.png)`);
      }
      else{
        this.hited = true;
        embed.numClick("7.1");
        $(".treasure").addClass("opened");
        $(".treasure-pop").hide();
        setTimeout(()=>{
          $(".treasure-pop").show().css({
            "transform-origin": "50% 100%",
            "transform": "scale(1.6)"
          });
          setTimeout(()=>{
            $(".treasure-pop").hide();
          }, 1800);
          $(".treasure").css('background-image', `url('${CFG.treasureBox}')`);
        }, 600);
      }

      /*
      anime({
        targets: ".treasure",
        // translateX: "2.5rem",
        // translateY: (window.innerHeight * 2) / 200 + "rem",
        translateX: window.innerWidth - 180 * window.innerWidth / 750 + "px",
        translateY: window.innerHeight - 100 * window.innerWidth / 750 + "px",
        scale: 0.64,
        easing: 'linear',
        duration: 600,
      }).complete = function(){
        // $(".treasure-pop").hide();
        // $(".treasure").css('background-image', `url('${CFG.treasureBox}')`).addClass("opened");
      }
      */
    },
    die: function () {
    //   this.signal.dispatch({id: -1});
    this.visible = false;
    // this.sprite.css("transform", `translate(0px, -600px)`);
    },
    move: function () {
      if (!this.visible || this.opened) {
        return;
      }
      this.x += this.xspeed;
      this.timer += 0.24;
      this.yspeed = Math.sin(this.timer) * 3;
      this.y += this.yspeed;
  
      if(this.x < STAGE_WIDTH && this.x > 0){
        if(!this.hasShow){
          this.hasShow = true;
          embed.numExport("7.1");
          console.log("出现宝箱");
        }
      }
      if (this.direction === 1) {
        if (this.x > STAGE_WIDTH + this.sprite.width) {
          this.die();
        }
      }
      else {
        if (this.x < 0 - this.sprite.width) {
          this.die();
        }
      }
      this.sprite.x = this.x;
      this.sprite.y = this.y;

      this.sprite.css("transform", `translate(${this.x}px, ${this.y}px)`);
    },
    leave: function () {
      this.xspeed *= Math.random() * 4 + 3;
      this.fast = true;
    },
    show: function () {
      this.sprite.show();
        // this.sprite.visible = true;
      this.visible = true;
    },
    hide: function () {
      this.sprite.hide();
      // this.sprite.visible = false;
      this.visible = false;
      this.x = -300;
      // this.sprite.x = -300;
    },
    addStyle: function(){
      var x = window.innerWidth - 200 * window.innerWidth / 750 + "px";
      var y = window.innerHeight - 100 * window.innerWidth / 750 + "px";
      var css = `
      @keyframes openedbox {
      100%{transform: translate(${x}, ${y}) scale(0.54)}
      }
      `;
      var style = document.createElement("style");
      style.innerHTML = css;
      document.body.appendChild(style);
    }
  };