/**
 * @note    游戏大厅新人弹层2.0
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */
import './index.less';
import Embed from '../../embed';

function WelcomePop () {
  this.timer = null;
  this.embed = new Embed();
  this.embed.init();
  this.init();
}

String.prototype.getLength = function () {
  return this.replace(/[^\x00-\xff]/ig, 'aa').length;
};

/**
 * 保留字符数
 * @param str
 * @param n
 */
function subTextStr (str, n) {
  if (str.getLength() > n) {
    str = str.substring(0, str.length - 1);
    return subTextStr(str, n);
  }
  return str;
}

/**
 * 保留字符数 + 省略号，字符串：游客12345678，如保留六位，则取前十个字符
 * @param str
 * @param n
 */
function reserveStr (str, n) {
  str = subTextStr(str, 2 * (n + 1));

  if (str.getLength() > 2 * n) {
    str = subTextStr(str, 2 * (n - 1)) + '...';
  }

  return str;
}

WelcomePop.prototype.createDom = function () {
  let name = CFG.nickName;
  let avatar = CFG.headUrl;

  let coinDom = ``;

  name = reserveStr(name, 6);

  (CFG.rewardAmount + '').split('').forEach(item => {
    coinDom += `<span class="coin-num${parseInt(item)}"></span>`;
  });
  let dom =
    `<div class="welcome-pop">
    <div class="welcome-pop-mask"></div>
    <div class="welcome-pop-main">
      <div class="w-bg">
        <div class="w-avatar"></div>
        <div class="w-close"></div>
        <div class="w-name">玩家<span class="enhanced">【${name}】</span>，能见到你真是太好啦～</div>
        <div class="w-farewell"></div>
        <div class="coin-wrap">
          <div class="coin-label"></div>
          <div class="coin-value">${coinDom}</div>
        </div>
        <div class="notify">
          <div class="notify-left">游客Z0L325X<br>在<span class="enhanced">炮炮堂</span>赚得金币兑换了<span class="enhanced">888元现金红包</span></div>
          <div class="notify-right"></div>
        </div>
        <div class="btn-go"></div>
        <div class="auto-go"></div>
        <div class="auto-set">系统已为你自动分配游客身份</div>
  
      </div>
    </div>
  </div>`;
  $('body').append(dom);
  if (avatar) {
    $('.welcome-pop .w-avatar').css('background-image', `url(${avatar})`);
  }
  this.$btnGo = $('.welcome-pop .btn-go');
  this.$autoGo = $('.welcome-pop .auto-go');
  this.$coinValue = $('.welcome-pop .coin-value');
  this.$container = $('.welcome-pop');
  this.$btnClose = $('.welcome-pop .w-close');
  this.$notify = $('.welcome-pop .notify');
};

WelcomePop.prototype.event = function () {
  this.$btnGo.on('click', () => {
    this.embed.singleClk(Embed.TYPE_3, function () {
      location.href = $('#one a').eq(0).attr('data-href');
    });
  });

  this.$btnClose.on('click', () => {
    this.embed.singleClk(Embed.TYPE_1);
    this.hide();
  });

  this.$notify.on('click', () => {
    this.embed.singleClk(Embed.TYPE_2);
  });
};

WelcomePop.prototype.init = function () {
  this.createDom();
  this.event();
};

/**
 * 倒计时自动跳转到对应游戏
 * @param n
 * @param url
 */
WelcomePop.prototype.autoJump = function (n, url) {
  let count = n;
  this.$autoGo.html(`正在为您自动跳转（${count}）`);
  this.timer = setInterval(() => {
    count--;
    console.log(count);
    this.$autoGo.html(`正在为您自动跳转（${count}）`);
    if (count <= 0) {
      this.timer && clearInterval(this.timer);
      this.embed.singleClk(Embed.TYPE_4, function () {
        location.href = $('#one a').eq(0).attr('data-href');
      });
    }
  }, 1000);
};

WelcomePop.prototype.show = function () {
  let _ = this;
  this.$container.show();

  this.embed.singleExp(Embed.TYPE_1);
  this.embed.singleExp(Embed.TYPE_2);
  this.embed.singleExp(Embed.TYPE_3);
  this.embed.singleExp(Embed.TYPE_4);

  this.autoJump(6);
};

WelcomePop.prototype.hide = function () {
  this.timer && clearInterval(this.timer);
  this.$container.remove();
};

export default WelcomePop;
