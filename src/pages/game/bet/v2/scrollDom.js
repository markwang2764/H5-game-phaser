import Dom from './dom';

var ScrollDom = function (divs) {
  this.space = 30;
  this.speed = -10;

  this.doms = [];
  for (var i = 0; i < divs.length; i++) {
    var dom = new Dom(divs[i]);
    dom.x = i * (this.space + dom.width);
    this.doms.push(dom);
  }
};

ScrollDom.prototype = {
  update: function () {
    var max = 0;
    this.doms.forEach(dom => {
      if (dom.x > max) {
        max = dom.x;
      }
    });
    this.doms.forEach(dom => {
      dom.move(this.speed, max + this.space + dom.width);
    });
  }
};

export default ScrollDom;
