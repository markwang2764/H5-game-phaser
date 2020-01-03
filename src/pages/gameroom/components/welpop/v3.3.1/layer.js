/**
 * 弹层
 */
import './index.less';
import EventEmitter from '../../../components/event-emitter/index';

function doResize () {
  $('.w-coin').css({'transform': `translate(-50%) scale(${document.documentElement.clientWidth / 750})` , 'transform-origin': 'top center'});
}

class Layer extends EventEmitter {
  constructor(opt) {
    super();
    this.opt = opt || {};

    this.debug = this.opt.debug || false; // 开启调试
    this.layerId = +new Date();
    this.$wrapper = this.opt.wrapper || $('body');
    this.data = this._initData(this.opt.data);
    this.autoOpenTime = 4000;
    this.init();
  }

  init() {
    // 首次插入dom
    this.$dom = this._tpl(this.data);
    this.$wrapper.append(this.$dom);

    $('#' + this.layerId).find('.w-close').on('click', () => {
      this.timer && clearInterval(this.timer);
      this.trigger('layer-close');
    });

    $('#' + this.layerId).find('.w-btn-open').on('click', () => {
      this.timerOpen && clearTimeout(this.timerOpen);
      this.trigger('click-open');
    });

    $('#' + this.layerId).find('.w-btn-start').on('click', () => {
      this.trigger('layer-click');
    });
  }

  show() {

    doResize();
    window.onresize = doResize;

    $('#' + this.layerId).show();
    this.timerOpen = setTimeout(() => {
      this.trigger('auto-open');
    }, this.autoOpenTime);
  }

  hide(isRemove = false) {
    if (isRemove) {
      $('#' + this.layerId).remove();
    } else {
      $('#' + this.layerId).hide();
    }
  }

  _initData(data) {
    if (!data) {
      console.error('welcomepop data is undefined');
    }
    console.log(data.coin);
    const arr = String(data.coin).split('.');
    if (data.money.indexOf('.') > -1 && data.money.endsWith('0')) {
      data.money = data.money.substring(0, data.money.length - 1)
    }
    return {
      headimg: data.headimg,
      nickname: data.nickname,
      coin: data.coin,
      money: data.money,
      x: arr[0],
      y: arr[1]
    };
  }

  _tpl(data) {
    const htmlStr =
      `<div class="welcome-pop" id="${this.layerId}">
        <div class="welcome-pop-mask"></div>
        <div class="welcome-pop-main">
          <div class="w-close"></div>
          <div class="w-page1">
            <img  class="w-avatar" src="${data.headimg}" alt="headimg">
            <div class="w-name">${data.nickname}</div>
            <div class="w-farewell">恭喜你获得一个新人红包</div>
            <div class="w-congratulation"></div>
            <div class="w-coin"></div>
            <div class="w-btn-open"></div>
            <div class="w-auto-set">系统已为你自动分配游客身份</div>
          </div>
      
          <div class="w-page2">
            <div class="w-cover">
              <div class="w-play-tip">
                <div class="w-tip-icon"></div>
                <div class="w-tip-text">明天可获得0.3元</div>
                <div class="w-tip-icon"></div>
            </div>
              <div class="w-btn-wrap"></div>
              <div class="w-btn-start"></div>
              <div class="w-seven-day">登录七天最多可拿10万金币</div>
              <div class="w-earn">玩游戏，赚取更多金币！</div>
            </div>
            <div class="w-bg-coupon">
              <div class="w-day">连续登录第一天</div>
              <div class="w-equal">等于${data.coin}金币</div>
              <div class="w-money">
                ${data.money}
              </div>
              <div class="w-money-unit">元</div>
              <div class="w-withdraw">累计可提现</div>
            </div>
      
            <div class="layer-gesture"></div>
          </div>
      
        </div>
      </div>`;
    return htmlStr;
  }

  _loadImg(url, cb) {
    let image = new Image();
    image.src = url;
    image.onload = function () {
      image = null;
      cb && cb();
    };
  }

  _log(msg) {
    if (this.debug) {
      console.log(msg);
    }
  }

  showPage2() {
    $('#' + this.layerId).find('.w-btn-open').hide();
    $('#' + this.layerId).find('.w-coin').show().addClass('open');

    setTimeout(() => {
      $('#' + this.layerId).find('.w-page1').hide();
      $('#' + this.layerId).find('.w-page2').show();
      $('#' + this.layerId).find('.w-bg-coupon').addClass('open');
    }, 1200);
  }

  autoOpen() {
    this.showPage2();
  }

  /**
   * 倒计时自动跳转到对应游戏
   * @param n
   * @param url
   */
  _autoJump(n, url) {
    let count = n;
    console.log(count);
    $('.layer-auto-jump').html(`${Math.floor(count)}`);
    this.timer = setInterval(() => {
      count -= 0.5;
      console.log(count);
      $('.layer-auto-jump').html(`${Math.floor(count)}`);
      if (count <= 0) {
        this.timer && clearInterval(this.timer);
        this.trigger('layer-auto-jump');
      }
    }, 500);
  };
}

export default Layer;
