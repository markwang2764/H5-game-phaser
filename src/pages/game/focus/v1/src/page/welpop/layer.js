/*
 * @Author: Zhang Min
 * @Date: 2018-05-03 07:50:42
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-07-27 12:02:04
 */

/**
 * 弹层
 */
import './index.less';
import EventEmitter from '../event-emitter/index';

class Layer extends EventEmitter {
  constructor (opt) {
    super();
    this.opt = opt || {};

    this.debug = this.opt.debug || false; // 开启调试
    this.layerId = +new Date();
    this.$wrapper = this.opt.wrapper || $('body');
    // this.data = this._initData(this.opt.data);

    // this.init();
  }
  init () {
    // 首次插入dom
    this.$dom = this._tpl(this.data);
    this.$wrapper.append(this.$dom);

    $('#' + this.layerId).find('.layer-btn').on('click', () => {
      this.timer && clearInterval(this.timer);
      this.trigger('layer-btn');
    });
    // 整体可点击
    $('#' + this.layerId).find('.layer-qingqu').on('click', () => {
      this.trigger('layer-qingqu');
    });
  }
  show (money) {
    this.data = this._initData({money: money});
    this.init();
    $('#' + this.layerId).show();
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
            <div class="layer-body">
                <div class="layer-decorate"></div>
                <div class="layer-light"></div>
                <div class="layer-main">
                  <div class="layer-money">
                      ${coinDom}
                  </div>
                  <div class="layer-btn"></div>
                  <div class="layer-qingqu">不翻倍立即领取</div>
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
    
  };
}
export default Layer;
