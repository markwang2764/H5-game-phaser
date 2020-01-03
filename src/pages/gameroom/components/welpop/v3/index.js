/*
 * @Author: Zhang Min
 * @Date: 2018-04-28 08:57:30
 * @Last Modified by: Zhang Min
 * @Last Modified time: 2018-05-17 11:14:39
 * @note 3.0现金钱包激励
 */

import Layer from './layer';
import Embed from '../../embed';

function doResize () {
  $('.layer-btn').css({'transform': `translate(-50%) scale(${document.documentElement.clientWidth / 750})`});
}

function WelcomePop () {
  this.embed = new Embed();
  this.embed.init();
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
      money: money, // 汇率折算 rate
      coin: CFG.rewardAmount
    },
    wrapper: $('body')
  });

  layer.show();

  doResize();
  window.onresize = doResize;

  this.embed.singleExp(Embed.TYPE_6);
  this.embed.singleExp(Embed.TYPE_7);

  layer.on('layer-close', () => {
    console.log('close');
    this.embed.singleClk(Embed.TYPE_6);
    layer.hide(true);
  });
  layer.on('layer-click', () => {
    console.log('click');
    this.embed.singleClk(Embed.TYPE_7, function () {
      location.href = $('#one a').eq(0).attr('data-href');
    });
  });
};

export default WelcomePop;
