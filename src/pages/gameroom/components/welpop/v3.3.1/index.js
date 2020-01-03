/**
 * @note    3.3.1
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-04
 * @des
 */
import Layer from './layer';
import Embed from '../../embed';

class WelcomePop {
  constructor(options = {}) {
    this.embed = new Embed();
    this.embed.init();
    this.onClose = options.onClose;
  }

  show() {
    let money = 0;
    let rate = CFG.rate;
    if (rate) {
      money = Math.floor(CFG.rewardAmount / parseFloat(rate) * 100) / 100;
    }
    const layer = new Layer({
      data: {
        headimg: CFG.headUrl,
        nickname: CFG.nickName,
        money: money.toFixed(2), // 汇率折算 rate
        coin: CFG.rewardAmount
      },
      wrapper: $('body')
    });

    layer.show();

    this.embed.singleExp(Embed.TYPE_6);
    this.embed.singleExp(Embed.TYPE_7);
    this.embed.singleExp(Embed.TYPE_8);

    layer.on('layer-close', () => {
      this.embed.singleClk(Embed.TYPE_6);
      layer.hide(true);
      this.onClose && this.onClose();
    });

    layer.on('auto-open', () => {
      this.embed.singleClk(Embed.TYPE_8);
      this.embed.singleExp(Embed.TYPE_9);
      layer.autoOpen();
    });

    layer.on('click-open', () => {
      this.embed.singleClk(Embed.TYPE_7);
      this.embed.singleExp(Embed.TYPE_9);
      layer.showPage2();
    });

    layer.on('layer-click', () => {
      this.embed.singleClk(Embed.TYPE_9, () => {
        layer.hide(true);
        location.href = $('#one a').eq(0).attr('data-href');
      });
    });

  }
}

export default WelcomePop;
