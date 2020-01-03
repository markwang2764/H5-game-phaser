/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-11
 * @des
 */

import {embedClick, embedExposure} from '@js/utils';

class ConfirmPop {
  constructor({oddsBefore, oddsNow, container = '#db-content', onConfirm, onHide}) {
    this.data = null;
    this.$pop = null;
    this.oddsBefore = oddsBefore;
    this.oddsNow = oddsNow;
    this.container = $(container);
    this.onConfirm = onConfirm;
    this.onHide = onHide;
    this.init();
  }


  init() {
    if ($('.confirm-pop').length > 0) {
      $('.confirm-pop').remove();
    }
    this.createDom();
    this.events();
    this.update();
  }

  show() {
    this.$pop.show();
    embedExposure(embedData.odds_change_close_exposure);
    embedExposure(embedData.odds_change_confirm_exposure);
    embedExposure(embedData.odds_change_cancel_exposure);
  }

  hide() {
    this.onHide();
    this.$pop.remove();
  }

  update() {

  }

  events() {
    this.$pop = $('.confirm-pop');
    this.$pop.find('.btn-cancel').on('click', () => {
      embedClick(embedData.odds_change_cancel_click);
      this.hide();
    });
    this.$pop.find('.btn-close').on('click', () => {
      this.hide();
      embedClick(embedData.odds_change_close_click);
    });
    this.$pop.find('.btn-confirm').on('click', () => {
      this.onConfirm && this.onConfirm();
      embedClick(embedData.odds_change_confirm_click);
    });
  }

  createDom() {
    let dom =
      `<div class="confirm-pop">
        <div class="confirm-pop-mask"></div>
        <div class="confirm-pop-main success">
          <div class="title-wrap">
            <div class="title-text">赔率变化</div>
          </div>
          <div class="content-wrap">
            <div class="tip1">
              由于您在本页面停留时间过长，实时赔率已经发生变化，当前赔率为：
            </div>
      
            <div class="odds-wrap">
              <div class="odds-before">${this.oddsBefore}</div>
              <div class="odds-arrow"></div>
              <div class="odds-now">${this.oddsNow}</div>
      
            </div>
            <div class="footer-wrap">
              <div class="btn-cancel">取消</div>
              <div class="btn-confirm">确认竞猜</div>
            </div>
          </div>
          <div class="btn-close"></div>
        </div>
      </div>`;
    this.container.append(dom);
  }
}

export default ConfirmPop;