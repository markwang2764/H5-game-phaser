var StepNumber = require('./step-number');

function CartoonNumber(options) {
  this.config = options.config;
  this.exportRoot = options.exportRoot;
  this.type = this.config.loginType;
  this.view = new createjs.Container();

  if (this.type == 3) {
    this.leftTip = new lib.yuer8();
    if (this.config.amount >= 100000) {
      this.rightTip = new lib.wanjinbi8();
    }
    else {
      this.rightTip = new lib.jinbitxt8();
    }
  }
  else {
    this.leftTip = new lib.songni8();
    this.rightTip = new lib.jinbitxt8();
  }

  this.stepNumber = new StepNumber(this.leftTip, this.rightTip);
  this.lighter = new lib.numlter();

  this.lighter.compositeOperation = "lighter";
  this.lighter.x = 336;
  this.lighter.y = -80;

  this.view.addChild(this.stepNumber.view);
  this.view.addChild(this.lighter);

  this.view.addChild(this.leftTip);
  this.view.addChild(this.rightTip);

  this.view.x = 0;
  this.view.y = 160;
  this.leftTip.x = 70;
  this.leftTip.y = 36;
  this.rightTip.x = 750 - 70 - 100;
  this.rightTip.y = 36;
  if (this.type == 3 && this.config.inHall) {
    this.view.y = 132;
  }
}

CartoonNumber.prototype.play = function (n) {
  this.shine();
  var that = this;
  if (this.type == 1) {
    setTimeout(function () {
      that.scale();
    }, 1800);
    this.stepNumber.play(n);
  }
  else if (this.type == 2) {
    this.view.y = 132;
    this.stepNumber.play(n);
  }
  else if (this.type == 3) {
    this.stepNumber.bigNum(n);
  }
};

CartoonNumber.prototype.shine = function () {
  console.log(this.config.loginType == 2);
  this.lighter.alpha = 0;
  anime({
    targets: this.lighter,
    x: this.lighter.x - 0,
    y: this.lighter.y - 10,
    alpha: 1,
    delay: this.config.loginType == 1 ? 900 : 30,
    duration: 1200,
    easing: "linear"
  });
};

CartoonNumber.prototype.scale = function () {
  var that = this;
  var obj = {num: 1, y: that.view.y, x: that.view.x}
  anime({
    targets: obj,
    num: 0.8,
    x: (750 - (750 - 0 * 2) * 0.8) / 2,
    y: 120,
    duration: 200,
    easing: "easeInOutExpo",
    update: function () {
      that.view.x = obj.x;
      that.view.y = obj.y;
      that.view.scaleX = that.view.scaleY = obj.num;
    }
  });

  if (this.config.inHall) {
    var jinku = this.exportRoot.instance_2.instance_2;
  }
  else {
    var jinku = this.exportRoot.instance_2.instance;
  }
  jinku.visible = true;
  jinku.scaleX = jinku.scaleY = 0.1;
  anime({
    targets: jinku,
    duration: 200,
    scaleX: 1,
    scaleY: 1,
    easing: "easeInOutExpo",
    update: function () {

    }
  });
}

// module.exports = CartoonNumber

export default CartoonNumber