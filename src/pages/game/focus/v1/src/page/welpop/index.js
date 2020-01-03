/**
 * @note    3.1.2 现金钱包激励 通知 + 自动跳转 + 自动跳转进入金币区块配置链接
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-04
 * @des
 */
import Layer from './layer';

function doResize () {
  $('.layer-btn').css({'transform': `translate(-50%) scale(${document.documentElement.clientWidth / 750})`});
}

function WelcomePop (options = {}) {
  this.onDouble = options.onDouble;
  this.onClose = options.onClose;
}

WelcomePop.prototype.show = function (coin) {
  let money = 0;
  let rate = CFG.rate;
  if (rate) {
    money = Math.floor(CFG.rewardAmount / parseFloat(rate) * 100) / 100;
  }
  const layer = new Layer({
    data: {
      headimg: CFG.headUrl,
      nickname: CFG.nickName,
      money: money.toFixed(1), // 汇率折算 rate
      coin: CFG.rewardAmount
    },
    wrapper: $('body')
  });

  layer.show(coin);

  doResize();
  window.onresize = doResize;

  layer.on('layer-qingqu', () => {
    layer.hide(true);
    this.onClose && this.onClose();
  });
  layer.on('layer-btn', ()=>{
    layer.hide(true);
    this.onDouble && this.onDouble();
  })
};

export default WelcomePop;
