/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-10
 * @des
 */
var Scene = require('./scene');
function WelcomePop(data) {
  this.canvas = null;
  this.stage = null;
  this.exportRoot = null;
  this.data = data;

  this.init();
}

WelcomePop.prototype.createDom = function () {
  $('body').append(
    `<div class="user-pop">
        <canvas class="pop-canvas" id="canvas" width="750" height="1206"></canvas>
        <div class="user-pop-ui">
          <div class="welcome-tip">亲爱的<span class="yellow-tip name"></span>小宝贝，能见到你真是太好了~</div>
          <div class="can-get-tip">只差<span class="yellow-tip num"></span>，就能领取<span class="yellow-tip good"></span></div>
          <div class="header-img"></div>
          <div class="game-btn"></div>
        </div>
    </div>`)
}

WelcomePop.prototype.init = function () {
  var _ = this;
  this.createDom();
  this.canvas = document.getElementById("canvas");
  images = images || {};

  var manifest = [
    {src: "images/coinall.png", id: "coinall"},
    {src: "images/allword.png", id: "allword"},
    {src: "images/guangxiao.png", id: "guangxiao"},
    {src: "images/packico.png", id: "hezi"},
    {src: "images/jianglibg.png", id: "jianglibg"},
    {src: "images/juxing.png", id: "juxing"},
    {src: "images/lijikaiwan.png", id: "lijikaiwan"},
    {src: "images/numberall.png", id: "numberall"},
    {src: "images/numlter.png", id: "numlter"},
    {src: "images/progress.png", id: "progress"},
    {src: "images/zhuanqian.png", id: "zhuanqian"}
  ];

  manifest.forEach(item=>{
    item.src = '//yun.dui88.com/h5-mami/webgame/user-pop/' + item.src.split('/')[1];
    item.crossOrigin = 'Anonymous';
  })

  // if (location.href.indexOf("tuia-game/game-room") == -1) {
  //   manifest.forEach((item) => {
  //     item.crossOrigin = true;
  //   })
  // }

  var loader = new createjs.LoadQueue(false, null, true);
  loader.addEventListener("fileload", _.handleFileLoad.bind(_))
  loader.addEventListener("complete", _.handleComplete.bind(_))
  loader.loadManifest(manifest);
}

WelcomePop.prototype.show = function (data) {
  $('.user-pop').show();
  let _ = this;

  if (data) {
    new Scene({
      config: data,
      exportRoot: _.exportRoot,
      stage: _.stage
    }).init();
  } else {
    console.error('WelcomePop.show data is undefined')
  }
}


WelcomePop.prototype.hide = function () {
  $('.user-pop').remove();
}

WelcomePop.prototype.handleFileLoad = function (evt) {
  if (evt.item.type == "image") {
    evt.result.crossOrigin = 'Anonymous'

    images[evt.item.id] = evt.result;
  }
}

WelcomePop.prototype.handleComplete = function () {
  // 资源加载完直接显示弹层
  this.show(this.data);
}
window.CREATE = window.CREATE || {};
window.CREATE.WelcomePop = WelcomePop;
module.exports = WelcomePop