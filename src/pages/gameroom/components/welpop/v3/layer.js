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
      this.trigger('layer-close');
    });
    // 整体可点击
    $('#' + this.layerId).find('.layer-main').on('click', () => {
      this.trigger('layer-click');
    });
  }
  show () {
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
    coinDom += `<div class="point"></div>`;
    (data.y + '').split('').forEach(item => {
      coinDom += `<div class="coin-num${parseInt(item)}"></div>`;
    });

    const htmlStr = `<div id="${this.layerId}" class="layer">
            <div class="layer-overlay"></div>
            <div class="layer-close"></div>
            <div class="layer-body">
                <div class="layer-decorate"></div>
                <div class="layer-light"></div>
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
                </div>
            </div>
        </div>`;
    return htmlStr;
  }
  _log (msg) {
    if (this.debug) {
      console.log(msg);
    }
  }
}
export default Layer;
