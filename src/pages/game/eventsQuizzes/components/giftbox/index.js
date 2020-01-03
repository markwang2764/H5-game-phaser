/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-09
 * @des
 */
import './index.less';
import {embedClick, embedExposure, getUrlParameter, httpGetPromise} from '@js/utils';
import ResultPop from '../resultpop';

import toast from '@components/toast/1.0.0/index';

class GiftBox {
  constructor({container = '#db-content'}) {
    this.container = $(container);
    this.$mkfGiftBox = null;
    this.init();
  }

  init() {
    this.createDom();
    this.events();
  }

  createDom() {
    let dom =
      `<div class="mkf-gift-box">
        <div class="gift-box"></div>
        <div class="box-effect"></div>
      </div>`;

    this.container.append(dom);
  }

  show() {
    embedExposure(embedData.treasure_box_exposure);
    this.$mkfGiftBox.show();
  }

  hide() {
    this.$mkfGiftBox.remove();
  }

  events() {
    this.$mkfGiftBox = $('.mkf-gift-box');
    this.$mkfGiftBox.on('click', () => {
      embedClick(embedData.treasure_box_click);
      // 用户点击后消失
      this.hide();
      // 获取券
      httpGetPromise(
        {
          url: '/advert/getAdvert',
          data: {
            sessionKey: CFG.sessionKey,
            dsm: getUrlParameter('dsm'),
            dpm: getUrlParameter('dpm'),
            dcm: getUrlParameter('dcm'),
            gameId: getUrlParameter('id')
          },
        })
        .then((data) => {
          if (data.data.success) {
            let resultPop = new ResultPop({
              type: 'secret',
              data: data.data,
              msg: data.msg,
              onJump: () => {
              }
            });
            resultPop.show();
          } else {
            toast.make({
              content: '糟糕，宝箱是空的~',
            });
          }
        }).catch((err) => {
        console.error(err);
      })
    });
  }

}

export default GiftBox;