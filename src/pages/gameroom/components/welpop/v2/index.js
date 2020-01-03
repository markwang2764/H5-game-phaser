/**
 * @note    游戏大厅新人弹层无弹窗版
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */

import './index.less';
import Embed from '../../embed';

function WelcomePop ({amountDiv}) {
  this.inter = 40;
  this.$amountDiv = amountDiv;
  this.timer = null;
  this.embed = new Embed();
  this.embed.init();
  this.init();
}

WelcomePop.prototype.createDom = function () {
  let coinDom = ``;

  (CFG.rewardAmount + '').split('').forEach(item => {
    coinDom += `<span class="coin-num${parseInt(item)}"></span>`;
  });
  let dom =
    `<div class="welcome-pop">
      <div class="welcome-pop-mask"></div>
      <div class="welcome-pop-main active">
        <div class="light-effect"></div>
        <div class="w-bg">
          <div class="w-amount-wrap">
            <div class="w-coins"></div>
            <div class="w-x"></div>
            <div class="w-amount">
              ${coinDom}
            </div>
          </div>
          <div class="w-tip">金币可以换奖品哦~</div>
        </div>
    
        <div class="w-coins-wrap">
          <div class="fly-coin1"></div>
          <div class="fly-coin2"></div>
          <div class="fly-coin3"></div>
          <div class="fly-coin4"></div>
          <div class="fly-coin5"></div>
          <div class="fly-coin6"></div>
          <div class="fly-coin7"></div>
          <div class="fly-coin8"></div>
        </div>
        
      </div>
    </div>
    <div class="w-notify-wrap">
      <div class="w-avatar"></div>
      <div class="w-content">
        玩家<span class="enhanced">游客Z0L325X</span><br>
        兑换了<span class="enhanced">888元现金红包</span>
      </div>
    </div>`;
  $('body').append(dom);

  this.$container = $('.welcome-pop');
  this.$main = $('.welcome-pop .welcome-pop-main');
  this.$notify = $('.w-notify-wrap');
  this.$lightEffect = $('.welcome-pop .light-effect');
  this.$Bg = $('.welcome-pop .w-bg');
  this.$coinWrap = $('.welcome-pop .w-coins-wrap');

  this.$amountDiv.html(((CFG.amount - CFG.rewardAmount) > 0 ? (CFG.amount - CFG.rewardAmount) : 0).toFixed(0));
};

WelcomePop.prototype.event = function () {
  this.$notify.on('click', () => {
    this.embed.singleClk(Embed.TYPE_5);
  });
};

WelcomePop.prototype.init = function () {
  this.createDom();
  this.event();
};

/**
 * 硬币动画结束后执行
 */
WelcomePop.prototype.coinAnimOver = function () {
  let _ = this;
  // 金币自增长
  let myObject = {
    num: ((CFG.amount - CFG.rewardAmount) > 0 ? (CFG.amount - CFG.rewardAmount) : 0).toFixed(0)
  };
  anime({
    targets: myObject,
    num: CFG.amount,
    easing: 'linear',
    round: 1,
    duration: 1000,
    update: function () {
      _.$amountDiv.html(myObject.num);
    }
  });

  this.$lightEffect.addClass('active');
  setTimeout(() => {
    this.$lightEffect.removeClass('active');
    // 隐藏整个弹窗
    _.hide();
  }, this.inter * 10);
};

WelcomePop.prototype.show = function () {
  let _ = this;
  this.$container.show();
  setTimeout(function () {
    _.$Bg.addClass('active');
    _.$coinWrap.addClass('active');

    setTimeout(function () {
      _.coinAnimOver();
      _.showNotify();
    }, 25 * _.inter * 0.8);
  }, 2000);
};

WelcomePop.prototype.hide = function () {
  this.timer && clearInterval(this.timer);
  this.$container.remove();
};

WelcomePop.prototype.showCoinPop = function () {

};

WelcomePop.prototype.showNotify = function () {
  this.embed.singleExp(Embed.TYPE_5);
  this.$notify.addClass('active');
};

export default WelcomePop;
