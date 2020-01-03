/**
 * @note    3.1.2 现金钱包激励 通知 + 自动跳转 + 自动跳转进入金币区块配置链接
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-04
 * @des
 */
import Layer from './layer';
import Embed from '../../embed';

function doResize () {
  $('.layer-btn').css({'transform': `translate(-50%) scale(${document.documentElement.clientWidth / 750})`});
}

function WelcomePop (options = {}) {
  this.embed = new Embed();
  this.embed.init();
  this.onClose = options.onClose;
}

WelcomePop.prototype.show = function () {
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

  layer.show();

  doResize();
  window.onresize = doResize;

  this.embed.singleExp(Embed.TYPE_6);
  this.embed.singleExp(Embed.TYPE_7);
  this.embed.singleExp(Embed.TYPE_8);

  layer.on('layer-close', () => {
    this.embed.singleClk(Embed.TYPE_6);
    layer.hide(true);
    this.onClose && this.onClose();
  });
  layer.on('layer-click', () => {
    this.embed.singleClk(Embed.TYPE_7, () => {
      layer.hide(true);
      location.href = $('#one a').eq(0).attr('data-href');
    });
  });
  layer.on('layer-auto-jump', () => {
    this.embed.singleClk(Embed.TYPE_8, () => {
      layer.hide(true);
      // 8s自动跳转后进入金币活动页面。
      // 如果未配置金币活动，则仍然进入第一个区块配置内容
      if ($('.coin-work').attr('data-href')) {
        location.href = $('.coin-work').attr('data-href');
      } else {
        location.href = $('#one a').eq(0).attr('data-href');
      }
    });
  });
};

export default WelcomePop;
