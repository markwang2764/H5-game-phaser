function StepNumber(leftTip, rightTip) {
  this.leftTip = leftTip;
  this.rightTip = rightTip;
  this.view = new createjs.Container();
  this.view.x = 0;
  this.view.y = 0;
}

StepNumber.prototype.play = function (total) {
  total = parseInt(total);
  var that = this;
  var obj = {num: 0};
  anime({
    targets: obj,
    num: total,
    round: 1,
    duration: 1200,
    easing: 'linear',
    update: function () {
      that.stop(obj.num);
    },
    complete: function () {
      that.stop(obj.num, true);
    }
  });
};

StepNumber.prototype.stop = function (n, nochange) {
  this.view.removeAllChildren();
  var list = (n + "").split("");
  var x = 0;
  for (var i = 0; i < list.length; i++) {
    var n = list[i];
    if (i != 0 && n == 1) {
      if (!nochange) {
        n = 0;
      }
    }
    //var num = new lib["num" + n]();
    var num = new lib["hao" + n]();
    num.x = x;
    this.view.addChild(num);
    x += n == 1 ? 54 : 102;
  }
  this.view.x = (750 - x) / 2;
  this.leftTip.x = this.view.x - 120;
  this.rightTip.x = this.view.x + x + 10;
};

StepNumber.prototype.bigNum = function (n) {
  n = parseInt(n);
  if (n >= 100000) {
    n = n / 10000;
    n = Math.floor(n * 10) / 10;
    this.view.removeAllChildren();
    var list = (n + "").split("");
    var x = 0;
    for (var i = 0; i < list.length; i++) {
      var n = list[i];
      if (n == ".") {
        var num = new lib.dot8();
        num.x = x + 10;
        num.y = 72;
        x += 54;
      }
      else {
        //var num = new lib["num" + n]();
        var num = new lib["hao" + n]();
        num.x = x;
        x += n == 1 ? 54 : 102;
      }
      this.view.addChild(num);

    }
    this.view.x = (750 - x) / 2;
    this.leftTip.x = this.view.x - 120;
    this.rightTip.x = this.view.x + x + 10;
  }
  else {
    this.stop(n, true);
  }
};

module.exports = StepNumber