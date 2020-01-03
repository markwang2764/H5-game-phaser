/*
 * @Author: Zhang Min
 * @Date: 2018-04-28 08:57:30
 * @Last Modified by: Zhang Min
 * @Last Modified time: 2018-05-17 11:14:39
 * @note 3.0现金钱包激励 通知 + 自动跳转
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
      location.href = $('#one a').eq(0).attr('data-href');
    });
  });
};

export default WelcomePop;
