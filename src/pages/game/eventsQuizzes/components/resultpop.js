/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-11
 * @des
 */

import {httpGet, embedClick, embedExposure, getAdvertClickUrl} from '@js/utils';
import GameGuide from './gameguide/index';

class ResultPop {
  constructor({container = '#db-content', type = ResultPop.TYPE_ERROR, data , msg = '', onJump}) {

    this.data = data;
    this.msg = msg; // 提示信息
    this.$pop = null;
    this.onJump = onJump;
    this.styleType = type;
    this.isShowGameGuide = !data.success && type !== ResultPop.TYPE_SECRET; // 神秘礼物不做引流
    this.type = type;
    this.container = $(container);
    this.init();
  }

  init() {
    if ($('.result-pop').length > 0) {
      $('.result-pop').remove();
    }
    // 是否为引流弹层
    if (this.type === ResultPop.TYPE_SUCCESS && this.isShowGameGuide) {
      this.type = ResultPop.TYPE_SUCCESS_GUIDE;
    }
    if (this.type === ResultPop.TYPE_ERROR && this.isShowGameGuide) {
      this.type = ResultPop.TYPE_ERROR_GUIDE;
    }
    this.createDom();
    this.events();
    this.update();
  }

  show() {
    this.$pop.show();
    if (this.type === ResultPop.TYPE_SECRET) {
      embedExposure(this.data.advertEmbedBase.treasure_box_adv_exposure);
      embedExposure(this.data.advertEmbedBase.treasure_box_adv_button_exposure);

      embedExposure(embedData.treasure_box_close_exposure);
    } else if (this.type === ResultPop.TYPE_ERROR_GUIDE || this.type === ResultPop.TYPE_SUCCESS_GUIDE){
      embedExposure(embedData.guess_fail_close_button_exposure);

    } else {
      embedExposure(this.data.advertEmbedBase.guess_result_adv_exposure);
      embedExposure(this.data.advertEmbedBase.guess_result_adv_button_exposure);

      embedExposure(embedData.guess_fail_close_button_exposure);
    }
  }

  hide() {
    this.$pop.remove();
  }

  update() {

  }

  windowJump (url) {
    this.onJump && this.onJump();
    location.href = url;
  }


  events() {
    this.$pop = $('.result-pop');

    this.$pop.find('.btn-close').on('click', () => {
      this.hide();

      if (this.type === ResultPop.TYPE_SECRET) {
        embedClick(embedData.treasure_box_close_click);
      } else {
        embedClick(embedData.guess_fail_close_button_click);
      }
    });

    this.$pop.find('.coupon-img').on('click', () => {
      if (this.type === ResultPop.TYPE_SECRET) {
        embedClick(this.data.advertEmbedBase.treasure_box_adv_click, ()=>{
          this.windowJump(getAdvertClickUrl(this.data))
        });
      } else {
        embedClick(this.data.advertEmbedBase.guess_result_adv_click, ()=>{
          this.windowJump(getAdvertClickUrl(this.data))
        });
      }

    });

    this.$pop.find('.btn-get').on('click', () => {
      if (this.type === ResultPop.TYPE_SECRET) {
        embedClick(this.data.advertEmbedBase.treasure_box_adv_button_click, ()=>{
          this.windowJump(getAdvertClickUrl(this.data))
        });
      } else {
        embedClick(this.data.advertEmbedBase.guess_result_adv_button_click, ()=>{
          this.windowJump(getAdvertClickUrl(this.data))
        });
      }
    });
  }



  createDom() {
    let tip1,
      tip2,
      title,
      couponContainer,
      gameGuideContainer;

    switch (this.type) {
      case ResultPop.TYPE_SUCCESS:
        title = '竞猜成功';
        tip1 = '您已成功参与，请等待系统开奖！';
        tip2 = '送您一份';
        break;

      case ResultPop.TYPE_ERROR:
        title = '竞猜失败';
        tip1 = this.msg;
        tip2 = '来试试';
        break;
      case ResultPop.TYPE_SECRET:
        title = '恭喜获得神秘礼品';
        tip1 = '';
        tip2 = '';
        break;

      case ResultPop.TYPE_SUCCESS_GUIDE:
        title = '竞猜成功';
        tip1 = '您已成功参与，请等待系统开奖！';
        tip2 = '试试其他游戏吧';
        break;

      case ResultPop.TYPE_ERROR_GUIDE:
        title = '竞猜失败';
        tip1 = this.msg;
        tip2 = '试试其他游戏吧！';
        break;
    }

    if (this.isShowGameGuide) {
      couponContainer =  ``;
      gameGuideContainer = `<div class="game-guide-container"></div>`;
    } else {
      couponContainer =
      `<div class="coupon-container">
        <div class="coupon-wrap">
          <img class="coupon-img" src="${this.data.materialUrl}">
          <div class="coupon-title">${this.data.advertName}</div>
        </div>
        <div class="btn-get">立即领取</div>
      </div>`;
      gameGuideContainer = ``;
    }

    let dom =
      `<div class="result-pop">
        <div class="result-pop-mask"></div>
        <div class="result-pop-main ${this.styleType}">
          <div class="title-wrap">
            <div class="title-text">${title}</div>
            <div class="title-bg"></div>
          </div>
          <div class="content-wrap">
            <div class="tip1">
              ${tip1}
            </div>
            <div class="tip2">
              ${tip2}
            </div>
            ${couponContainer}    
            ${gameGuideContainer}
          </div>
          <div class="btn-close"></div>
        </div>
      </div>`;

    this.container.append(dom);

    if (this.isShowGameGuide) {
      new GameGuide();
    }
  }
}

ResultPop.TYPE_ERROR = 'error';
ResultPop.TYPE_SUCCESS = 'success';
ResultPop.TYPE_SECRET = 'secret';
ResultPop.TYPE_ERROR_GUIDE = 'error_guide';
ResultPop.TYPE_SUCCESS_GUIDE = 'success_guide';

export default ResultPop;