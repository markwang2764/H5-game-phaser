/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-09
 * @des
 */
import {embedClick, embedExposure, getUrlParameter, httpGetPromise, httpPostPromise} from '@js/utils';
import ConfirmPop from './confirmpop';
import ResultPop from './resultpop';

class BetPop {
  constructor({
                option = {
                  id: 0,
                  odds: 1
                }, main, onClose, container = '#db-content', guessId = 0, normalMode = 0, superMode = 0, mostMode = 0
              }) {
    this.expect = 0;
    // this.balance = CREATE.balance || 0;
    this.steps = [normalMode, superMode, mostMode];
    this.odds = option.odds;
    this.optionId = option.id;
    this.guessId = guessId;
    this.noteCount = 1;
    this.container = $(container);
    this.defaultSelected = 0;
    this.currentStep = this.steps[this.defaultSelected];
    this.confirm = false; // 第二次提交后设置为true
    this.onClose = onClose;
    this.main = main;
    // dom
    this.$pop = null;
    this.$amountConfirm = null;
    this.$btnConfirm = null;
    this.$expect = null;
    this.$balance = null;
    this.$noteCount = null;

    this.confirmPop = null;

    this.init();
  }

  init() {
    if ($('.bet-pop').length > 0) {
      $('.bet-pop').remove();
    }
    this.createDom();
    this.events();
    this.update();
  }

  show() {
    this.$pop.show();
    embedExposure(embedData.coin_button_exposure);

    // let height = this.$pop.find('.bet-pop-main').height();
    // let st = $('html').scrollTop();
    // this.container.append(`<div class="bet-pop-fix" style="height: ${height}px"></div>`);
    // $('html').scrollTop(st + height);
  }

  hide() {
    this.onClose && this.onClose();
    this.$pop.remove();
    $('.bet-pop-fix').remove();
  }

  update() {
    this.expect = BetPop.fixNumber(this.noteCount * this.odds * this.currentStep);

    this.$amountConfirm.html(BetPop.fixNumber(this.noteCount * this.currentStep));
    this.$expect.html(this.expect);
    this.$balance.html(CREATE.balance);
    this.$noteCount.html(this.noteCount);

  }

  static fixNumber(amount) {
    return amount.toFixed(0);
  }

  confirmBet() {
    return httpPostPromise({
      url: '/hotGuess/guess',
      data: {
        sessionKey: CFG.sessionKey,
        gameId: getUrlParameter('id'),
        matchId: this.guessId,
        resultId: this.optionId,
        odds: this.odds,
        amount: BetPop.fixNumber(this.noteCount * this.currentStep),
        confirm: this.confirm,
        pageId: getUrlParameter('pageId')
      }
    });
  }

  getAdvert() {
    return httpGetPromise({
      url: '/advert/getAdvert',
      data: {
        sessionKey: CFG.sessionKey,
        dsm: getUrlParameter('dsm'),
        dpm: getUrlParameter('dpm'),
        dcm: getUrlParameter('dcm'),
        gameId: getUrlParameter('id')
      }
    });
  }

  showCoupon(type, msg) {
    this.getAdvert().then((data) => {
      console.log('getAdvert')
      let resultPop = new ResultPop({
        type: type,
        data: data.data,
        msg: msg
      });
      resultPop.show();
    }).catch((err) => {
      console.error(err);
    })
  }


  doConfirmBet() {
    this.confirmBet().then((data) => {
      this.confirm = true;

      if (data.code == '0500004') {
        this.hide();

        if (parseFloat(data.msg) === NaN) {
          console.error('data.msg 格式不正确');
        } else {
          // 弹出确认框
          this.confirmPop = new ConfirmPop({
            oddsBefore: this.odds,
            oddsNow: parseFloat(data.msg),
            onConfirm: () => {
              this.doConfirmBet();
            },
            onHide: () => {
              this.main.onOddsChange();
              this.update();

            }
          });
          this.confirmPop.show();
        }
      } else {
        this.hide();

        if (data.code == '0500003' || data.code == '0500006') {
          this.showCoupon('error', data.msg);
        } else if (data.code === '200') {
          // 竞猜成功后修改余额
          CREATE.balance = data.data.balance;
          this.main.onOddsChange();
          this.update();
          this.showCoupon('success', data.msg);
          this.confirmPop && this.confirmPop.hide();
        }
      }

      // this.confirmPop && this.confirmPop.hide();
    }).catch((err) => {
      console.error('confirm failed=' + err);
    });
  }

  events() {
    this.$pop = $('.bet-pop');
    this.$btnConfirm = this.$pop.find('.btn-confirm');
    this.$amountConfirm = this.$btnConfirm.find('.amount');
    this.$expect = this.$pop.find('.expect span');
    this.$balance = this.$pop.find('.balance span');
    this.$noteCount = this.$pop.find('.note-count');

    this.$btnConfirm.on('click', () => {
      embedClick(embedData.coin_button_click);

      this.doConfirmBet();
    });
    this.$pop.find('.bet-pop-mask').on('click', () => {
      this.hide();
    });
    this.$pop.find('.step-item').on('click', (evt) => {
      let target = evt.target;
      let idx = target.getAttribute('data-idx');
      this.currentStep = this.steps[idx];
      $(target).addClass('selected').siblings().removeClass('selected');
      this.update();
    });
    // TODO 事件校验
    this.$pop.find('.note-sub').on('click', () => {
      console.log('sub')
      this.noteCount--;
      if (this.noteCount < 1) {
        this.noteCount = 1;
      }
      this.update();
    });
    this.$pop.find('.note-add').on('click', () => {
      console.log('add')
      this.noteCount++;
      this.update();
    });
  }

  createDom() {

    let dom =
      `<div class="bet-pop">
        <div class="bet-pop-mask"></div>
        <div class="bet-pop-main">
            <div class="title-wrap">
                <div class="expect">预期收益<span>${this.expect}</span>金币</div>
                <div class="balance">余额：<span>${CREATE.balance}</span></div>
            </div>
            <div class="content-wrap">
                <ul class="step-list">
                    <li class="step-item selected" data-idx="0">${this.steps[0]}</li>
                    <li class="step-item" data-idx="1">${this.steps[1]}</li>
                    <li class="step-item" data-idx="2">${this.steps[2]}</li>
                </ul>
                <div class="note-wrap">
                    <div class="note-sub"></div>
                    <div class="note-count">${this.noteCount}</div>
                    <div class="note-add"></div>
                    <span class="note-zhu">注</span>
                </div>
            </div>
            <div class="footer-wrap">
                <div class="btn-confirm">确认投入<span class="amount">0</span>金币</div>
            </div>
        </div>
    </div>`;

    this.container.append(dom);
  }
}

export default BetPop;