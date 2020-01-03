/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-13
 * @des
 */
import {getUrlParameter, httpGet} from '@js/utils';
import Promise from 'promise-polyfill';

const ANiM_TIME = 600;

class Record {
  constructor({container = '#db-content'}) {
    this.container = $(container);
    this.$recordPopMain = null;
    this.$recordPopMask = null;
    this.$recordPopContent = null;
    this.recordStatus = 0; // 0 未展开 1 展开中 2 已展开
    this.init();
  }

  init() {
    this.createDom();
    this.events();
  }

  events() {
    this.$recordPopMask.on('click', () => {
      this.hide();
    });

    this.$recordPopMain.on('click', () => {
      if (this.recordStatus === 2) {
        this.hide();
      } else if (this.recordStatus === 0) {
        this.show();
      }
    });
  }

  createDom() {

    let dom =
      `<div class="record-pop-main">
        <div class="record-pop-content">
          <div class="content-li">
            <div class="li-count li-bet-num">0</div>
            <div class="li-text">竞猜场次</div>
          </div>
          <div class="content-li">
            <div class="li-count li-prize-num">0</div>
            <div class="li-text">猜中次数</div>
          </div>
          <div class="content-li" >
            <div class="li-count li-total-earn">0</div>
            <div class="li-text">累计收益</div>
          </div>
        </div>
      </div>
      <div class="record-pop-mask"></div>`;

    this.container.append(dom);

    this.$recordPopMain = $('.record-pop-main');
    this.$recordPopMask = $('.record-pop-mask');
    this.$recordPopContent = $('.record-pop-content');
    this.$recordPopMask.hide();

  }

  resetPopMainClass() {
    this.$recordPopMain.removeClass('ashow ahide');
  }

  updateDomData(data) {
    this.$recordPopMain.find('.li-bet-num').html(data.betNum);
    this.$recordPopMain.find('.li-prize-num').html(data.prizeNum);
    this.$recordPopMain.find('.li-total-earn').html(data.totalEarn);
  }

  show() {
    this.resetPopMainClass();
    this.$recordPopMain.addClass('ashow');
    this.recordStatus = 1;
    setTimeout(() => {
      this.recordStatus = 2;
    }, ANiM_TIME);
    this.$recordPopMask.show();
    // 每次显示记录重新获取数据
    this.getHistoryData().then((data) => {
      this.updateDomData(data.data);
    }).catch((err) => {
      console.error(err);
    });

  }

  hide() {
    this.resetPopMainClass();
    this.$recordPopMain.addClass('ahide');
    this.recordStatus = 1;
    setTimeout(() => {
      this.recordStatus = 0;
    }, ANiM_TIME);
    this.$recordPopMask.hide();
  }

  getHistoryData() {
    return new Promise((resolve, reject) => {
      httpGet({
        url: '/hotGuess/getUserBetHistory',
        data: {
          sessionKey: CFG.sessionKey,
          gameId: getUrlParameter('id')
        },
        success: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        }
      })
    });
  }
}

export default Record;