var Dom = function (div) {
  this.div = div;
  this.x = 0;
  this.y = 0;
  this.scale = 1;
  this.opacity = 0;
  this.width = 160;
};

Dom.prototype = {
  setImage: function (img) {
    // var host = window.CFG.host + '/h5-mami/webgame/bet/v2/';
    this.div.style.backgroundImage = `url(${img})`;
  },
  move: function (n, pot) {
    this.x += n;
    if (this.x < 0 - this.width) {
      this.x = pot;
    }
    this.update();
  },
  update: function () {
    this.div.style.transform = `matrix3d(
            ${this.scale},0,0,0,
            0,${this.scale},0,0,
            0,0,1,0,
            ${this.x},${this.y},1,1)`;
  }
};

export default Dom;
