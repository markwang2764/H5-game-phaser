/*
 * @Author: Zhang Min
 * @Date: 2018-05-03 07:50:42
 * @Last Modified by: Zhang Min
 * @Last Modified time: 2018-05-17 11:11:53
 */

/**
 * 弹层
 */
import './index.less';
import EventEmitter from '../../../components/event-emitter/index';

class Layer extends EventEmitter {
  constructor (opt) {
    super();
    this.opt = opt || {};

    this.debug = this.opt.debug || false; // 开启调试
    this.layerId = +new Date();
    this.$wrapper = this.opt.wrapper || $('body');
    this.data = this._initData(this.opt.data);

    this.init();
  }
  init () {
    // 首次插入dom
    this.$dom = this._tpl(this.data);
    this.$wrapper.append(this.$dom);

    $('#' + this.layerId).find('.layer-close').on('click', () => {
      this.timer && clearInterval(this.timer);
      this.trigger('layer-close');
    });
    // 整体可点击
    $('#' + this.layerId).find('.layer-click-area').on('click', () => {
      this.trigger('layer-click');
    });
  }
  show () {
    $('#' + this.layerId).show();
    setTimeout(function () {
      $('.w-notify-wrap1').addClass('active');
      $('.w-notify-wrap2').addClass('active');
    }, 2000);
    this._loadImg('//yun.dui88.com/h5-mami/layer/1.0/layer-bg2.png', () => {
      $('.layer-main').append('<div class="layer-gesture"></div>');
      this.autoJump(8);
    });
  }
  hide (isRemove = false) {
    if (isRemove) {
      $('#' + this.layerId).remove();
    } else {
      $('#' + this.layerId).hide();
    }
  }
  _initData (data) {
    if (!data) {
      // data = {
      //   headimg: 'http://img0.imgtn.bdimg.com/it/u=489423423,2450269323&fm=27&gp=0.jpg',
      //   nickname: '游客18520',
      //   money: 0.3,
      //   coin: 3000
      // };
      console.error('welcomepop data is undefined');
    }
    console.log(data.money);
    const arr = String(data.money).split('.');
    return {
      headimg: data.headimg,
      nickname: data.nickname,
      coin: data.coin,
      x: arr[0],
      y: arr[1]
    };
  }
  _tpl (data) {
    let coinDom = '';
    (data.x + '').split('').forEach(item => {
      coinDom += `<div class="coin-num${parseInt(item)}"></div>`;
    });

    if (data.y) {
      coinDom += `<div class="point"></div>`;
      data.y && (data.y + '').split('').forEach(item => {
        coinDom += `<div class="coin-num${parseInt(item)}"></div>`;
      });
    }

    const htmlStr = `<div id="${this.layerId}" class="layer">
            <div class="layer-overlay"></div>
            <div class="layer-close"></div>
            <div class="layer-body">
                <div class="layer-decorate"></div>
                <div class="layer-light"></div>
                <div class="layer-click-area"></div>
                <div class="layer-main">
                  <div class="layer-headimg">
                      <img src="${data.headimg}" alt="headimg">
                  </div>
                  <div class="layer-name">玩家 <span>【${data.nickname}】</span></div>
                  <div class="layer-title"></div>
                  <div class="layer-money">
                      ${coinDom}
                  </div>
                  <div class="layer-intro">已为您折算为等值的 ${data.coin} 游戏金币</div>
                  <div class="layer-btn"></div>
                  <div class="layer-auto-jump"></div>
                </div>
                <div class="w-notify-wrap w-notify-wrap1">
                  <div class="w-notify-rp"></div>
                  <div class="w-avatar"></div>
                  <div class="w-content">
                    玩家<span class="enhanced">游客Z0L325X</span><br>
                    兑换了<span class="enhanced">50元现金红包</span>
                  </div>
                </div>
                <div class="w-notify-wrap w-notify-wrap2">
                  <div class="w-notify-rp"></div>
                  <div class="w-avatar"></div>
                  <div class="w-content">
                    玩家<span class="enhanced">游客29292as</span><br>
                    兑换了<span class="enhanced">100元现金红包</span>
                  </div>
                </div>
            </div>
        </div>`;
    return htmlStr;
  }
  _loadImg (url, cb) {
    let image = new Image();
    image.src = url;
    image.onload = function () {
      image = null;
      cb && cb();
    };
  }

  _log (msg) {
    if (this.debug) {
      console.log(msg);
    }
  }
  /**
   * 倒计时自动跳转到对应游戏
   * @param n
   * @param url
   */
  autoJump (n, url) {
    let count = n;
    console.log(count);
    $('.layer-auto-jump').html(`正在为您自动跳转（${Math.floor(count)}）`);
    this.timer = setInterval(() => {
      count -= 0.5;
      console.log(count);
      $('.layer-auto-jump').html(`正在为您自动跳转（${Math.floor(count)}）`);
      if (count <= 0) {
        this.timer && clearInterval(this.timer);
        this.trigger('layer-auto-jump');
      }
    }, 500);
  };
}
export default Layer;
