/**
 * @note    积分兑换弹层
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-18
 * @des
 */
import './index.less';
import * as utils from '@js/utils';
import Embed from './embed';
import toast from '@components/toast/1.0.0/index';

/**
 * 适应640或750的rem页面
 */
function fit640Or750 ($div) {
  let $matchSizeDom = $('<div class="msd" style="width: 3.75rem;height: 0;"></div>');
  $('body').append($matchSizeDom);
  let f = 640 / 750;
  let w = $matchSizeDom.width();
  let ww = $(window).width();

  // 750屏幕两者差值不会太大
  if (Math.abs(w - ww) > 10) {
    $div.css('transform', `scale(${f})`);
  }
}

function ExchangePop (option = {}) {
  this.creditStep = 10; // 积分兑换梯度
  this.coinStep = parseFloat(CFG.thirdRate) < 1 ? 1 : parseFloat(CFG.thirdRate); // 金币兑换梯度
  this.rate = parseFloat(CFG.thirdRate);
  this.embed = new Embed();
  this.embed.init(option.embed);
  this.curCoin = this.coinStep; // 兑换积分页已选择金币
  this.curCredits = this.creditStep; // 兑换金币页已选择积分
  this.amount = 0; // 用户金币数
  this.credits = 0; // 用户积分数
  this.onClose = option.onClose;
  // 兑换成功回调
  this.exchangeSuccess = option.exchangeSuccess || null;
  this.init();
}

ExchangePop.COIN = 'coin';
ExchangePop.CREDIT = 'credit';

ExchangePop.prototype.createDom = function () {
  let unitName = CFG.thirdName || '积分';
  let coinName = CFG.moneyName || '金币';
  let dom =
    `<div class="exchange-pop">
      <div class="exchange-pop-mask"></div>
      <div class="exchange-pop-main">
        <div class="ex-bg">
          <div class="ex-close"></div>
          <div class="ex-bubble">点击兑换${unitName}</div>
          <div class="ex-tabs">
            <div class="ex-tab ex-tab-coin active">换${coinName}</div>
            <div class="ex-tab ex-tab-credit">换${unitName}</div>
          </div>
          <div class="tab-content coin-container">
            <div class="ex-remain">你剩余：<span class="ex-remain-credits"></span>${unitName}</div>
            <div class="ex-isuse">是否用</div>
            <div class="ex-op-wrap">
              <div class="ex-sub"></div>
              <div class="ex-coin-wrap">
                <div class="exc-left">${unitName}</div>
                <div class="exc-right exc-credits">1000</div>
              </div>
              <div class="ex-add"></div>
              <div class="ex-all"></div>
            </div>
            <div class="ex-exchange">兑换</div>
            <div class="ex-coin-wrap">
              <div class="exc-left">${coinName}</div>
              <div class="exc-right exc-coin">1000</div>
            </div>
            <div class="ex-btn-exchange"></div>
            <div class="ex-tip">${coinName}可随时换回${unitName}</div>
          </div>
          <div class="tab-content credit-container">
            <div class="ex-remain">你剩余：<span class="ex-remain-coin"></span>${coinName}</div>
            <div class="ex-isuse">是否用</div>
            <div class="ex-op-wrap">
              <div class="ex-sub"></div>
              <div class="ex-coin-wrap">
                <div class="exc-left">${coinName}</div>
                <div class="exc-right exc-coin">1000</div>
              </div>
              <div class="ex-add"></div>
              <div class="ex-all"></div>
            </div>
            <div class="ex-exchange">兑换</div>
            <div class="ex-coin-wrap">
              <div class="exc-left">${unitName}</div>
              <div class="exc-right exc-credits">1000</div>
            </div>
            <div class="ex-btn-exchange"></div>
          </div>
        </div>
      </div>
    </div>`;
  $('body').append(dom);

  this.$container = $('.exchange-pop');
  this.$main = $('.exchange-pop .exchange-pop-main');
  this.$btnClose = $('.exchange-pop .ex-close');
  this.$tabs = $('.ex-tab');
  this.$tabCoin = $('.ex-tab-coin');
  this.$tabCredit = $('.ex-tab-credit');
  this.$tabContents = $('.exchange-pop .tab-content');
  this.$coinContainer = $('.exchange-pop .coin-container'); // 积分兑换金币
  this.$creditContainer = $('.exchange-pop .credit-container'); // 金币兑换积分
  this.$remainCredits = $('.exchange-pop .ex-remain-credits');
  this.$remainCoin = $('.exchange-pop .ex-remain-coin');
  this.$bubble = $('.exchange-pop .ex-bubble');

  this.$coinBtnAdd = this.$coinContainer.find('.ex-add');
  this.$coinBtnSub = this.$coinContainer.find('.ex-sub');
  this.$coinBtnAll = this.$coinContainer.find('.ex-all');
  this.$coinBtnExchange = this.$coinContainer.find('.ex-btn-exchange');
  this.$coinExcCredits = this.$coinContainer.find('.exc-credits');
  this.$coinExcCoin = this.$coinContainer.find('.exc-coin');

  this.$creditsBtnAdd = this.$creditContainer.find('.ex-add');
  this.$creditsBtnSub = this.$creditContainer.find('.ex-sub');
  this.$creditsBtnAll = this.$creditContainer.find('.ex-all');
  this.$creditsBtnExchange = this.$creditContainer.find('.ex-btn-exchange');
  this.$creditsExcCredits = this.$creditContainer.find('.exc-credits');
  this.$creditsExcCoin = this.$creditContainer.find('.exc-coin');
};

ExchangePop.prototype.toggleTab = function (type) {
  this.$tabs.removeClass('active');
  this.$tabContents.hide();
  if (type === ExchangePop.COIN) {
    this.$tabCoin.addClass('active');
    this.$coinContainer.show();
    this.embed.singleExp(Embed.TYPE_3);
    this.embed.singleExp(Embed.TYPE_6);
  } else if (type === ExchangePop.CREDIT) {
    this.$tabCredit.addClass('active');
    this.$creditContainer.show();
    this.embed.singleExp(Embed.TYPE_4);
    this.embed.singleExp(Embed.TYPE_7);
    // 切换tab后不再显示气泡
    this.$bubble.hide();
  }
};

ExchangePop.prototype.event = function () {
  this.$tabCoin.on('click', () => {
    this.toggleTab(ExchangePop.COIN);
    this.embed.singleClk(Embed.TYPE_1);
  });
  this.$tabCredit.on('click', () => {
    this.toggleTab(ExchangePop.CREDIT);
    this.embed.singleClk(Embed.TYPE_2);
  });
  this.$btnClose.on('click', () => {
    this.embed.singleClk(Embed.TYPE_5);
    this.closeNoEmbed();
  });
  // 兑换金币页操作
  this.$coinBtnAdd.on('click', () => {
    if (this.curCredits + this.creditStep > this.credits) {
      toast.make({
        type: 'info',
        content: '没有足够的余额'
      });
      return;
    }
    this.curCredits += this.creditStep;
    let coin = toNum(this.curCredits * this.rate);
    this.$coinExcCoin.html(coin);
    this.$coinExcCredits.html(this.curCredits);
  });
  this.$coinBtnSub.on('click', () => {
    if (this.curCredits <= this.creditStep) {
      toast.make({
        type: 'info',
        content: '不可小于最低兑换金额'
      });
      return;
    }
    this.curCredits -= this.creditStep;
    let coin = toNum(this.curCredits * this.rate);
    this.$coinExcCoin.html(coin);
    this.$coinExcCredits.html(this.curCredits);
  });

  this.$coinBtnAll.on('click', () => {
    this.embed.singleClk(Embed.TYPE_6);
    this.curCredits = Math.floor(this.credits / this.creditStep) * this.creditStep;
    let coin = toNum(this.curCredits * this.rate);
    this.$coinExcCoin.html(coin);
    this.$coinExcCredits.html(this.curCredits);
  });

  // 兑换积分页操作
  this.$creditsBtnAdd.on('click', () => {
    if (this.curCoin + this.coinStep > this.amount) {
      toast.make({
        type: 'info',
        content: '没有足够的余额'
      });
      return;
    }
    this.curCoin += this.coinStep;
    let credits = toNum(this.curCoin / this.rate);
    this.$creditsExcCoin.html(this.curCoin);
    this.$creditsExcCredits.html(credits);
  });
  this.$creditsBtnSub.on('click', () => {
    if (this.curCoin <= this.coinStep) {
      toast.make({
        type: 'info',
        content: '不可小于最低兑换金额'
      });
      return;
    }
    this.curCoin -= this.coinStep;
    let credits = toNum(this.curCoin / this.rate);
    this.$creditsExcCoin.html(this.curCoin);
    this.$creditsExcCredits.html(credits);
  });

  this.$creditsBtnAll.on('click', () => {
    this.embed.singleClk(Embed.TYPE_7);

    this.curCoin = Math.floor(this.amount / this.coinStep) * this.coinStep;
    let credits = toNum(this.curCoin / this.rate);

    this.$creditsExcCoin.html(this.curCoin);
    this.$creditsExcCredits.html(credits);
  });

  this.$coinBtnExchange.on('click', () => {
    this.embed.singleClk(Embed.TYPE_3);
    if (this.credits < this.curCredits) {
      toast.make({
        type: 'info',
        content: '余额不足，兑换失败'
      });
      return;
    }
    this.exChangeCredits(toNum(this.curCredits * this.rate), false);
  });

  this.$creditsBtnExchange.on('click', () => {
    this.embed.singleClk(Embed.TYPE_4);
    // 余额校验
    if (this.amount < this.curCoin) {
      toast.make({
        type: 'info',
        content: '余额不足，兑换失败'
      });
      return;
    }
    this.exChangeCredits(toNum(this.curCoin), true);
  });
};

function toNum (n) {
  return parseFloat(n).toFixed(0);
}

ExchangePop.prototype.init = function () {
  this.createDom();
  this.event();

  // 大厅和游戏rem基础值设置不同,做适配
  fit640Or750(this.$main);
  this.toggleTab(ExchangePop.COIN);
  this.embed.singleExp(Embed.TYPE_1);
  this.embed.singleExp(Embed.TYPE_2);
  this.embed.singleExp(Embed.TYPE_5);
  // 剩余积分和金币
  this.getCredits();
  this.$coinExcCredits.html(this.creditStep);
  this.$coinExcCoin.html(toNum(this.creditStep * this.rate));

  this.$creditsExcCoin.html(this.coinStep);
  this.$creditsExcCredits.html(toNum(this.coinStep / this.rate));
};

ExchangePop.prototype.show = function () {
  this.$container.show();
};

ExchangePop.prototype.hide = function () {
  this.$container.remove();
};

ExchangePop.prototype.getCredits = function () {
  let _ = this;
  let data = {};
  if (CFG && CFG.uskA) {
    data.userKey = CFG.uskA;
  }
  $.ajax({
    url: '/common/getUserAmount',
    type: 'get',
    dataType: 'json',
    data: data, // 现金钱包类型
    success: function success (result) {
      let data = result.data;
      if (result.success) {
        _.amount = data.amount;
        _.credits = data.thirdAmount;
        _.$remainCredits.html(_.credits);
        _.$remainCoin.html(_.amount);
      } else {
        console.log('getUserAmount failed');
      }
    },
    error: function error () {
      console.log('getUserAmount failed');
    }
  });
};

ExchangePop.prototype.closeNoEmbed = function () {
  this.hide();
  this.onClose && this.onClose();
};

/**
 * 积分兑换接口
 * @param amount
 * @param isCash
 */
ExchangePop.prototype.exChangeCredits = function (amount, isCash) {
  let _ = this;
  let data = {
    amount: amount,
    isCash: isCash
  };
  let id = utils.getUrlParameter('id') || 0;
  let dsm = utils.getUrlParameter('dsm');

  if (location.href.indexOf('/direct/index') === -1) {
    data.gameId = id;
  } else {
    data.pageId = id;
  }
  if (dsm) {
    data.dsm = dsm;
  }
  if (CFG && CFG.uskA) {
    data.userKey = CFG.uskA;
  }
  $.ajax({
    url: '/common/cashUserAmount',
    type: 'get',
    dataType: 'json',
    data: data, // 现金钱包类型
    beforeSend: function () {
      if (isCash) {
        // 兑换积分
        _.$creditsBtnExchange.addClass('disabled');
      } else {
        _.$coinBtnExchange.addClass('disabled');
      }
    },
    success: function success (result) {
      if (isCash) {
        // 兑换积分
        _.$creditsBtnExchange.removeClass('disabled');
      } else {
        _.$coinBtnExchange.removeClass('disabled');
      }
      let data = result.data;
      if (result.success) {
        _.amount = data.amount;
        _.credits = data.thirdAmount;
        _.$remainCredits.html(_.credits);
        _.$remainCoin.html(_.amount);
        _.exchangeSuccess && _.exchangeSuccess(
          {
            amount: _.amount
          });
        toast.make({
          type: 'success',
          content: '兑换成功'
        });
        setTimeout(()=>{
          _.closeNoEmbed();
        }, 2000);
      } else {
        toast.make({
          type: 'error',
          title: '兑换失败',
          content: '请重试'
        });
      }
    },
    error: function error () {
      if (isCash) {
        // 兑换积分
        _.$creditsBtnExchange.removeClass('disabled');
      } else {
        _.$coinBtnExchange.removeClass('disabled');
      }
      toast.make({
        type: 'error',
        title: '兑换失败',
        content: '请重试'
      });
    }
  });
};

module.exports = ExchangePop;
