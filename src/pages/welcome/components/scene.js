// var CartoonNumber = require('./cartoon-number');

import CartoonNumber from './cartoon-number';

var Good = require('./good');


function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return 0;
  }
  if (f < 100000) {
    return f;
  }
  f = f / 10000;
  f = Math.floor(f * 10) / 10;
  return f + "万";
}

function playProgress(total, pgview, aimname, config) {
  if (aimname == "键鼠套装") {
    pgview.instance.image = images.goodbox;
  }
  pgview.progresstxt.text = toDecimal(config.amount) + "/" + toDecimal(total);

  var guangView = pgview.instance_1;
  var guangMask = guangView.mask;
  guangView.compositeOperation = "lighter";

  var colorMask = pgview.instance_2.mask;
  /*
  var num = config.amount / total;
  var maskx = maskview.x * num;
  maskview.x = maskview.x - 388;
  lightview.alpha = 0;
  var n = 0;
  */
  var max = guangView.x;
  var min = max - 380;
  guangView.x = min;
  colorMask.x = min;
  var aim = config.amount / total * 380;
  anime({
    targets: guangView,
    x: aim,
    duration: 1200,
    easing: "linear",
    update: function () {
      colorMask.x = guangView.x - 40;
    }
  });
}


function Scene(options) {
  this.config = options.config;
  this.exportRoot = options.exportRoot;
  this.stage = options.stage;

}

Scene.prototype.init = function () {
  $(".header-img,.welcome-tip,.welcome-tip").show();

  console.log(this)
  var n = this.config.loginType;
  var sceneType = n;

  if (this.config.inHall) {
    var good = new Good();
    var aim = good.getAim(this.config.amount);
    $(".can-get-tip").show();
    // 还差多少金币
    $(".num").html(toDecimal(aim.coin - this.config.amount) + "金币");
    $(".good").html(aim.name);
  }
  else {
    sceneType = sceneType + "0";
  }

  this.exportRoot = new lib["scene" + sceneType](null, null, false);


  this.stage = new createjs.Stage(canvas);
  this.stage.addChild(this.exportRoot);
  this.stage.update();
  createjs.Ticker.setFPS(25);
  createjs.Ticker.addEventListener("tick", this.stage);

  var cartoonNumber = new CartoonNumber({
    config: this.config,
    exportRoot: this.exportRoot
  });
  if (n == 3) {
    this.exportRoot.instance_1.addChild(cartoonNumber.view);
  }
  else {
    this.exportRoot.instance_2.addChild(cartoonNumber.view);
  }
  $(".header-img").css("background-image", "url(" + this.config.userHeader + ")");

  var uname = this.config.userName || "游客";
  $(".name").html(uname.length > 8 ? uname.substr(0, 6) + "..." : uname);
  if (this.config.inHall) {
    // 普通用户
    if (n == 1) {
      cartoonNumber.play(this.config.rewardMoney);
      var pgview = this.exportRoot.instance_2.instance;
      playProgress(aim.coin, pgview, aim.name, this.config);

      this.exportRoot.instance_2.instance_2.visible = false;
      this.exportRoot.instance_2.instance_2.havetxt.text = toDecimal(this.config.amount) + "金币";
    }
    // 新用户
    else if (n == 2) {
      cartoonNumber.play(this.config.rewardMoney);
      var pgview = this.exportRoot.instance_2.instance;
      playProgress(aim.coin, pgview, aim.name, this.config);

      this.exportRoot.instance_1.instance_1.image = images.lijikaiwan;
    }
    // 老用户今日第一次访问
    else if (n == 3) {
      cartoonNumber.play(this.config.amount);
      var pgview = this.exportRoot.instance_1.instance;
      playProgress(aim.coin, pgview, aim.name, this.config);

    }
  }
  else {
    if (n == 1) {
      cartoonNumber.play(this.config.rewardMoney);
      this.exportRoot.instance_2.instance.visible = false;
      this.exportRoot.instance_2.instance.havetxt.text = toDecimal(this.config.amount) + "金币";
      //this.exportRoot.instance_1.instance_1.image = images.lijikaiwan;
    }
    else if (n == 2) {
      cartoonNumber.play(this.config.rewardMoney);
      this.exportRoot.instance_1.instance_1.image = images.lijikaiwan;
    }
    else {
      cartoonNumber.play(this.config.amount);
      //this.exportRoot.instance.instance_1.image = images.lijikaiwan;
    }
  }

  // var gamebtn = null;
  // if (n == 3) {
  //   gamebtn = this.exportRoot.instance;
  // }
  // else {
  //   gamebtn = this.exportRoot.instance_1;
  // }
  //
  // $(".user-pop").addClass("scene" + n);
  //
  // gamebtn.addEventListener("click", function () {
  //   console.log("click game btn");
  //   window.postMessage("hidepop", "*");
  // })

  $(".user-pop").addClass("scene" + n);
  var $gamebtn = $('.user-pop .game-btn');
  $gamebtn.removeClass('nocoin')
  if (n == 3) {
    $gamebtn.addClass('nocoin')
  }
  $gamebtn.on('click', function () {
    console.log("click game btn");
    window.postMessage("hidepop", "*");
  })
}

module.exports = Scene