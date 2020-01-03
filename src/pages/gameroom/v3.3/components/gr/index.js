/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-01
 * @des
 */
// const IScroll = require('@js/iScroll');

import * as utils from '@js/utils';
import tryInitNewWall from '../../../components/initNewWall/v2/index';
import EventEmitter from '../../../components/event-emitter/index';
import TongDun from '@components/tongdun/index';
import CoinPop from '../../../components/coinPop/v1/index';
import WelcomePop from '../../../components/welpop/v2/index';
import toast from '@components/toast/1.0.0/index';
import qiandai from '../../flash/qiandai';
import Temp from './template';


const Pop = require('../../../components/showPop');
const IScroll = require('@lib/iscroll-probe/5.2.0/index');

const STORAGE_START_IDX = 'start_idx';

const TASK_EMBED = {};//广告埋点
var TASK_LIST;//任务列表数据
var gameUrl;//马上去玩链接
var puzzleUrl;//再来一局链接
var isWawa;//是否娃娃机大厅

var canvas, stage, exportRoot;
var lib = lib||{};
var images = images||{};
var createjs = window.createjs;

function appendEmbed(obj){
  for(var i in obj){
    TASK_EMBED[i] = obj[i];
  }
}


class GameRoom extends EventEmitter {
  constructor(options = {}) {
    super();
    this.$btnGameBox = $('.btn-game-box');
    this.$btnCoinBox = $('.btn-coin-box');
    this.$newHeader = $('.new-header');
    this.$horizontalScrollList = $('#horizontalScroll .block-list');

    this.prizeLog1 = {};
    this.prizeLog2 = {};
    this.prizeLog3 = {};
    this.prizeLog4 = {};
    this.duibaLog = {};
    this.totalPlayerNum = 0;
    this.cfg = options.cfg;
    this.AVATAR_TOTAL_COUNT = 200;
    this.avatarIdxArr = [];
    this.avatarFirstChange = true;
    this.avatarChangeProbability = 0.2;
    this.bubbleChangeProbability = 0.5;
    this.changeInteval = 5000;
    this.startIdx = utils.getStorage(STORAGE_START_IDX) === null ? 0 : parseInt(utils.getStorage(STORAGE_START_IDX));

    // 用户信息
    this.userInfo = {
      amount: this.cfg.amount,
      headUrl: this.cfg.headUrl,
      nickName: this.cfg.nickName,
      sex: this.cfg.sex,
      userId: this.cfg.consumerId
    };
    for (let i = 0; i < this.AVATAR_TOTAL_COUNT; i++) {
      this.avatarIdxArr.push(i);
    }

    this.initTask();

    this.initQiandai();

    // setTimeout(() => {
    //   this.showNewUserTask(true);
    // }, 1000);

    // setTimeout(() => {
    //   $(".today-back").css("display", "flex");
    // }, 6000);
  }

  showToast(tip){
    $(".new-toast-mask").css("display", "flex");
    $(".new-toast-tip").html(tip);
    setTimeout(() => {
      $(".new-toast-mask").hide();
    }, 1200);
  }

  initHotBlockScroll() {
    let $horizontalScrollItems = this.$horizontalScrollList.find('.block-item');
    if ($horizontalScrollItems.length <= 0) {
      return;
    }

    let listWidth = $horizontalScrollItems.length * (GameRoom.pxUnitAdd($horizontalScrollItems.css('width'), $horizontalScrollItems.css('margin-right')));

    this.$horizontalScrollList.css({
      width: listWidth
    });
    let myScroll = new IScroll('#horizontalScroll', {
      scrollX: true,
      scrollY: false,
      mouseWheel: true,
      scrollbars: false,
      shrinkScrollbars: 'clip',
      fadeScrollbars: false
      // click: utils.isAndroid() // fix android手机点击事件不触发
      // click: true

    });

    myScroll.on('scrollStart', () => {
      window.DB && window.DB.exposure && window.DB.exposure.showLog();
    });
    myScroll.on('scrollEnd', () => {
      window.DB && window.DB.exposure && window.DB.exposure.showLog();
    });
  }

  static scrollTop() {
    setTimeout(() => {
      $('body,html').animate({scrollTop: '0px'}, 600);
    }, 60);
  }

  static pxUnitAdd(a, b) {
    if (!(a && b)) {
      return 0;
    }
    a = parseFloat(a.replace('px', ''));
    b = parseFloat(b.replace('px', ''));
    return a + b;
  }

  events() {
    let embed = this.cfg.embed;
    // 20180524发布兼容
    if (typeof embed === 'string') {
      embed = JSON.parse(embed);
    }

    embed = this.transformEmbed(embed);

    this.onHashChange(window.location.hash);

    window.addEventListener('hashchange', () => {
      this.onHashChange(window.location.hash);
      this.showBack();
    }, true);

    // 新增埋点曝光
    window.DB.exposure.singleExp(JSON.stringify(embed.st_info_user_avatar_exposure));
    window.DB.exposure.singleExp(JSON.stringify(embed.st_info_tab_game_exposure));
    window.DB.exposure.singleExp(JSON.stringify(embed.st_info_tab_coin_exposure));

    // 用户头像修改功能
    this.$newHeader.on('click', () => {
      toast.make({
        type: 'info',
        content: '修改昵称功能即将上线~'
      });
      window.DB.exposure.singleClk({
        data: JSON.stringify(embed.st_info_user_avatar_click)
      });
    });

    this.$btnGameBox.on('click', () => {
      this.toggleTab('index');
      window.DB.exposure.singleClk({
        data: JSON.stringify(embed.st_info_tab_game_click)
      });
    });

    this.$btnCoinBox.on('click', () => {
      this.toggleTab('exchange');
      window.DB.exposure.singleClk({
        data: JSON.stringify(embed.st_info_tab_coin_click)
      });
    });

    // 是否介入媒体积分体系
    if (this.cfg.thirdRate) {
      window.DB.exposure.singleExp(JSON.stringify(embed.st_info_cash_credits_exposure));
      $('.new-add').show().on('click', () => {
        window.CREATE && new window.CREATE.ExchangePop({
          embed: this.cfg.embed,
          exchangeSuccess: function (data) {
            $('.new-money').text(data.amount);
          }
        }).show();

        window.DB.exposure.singleClk({
          data: JSON.stringify(embed.st_info_cash_credits_click),
          callback: () => {
          }
        });
      });
    }

    // 同盾登录
    let tongdun = new TongDun({
      evtEmitter: this
    });

    this.on(tongdun.TONGDUN_INIT, (data) => {
      this.userInfo = data;
      this.updateUserInfo();
    });
  }

  toggleTab(type) {
    if (type === 'index') {
      window.location.hash = '';
    } else if (type === 'exchange') {
      window.location.hash = 'exchange';
    }
  }

  onHashChange(hash) {
    $('#db-content .exchange-page, #db-content .index-page').hide();
    this.$btnGameBox.removeClass('active');
    this.$btnCoinBox.removeClass('active');
    hash = hash == "" ? "#index" : hash;
    switch (hash) {
      case '#index':
        $('#db-content .index-page').show();
        $('#db-content').css('background-color', '#f3f3f3');
        this.$btnGameBox.addClass('active');
        break;
      case '#exchange':
        $('#db-content .exchange-page').show();
        $('#db-content').css('background-color', '#fff');
        this.$btnCoinBox.addClass('active');

        break;
      default:
        break;
    }
    GameRoom.scrollTop();
  }

  showWelcomePop() {
    this.tryPop();
  }

  /**
   * 埋点信息对象上新增头像点击和底部两个tab的埋点
   * @param embed
   */
  transformEmbed(embed = {}) {
    // 拼接埋点
    let baseExposure = embed.st_info_cash_credits_exposure;
    let baseClick = embed.st_info_cash_credits_click;

    let st_info_user_avatar_dpm = {
      dpm: baseExposure.dpm.split('.').splice(0, 3).join('.') + '.3'
    };
    let st_info_tab_game_dpm = {
      dpm: baseExposure.dpm.split('.').splice(0, 3).join('.') + '.4'
    };
    let st_info_tab_coin_dpm = {
      dpm: baseExposure.dpm.split('.').splice(0, 3).join('.') + '.5'
    };

    embed.st_info_user_avatar_exposure = $.extend(true, {}, baseExposure, st_info_user_avatar_dpm);
    embed.st_info_user_avatar_click = $.extend(true, {}, baseClick, st_info_user_avatar_dpm);

    embed.st_info_tab_game_exposure = $.extend(true, {}, baseExposure, st_info_tab_game_dpm);
    embed.st_info_tab_game_click = $.extend(true, {}, baseClick, st_info_tab_game_dpm);

    embed.st_info_tab_coin_exposure = $.extend(true, {}, baseExposure, st_info_tab_coin_dpm);
    embed.st_info_tab_coin_click = $.extend(true, {}, baseClick, st_info_tab_coin_dpm);
    return embed;
  }

  /**
   * 插入引导手势
   */
  showGesture() {
    if ($('.block-hot li.block-item').length > 0) {
      let gesture =
        `<div class="room-gesture-wrap">
                  <div class="room-gesture"></div>
                  <div class="room-gesture-left"></div>
                  <div class="room-gesture-right"></div>
                </div>`;
      $('.room-gesture-wrap').length === 0 && this.$horizontalScrollList.append(gesture);

      // 手势点击第一个区块后不再显示
      if (!utils.getStorage('gesture_click')) {
        // 延迟两秒显示
        setTimeout(function () {
          $('.room-gesture-wrap').show();
        }, 2000);
      }
      $('.room-gesture-left').on('click', function () {
        if ($('.block-hot li.block-item').length > 0) {
          // $('.block-hot li.block-item').eq(0).trigger('click');
          $('.block-hot a.item-link').eq(0).trigger('click');

          utils.setStorage('gesture_click', '1');
        }
      });

      $('.room-gesture-right').on('click', function () {
        if ($('.block-hot li.block-item').length > 1) {
          // $('.block-hot li.block-item').eq(1).trigger('click');
          $('.block-hot a.item-link').eq(1).trigger('click');
        }
      });
    }
  }

  // 获取曝光数据
  setWalletEmbed() {
    let _ = this;
    utils.httpGet({
      url: '/direct/getNewGameHallEmbed',
      data: {
        pageId: utils.getUrlParameter('id'),
        dsm: utils.getUrlParameter('dsm')
      },
      success: (result) => {
        _.prizeLog1.st_info_exposure_btn_more =
          result.data.st_info_exposure_btn_more_1;
        _.prizeLog2.st_info_exposure_btn_more =
          result.data.st_info_exposure_btn_more_2;
        _.prizeLog3.st_info_exposure_btn_more =
          result.data.st_info_exposure_btn_more_3;
        _.prizeLog4.st_info_exposure_btn_more =
          result.data.st_info_exposure_btn_more_4;
        _.prizeLog1.st_info_click_btn_more = result.data.st_info_click_btn_more_1;
        _.prizeLog2.st_info_click_btn_more = result.data.st_info_click_btn_more_2;
        _.prizeLog3.st_info_click_btn_more = result.data.st_info_click_btn_more_3;
        _.prizeLog4.st_info_click_btn_more = result.data.st_info_click_btn_more_4;
        _.prizeLog1.st_info_exposure_btn_do =
          result.data.st_info_exposure_btn_do_1;
        _.prizeLog2.st_info_exposure_btn_do =
          result.data.st_info_exposure_btn_do_2;
        _.prizeLog3.st_info_exposure_btn_do =
          result.data.st_info_exposure_btn_do_3;
        _.prizeLog4.st_info_exposure_btn_do =
          result.data.st_info_exposure_btn_do_4;
        _.prizeLog1.st_info_click_btn_do = result.data.st_info_click_btn_do_1;
        _.prizeLog2.st_info_click_btn_do = result.data.st_info_click_btn_do_2;
        _.prizeLog3.st_info_click_btn_do = result.data.st_info_click_btn_do_3;
        _.prizeLog4.st_info_click_btn_do = result.data.st_info_click_btn_do_4;
        _.duibaLog.st_info_click_btn_credit =
          result.data.st_info_click_btn_credit;
        _.duibaLog.st_info_exposure_btn_credit =
          result.data.st_info_exposure_btn_credit;
        _.getDuibaUrl(); // 获取兑换按钮链接
        _.rejectCFG('prizeEmbed', JSON.stringify(result.data));
      },
      error: () => {
        console.log('曝光失败');
      }
    });
  }

  // 展示弹层
  tryPop() {
    Pop.showPop(() => {
      new WelcomePop({
        amountDiv: $('.new-money'),
        onClose: () => {
          this.showGesture();
        }
      }).show();
    });
  }

  /**
   * 向全局CFG对象注入属性
   * @param {string} key 属性名
   * @param {Object} val 属性值
   */
  rejectCFG(key, val) {
    this.cfg[key] = val;
  }

  getDuibaUrl() {
    utils.httpGet({
      url: '/direct/getDuibaUrl',
      data: {
        balanceType: 2,
        pageId: utils.getUrlParameter('id')
      },
      success: (result) => {
        // 兑换区域
        // 移除绑定的埋点事件
        $('.block-exchange').find('[db-click]').unbind('click.statistics');
        $('.block-exchange').find('.block-item').on('click', function () {
          let data = $(this).parent().attr('db-click');
          window.DB.exposure.singleClk({
            data: data,
            callback: () => {
              window.location.href = result.data;
            }
          });
        });
      },
      error: () => {
        console.log('获取链接失败');
      }
    });
  }

  wxShare() {
    /** *用于获得当前连接url用**/
    /** *用户点击分享到微信圈后加载接口接口*******/
    utils.httpGet({
      url: '//play.tacota.cn/wxLogin/share',
      data: {
        id: utils.getUrlParameter('id'),
        appKey: utils.getUrlParameter('appKey'),
        slotId: utils.getUrlParameter('slotId'),
        deviceId: utils.getUrlParameter('deviceId'),
        url: window.location.href
      },
      success: function (res) {
        wx.config({
          debug: false,
          appId: res.appId,
          timestamp: res.timeStamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ'
          ]
        });
        wx.ready(function () {
          let shareData = {
            title: '好玩尽在玩嗨时光',
            desc: '游戏大厅恭候小主们疯赚金币',
            link:
            'https://activity.tacota.cn/land/landPage?id=296&wxurl=' +
            encodeURIComponent(res.url),
            imgUrl: 'https://yun.tacota.cn/h5-mami/landpage/33.png'
          };
          wx.onMenuShareAppMessage(shareData);
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareQQ(shareData);
          // wx.hideOptionMenu();/***隐藏分享菜单****/
          wx.error(function (res) {
            alert(JSON.stringify(res));
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
        });
      },
      error: () => {
        console.log('transferToAccount error');
      }
    });
  }

  init() {
    this.updateUserInfo();

    // CFG.rewardAmount = 90;
    // TODO
    this.showWelcomePop();

    this.getBlock(); // 初始化区块
    if (utils.isWeiXin()) {
      this.wxShare();// 分享功能
    }
    this.events();
  }


  generateAvatars() {
    let _dom = '';
    for (let i = 0; i < 3; i++) {
      // let idx = Math.floor(Math.random() * this.AVATAR_TOTAL_COUNT);
      _dom += `<img class="item-avatar" data-id="-1">`;
    }
    return _dom;
  }

  randomChangePlayNum() {
    setInterval(function () {
      $('.item-player-num .play-num').each(function (idx, el) {
        let num = parseInt($(this).data('num'));
        num *= Math.random() * 0.1 + 0.95;
        num = num.toFixed(0);
        $(this).html(num);
        $(this).attr('data-num', num);
      });
    }, this.changeInteval);
  }

  // 随机打乱数组
  randomArr(arr) {
    return arr.sort((a, b) => {
      return Math.random() - 0.5;
    });
  }

  randomChangePlayAvatar() {
    this.setPlayAvatar();
    this.avatarFirstChange = false;

    setInterval(() => {
      this.setPlayAvatar();
    }, this.changeInteval);
  }

  randomChangeBubble() {
    this.setBubble();
    setInterval(() => {
      this.setBubble();
    }, this.changeInteval);
  }

  setBubble() {
    let _ = this;
    // new Bubble.start();
    $('.item-bubble').each(function (idx, el) {
      // let parent = $(this).parent();
      $(this).hide();
      if (Math.random() < _.bubbleChangeProbability) {
        let bubbleData;
        try {
          bubbleData = JSON.parse($(this).attr('data-bubble'));
        } catch (err) {
          bubbleData = [];
        }
        if (bubbleData.length === 0) {
          return;
        }
        let currentIdx = parseInt($(this).attr('data-current')) || 0;
        $(this).find('.item-bubble-text').html(bubbleData[currentIdx]);
        $(this).show();
        currentIdx++;
        if (currentIdx >= bubbleData.length) {
          currentIdx = 0;
        }
        $(this).attr('data-current', currentIdx);
      }
    });
  }

  setPlayAvatar() {
    let _ = this;

    let len = $('.block-battle .item-avatar').length;
    // 打乱数组后取前N个
    // 头像id数组
    // debugger
    let randomArr = (this.randomArr(this.avatarIdxArr)).slice(0, len);
    let changeDomIdxs = [];
    $('.block-battle .item-avatar').each(function (idx, el) {
      let $this = $(this);

      if (_.avatarFirstChange) {
        changeDomIdxs.push(idx);
        return;
      }

      if (Math.random() >= _.avatarChangeProbability) {
        randomArr.forEach((item, index) => {
          if (parseInt($this.attr('data-id')) === item) {
            // 随机数组中移除不变的头像id
            randomArr.splice(index, 1);
          }
        });
      } else {
        changeDomIdxs.push(idx);
      }
    });

    let count = 0;

    $('.block-battle .item-avatar').each(function (idx, el) {
      let $this = $(this);
      changeDomIdxs.forEach((item, index) => {
        if (idx === item) {
          // 需要改变头像的dom
          let avatarId = randomArr[count];
          count++;
          $this.attr('src', _.getAvatar(avatarId));
          $this.attr('data-id', avatarId);
        }
      });
    });
  }

  renderRegionType(region) {
    let _ = this;
    Object.keys(region).forEach((item, index) => {
      if (!region[item]) {
        return;
      }
      let blocks = region[item].blocks;
      // 初始化
      if (blocks && blocks.length > 0) {
        $(`[data-name="${item}"]`).find('.block-list').html('');

        blocks.forEach((b, idx) => {
          let blockName = b.blockName;
          let gameTitle = b.title || '';
          let html = `<li class="block-item" db-exposure=${b.embedInfo.st_info_dpm_exposure}
                db-click=${b.embedInfo.st_info_dpm_click} data-block="${item}" data-blockName="${b.blockName}">`;

          let configArr = gameTitle.split(';');
          let title = configArr[0] || ''; //
          let showNum = parseInt(blockName);

          if (!showNum) showNum = 10000;

          this.totalPlayerNum += showNum;

          switch (item) {
            case 'hot':
              html +=
                `<a class="item-link" data-href="${b.url}" >
                      <img class="item-img" src="${b.image}">
                    </a>
                  </li>`;

              $(`[data-name="${item}"]`).find('.block-list').append(html);

              break;

            case 'coin':
              html +=
                `<a class="item-link" data-href="${b.url}" >
                        <img class="item-img" src="${b.image}">
                        <div class="item-mid">
                          <div class="item-title">${title}</div>
                          <div class="item-subtitle item-player-num"><span class="play-num" data-num="${showNum}">${showNum}</span>人正在玩</div>
                          <div class="item-bubble" style="display: none;" data-gameid="${b.gameId}" data-gametype="${b.gameType}" data-bubble=""><span class="item-bubble-text"></span></div>
                        </div>
                        <div class="item-btn-play">立即开玩</div>
                        </a>
                    </li>`;

              $(`[data-name="${item}"]`).find('.block-list').append(html);
              break;

            case 'battle':
              let avatarDom = this.generateAvatars();
              let playText = configArr[2] || '';
              let subTitle = configArr[1] || '';
              let playDom = idx === 0 ? `<div class="item-player-num"><span class="play-num" data-num="${showNum}">${showNum}</span>对正在${playText}</div>` : '';
              html +=
                `<a class="item-link" data-href="${b.url}"  >
                      <img class="item-img" src="${b.image}">
                      <div class="item-title">${title}</div>
                      <div class="item-subtitle">${subTitle}</div>
                      <div class="item-info-wrap">
                        <div class="item-avatar-list">
                          ${avatarDom}
                        </div>
                        ${playDom}
                      </div>
                      </a>
                    </li>`;

              $(`[data-name="${item}"]`).find('.block-list').append(html);

              break;

            case 'exchange':
              html +=
                `<a class="item-link" data-href="${b.url}" >
                  <img class="item-img" src="${b.image}">
                </a>
              </li>`;

              $(`[data-name="${item}"]`).find('.block-list').append(html);

              break;

            case 'start':
              // this.startIdx = parseInt(utils.getStorage(STORAGE_START_IDX)) || 0;
              // fix 区块个数发生减少产生的bug
              // debugger
              // if (_.startIdx >= blocks.length) {
              //   _.startIdx = 0;
              //   utils.setStorage(STORAGE_START_IDX, _.startIdx);
              // }
              if (this.startIdx === idx) {
                html = `<div class="btn-quick-start-box block-item"  db-exposure=${b.embedInfo.st_info_dpm_exposure}
                db-click=${b.embedInfo.st_info_dpm_click} data-block="${item}" data-blockName="${blockName}">
                        <a class="item-link" data-href="${b.url}"  >
                          <img class="btn-quick-start" src="${b.image}">
                        </a>
                      </div>`;
                $(`[data-name="${item}"]`).html('').append(html);
              }

              break;

            case 'banner':
              html = `<div class="block-item"  db-exposure=${b.embedInfo.st_info_dpm_exposure}
                db-click=${b.embedInfo.st_info_dpm_click} data-block="${item}" data-blockName="${blockName}">
                        <a class="item-link" data-href="${b.url}"  >
                          <img class="banner-img" src="${b.image}">
                        </a>
                      </div>`;
              $(`[data-name="${item}"]`).html('').append(html);

              break;
          }
        });
      } else {
        $(`[data-name="${item}"]`).hide();
      }
    });
  }

  setBlockEvents(region) {
    let _ = this;
    $('.block-container .block-item').on('click', function (e) {
      let linkEl = $(this).find('.item-link');
      let blockType = $(this).attr('data-block');
      let url = linkEl.attr('data-href');
      if (blockType === 'start') {
        // 开始按钮循环游戏
        _.startIdx++;
        if (_.startIdx >= (region[blockType].blocks ? region[blockType].blocks.length : 0)) {
          _.startIdx = 0;
        }
        utils.setStorage(STORAGE_START_IDX, _.startIdx);
      }
      // 兑换区块的跳转事件在getDuibaUrl后定义
      if (url && blockType !== 'exchange') {
        window.location.href = url
      }

    });
  }

  /**
   * 获取气泡信息
   * @param cb
   */
  getBubbleData(cb) {
    let gameIds = [];

    $('.item-bubble').each(function (idx, el) {
      let gameId = $(this).attr('data-gameid');
      // let gameType = $(this).attr('data-gametype');
      if (gameId) {
        gameIds.push(parseInt(gameId));
      }
    });

    utils.httpGet({
      url: '/game/getBubbleInfo',
      data: {
        gameIds: gameIds.join(',')
      },
      success: (data = {}) => {
        $('.item-bubble').each(function (idx, el) {
          let bubbleData;
          try {
            bubbleData = JSON.parse($(this).attr('data-bubble'));
          } catch (err) {
            bubbleData = [];
          }
          let gameId = $(this).attr('data-gameid');
          let gameType = parseInt($(this).attr('data-gametype'));
          switch (gameType) {
            case 1:
              bubbleData = [
                'boss出没！快来击杀得金币！',
                '听说有人在这里赚了10w金币！'
              ];
              break;
            case 2:
              bubbleData = [
                '拼手速赢金币啦！'
              ];
              break;

            case 3:
              bubbleData = [
                '即将开奖啦！赶紧上车！'
              ];
              break;

            default:
              break;
          }
          for (let x in data) {
            if (x == gameId) {
              data[x].forEach((item) => {
                // 后端数组中可能会塞入null
                if (item) {
                  bubbleData.unshift(`${utils.reserveStr(item.name, 5)}获得了<span>${utils.tostring(item.golds)}</span>金币`);
                }
              });
            }
          }
          $(this).attr('data-bubble', JSON.stringify(bubbleData));
        });
        cb && cb();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getBlock() {
    let _ = this;
    let _url = '/direct/getDengqin';
    let ajaxData = {
      pageId: this.cfg.id,
      login: this.cfg.login,
      slotId: this.cfg.slotId,
      deviceId: this.cfg.deviceId,
      appKey: this.cfg.appKey,
      dpm: this.cfg.dpm,
      dsm: utils.getUrlParameter('dsm')
    };
    utils.httpGet({
      url: _url,
      data: ajaxData,
      success: (result)=>{
        let region = result.data.region;
        if (result.success && region) {
          _.renderRegionType(region);
          _.setBlockEvents(region);
          _.initHotBlockScroll();
          _.randomChangePlayNum();
          _.randomChangePlayAvatar();
          _.cfg.firstLogin != 1 && _.showGesture();

          // setClickArea();
          tryInitNewWall(_);
          _.getBubbleData(() => {
            _.randomChangeBubble();
          });
          _.setWalletEmbed(); // 初始化按钮曝光埋点数据

          // TODO
          window.DB && window.DB.exposure && window.DB.exposure.initLog();
        }
      }
    });
  }

  /**
   * 请求指定名字的插件
   * @param {string} secName 指定的插件名字
   */
  requestPlugin(secName) {
    window['EmbedPlugin']({
      section: secName,
      mainPageType: 3, // 固定的
      cacheKey: 'pa-adpages-gameroom',
      closeCB: () => {
      }
    });
  }

  updateUserInfo() {
    $('.new-money').text(this.userInfo.amount);
    $('.new-header')[0].style.backgroundImage = `url(${this.userInfo.headUrl})`;
    $('.new-nickname')[0].innerHTML = `<span class="nickname-txt">${this.userInfo.nickName}</span><div class="sex-ico"></div>`;
    if (this.userInfo.sex == 2) {
      $('.sex-ico').addClass('female');
    }
  }

  getAnnouncement(cb) {
    utils.httpGet({
      url: '/direct/getAnnouncement',
      success: (rs)=>{
        if (rs.success) {
          cb && cb(rs.data);
        } else {
          console.error('/direct/getAnnouncement failed');
        }
      }
    });
  }

  getAvatar(n = 0) {
    return `http://yun.tuisnake.com/h5-mami/webgame/web-login/header2/newhander${n}.jpg`;
  }

  //根据字符串模板拼接出html内容
  getAimDesc(str){
    var temp = str.split("#");
    var total = temp[0].split("%").length;
    var desc = temp[0].replace("%", `<span class="new-red">${temp[1]}</span>`);
    for(var i = 1; i < total - 1; i++){
      desc = desc.replace("%", `<img src="${temp[i + 1]}">`);
    }
    return desc;
  }

  //显示娃娃机新人任务弹层
  showNewUserTask(debug){
    if(debug){
      CFG.firstLogin = 1;
    }
    if(CFG.firstLogin == 1 || CFG.firstLogin == 2){
      $(".today-task").css("display", "block");
      var obj = TASK_LIST[0];
      var desc = obj.taskDesc.split("#")[0].replace("%", obj.targetCompleted);
      $(".today-task .tip").html(desc);
      if(obj.thirdReward == 1){
        $(".today-task .money").html(`${obj.completedReward}抓抓币`);
        $(".today-task .img").css("background-image", `url("//yun.dui88.com/h5-mami/webgame/gameroom/v3.2/wawa-coin.png")`);
      }
      else{
        $(".today-task .money").html(`${obj.completedReward}金币`);
        $(".today-task .img").css("background-image", `url("//yun.dui88.com/h5-mami/webgame/gameroom/v3.2/game-coin.png")`);
      }
      $(".today-task .num").html(`<span class="red">${obj.completedNum}</span>/${obj.targetCompleted}`);
      $(".today-task .progress").css("width", obj.completedNum / obj.targetCompleted * 100 + "%");
    
      this.singleExp(TASK_EMBED.home_task_exposure);
      this.singleExp(TASK_EMBED.home_task_go_exposure);
      this.singleExp(TASK_EMBED.home_task_close_exposure);

      $(".today-task .btn").unbind().click(()=>{
        this.singleClk(TASK_EMBED.home_task_go_click);
        window.location = gameUrl;
      })

      $(".today-task .close").unbind().click(()=>{
        this.singleClk(TASK_EMBED.home_task_close_click);
        $(".today-task").hide();
      })
    }
    else{
      $(".today-task").hide();
    }
  }

  //显示返回拦截
  showBack(){
    console.log(location.hash);
    if(!location.hash){
      var day = (new Date()).getDate();
      if(localStorage.getItem("gameroom_" + CFG.consumerId) == day){
        console.log("今日已弹过");
        return;
      }
      localStorage.setItem("gameroom_" + CFG.consumerId, day);
      $(".today-back").css("display", "flex");
      this.singleExp(TASK_EMBED.return_back_confirm_exposure);
      this.singleExp(TASK_EMBED.return_back_cancel_exposure);

      $(".btn-go").unbind().click(()=>{
        this.singleClk(TASK_EMBED.return_back_cancel_click);
        history.back();
      })

      $(".btn-again").unbind().click(()=>{
        this.singleClk(TASK_EMBED.return_back_confirm_click);
        setTimeout(() => {
          window.location = puzzleUrl;
        }, 90);
      })
    }
  }

  initTask(update){
    console.log("11223344");
    $.get("/game/getTaskResult", {
      userId: CFG.consumerId,
      pageId: utils.getUrlParameter("id"),
      slotId: CFG.slotId,
      appKey: utils.getUrlParameter("appKey"),
      dsm: utils.getUrlParameter("dsm"),
      timer: Math.random()
    }, (data)=>{
      data = typeof data == "string" ? JSON.parse(data) : data;
      var completeNum = 0;
      var hasCanGet = false;
      appendEmbed(data.embed);
      this.singleExp(TASK_EMBED.task_button_exposure);

      gameUrl = data.gameUrl;
      puzzleUrl = data.puzzleUrl;

      var list = data.taskResults;
      list.forEach((value, index)=>{
        if(value.rewardStatus == 0){
          value.cls = "lingqu";
          value.btn = "立即领取";
          completeNum++;
          hasCanGet = true;
        }
        else if(value.rewardStatus == 1){
          value.cls = "quwan";
          value.btn = "立即去玩";
        }
        else if(value.rewardStatus == 2){
          value.cls = "kaiqi";
          value.btn = "明天开启";
          completeNum++;
        }

        if(value.taskKey == "boss"){
          value.boss = "boss";
          value.reward = "抽Iphone X";
        }
        else{
          value.boss = "";
          value.reward = "x " + value.completedReward + (value.thirdReward == 1 ? "抓抓币" : "金币");
        }

        if(value.thirdReward == 1){
          value.coin = "//yun.dui88.com/h5-mami/webgame/gameroom/v3.2/wawa-coin.png";
        }
        else{
          value.coin = "//yun.dui88.com/h5-mami/webgame/gameroom/v3.2/game-coin.png";
        }
        // value.taskDesc + `打死<span class="new-red">3</span>个泡泡堂boss`;
        value.desc = this.getAimDesc(value.taskDesc);
      })

      var jtemp = new Temp("renwu-content");
      var html = jtemp.build({list:list});
      $(".new-renwu-scroll").html(html);

      $(".new-renwu-word").html(`今日任务(${completeNum}/${list.length})`);
      if(hasCanGet){
        $(".new-renwu-ico").addClass("can-get");
      }
      else{
        $(".new-renwu-ico").removeClass("can-get");
      }

      TASK_LIST = list;
      history.pushState(null, null, "#index");
      isWawa = data.layerStatus;
      if(!update){
        if(isWawa){
          this.showNewUserTask();
        }
      }
      
    })

    if(update){
      return;
    }

    $(".new-renwu-ico").unbind().click(()=>{
      this.singleClk(TASK_EMBED.task_button_click);
      this.singleExp(TASK_EMBED.task_layer_exposure);
      
      $(".new-renwu-box").show();
      $(".new-renwu-ico").addClass("open");

      TASK_LIST.forEach((value)=>{
        this.singleExp(value.embed.per_task_button_exposure);
      })
    })

    $(".new-mask").unbind().click(function(e){
      if(e.target == e.currentTarget){
        console.log(this);
        console.log(e);
        var $this = $(this);
        if(!$this.hasClass("today-task") && !$this.hasClass("today-back")){
          $(".new-mask").hide();
          $(".new-renwu-ico").removeClass("open");
        }
      }
    })

    //点击立即去玩
    $(".new-renwu-list").delegate(".new-renwu-zt.quwan", "click", (e)=>{
      console.log(e.target);
      var taskKey = e.target.getAttribute("data-key");
      var obj = TASK_LIST.find((value)=>{
        return value.taskKey == taskKey;
      })
      this.singleClk(obj.embed.per_task_button_click);
      setTimeout(() => {
        var url = obj.goToFinishUrl;
        window.location = url;
      }, 90);
    });

    //点击立即领取
    $(".new-renwu-list").delegate(".new-renwu-zt.lingqu", "click", (e)=>{
      console.log(e.target);
      var taskKey = e.target.getAttribute("data-key");
      $.get("/game/fishTask", {
        userId: CFG.consumerId,
        pageId: utils.getUrlParameter("id"),
        slotId: CFG.slotId,
        taskKey: taskKey,
        appKey: utils.getUrlParameter("appKey")
      }, (data)=>{
        //this.showQiandai(180);
        data = typeof data == "string" ? JSON.parse(data) : data;
        if(!data.success){
          this.showToast("领取失败，请稍后重试");
          return;
        }
        var temp = data.rewardWay;
        var obj = TASK_LIST.find((value)=>{
          return value.taskKey == taskKey;
        })
        // var num = obj.completedReward;
        var num = data.reward;
        obj.rewardStatus = 2;

        // this.singleExp(obj.embed.per_task_button_exposure);
        this.singleClk(obj.embed.per_task_button_click);

        if(temp.indexOf("0") !== -1){
          this.showCoin(parseInt(num));
          if(temp.indexOf("1") !== -1){
            setTimeout(() => {
              this.showQuan(data.gameHost, obj.gameId);
            }, 1500);
          }
        }
        if(temp == "2"){
          setTimeout(() => {
            var url = data.jumpLink;
            window.location = url;
          }, 90);
        }
        else if(temp == "3"){
          this.showQiandai(num);
        }

        this.updateComplete(e.target, data);
      })
      
    })

    $(".quan-close").unbind().click(()=>{
      this.singleClk(TASK_EMBED.close_advert_click);
      $(".quan").hide();
    })
    
  }

  //任务换成已完成
  updateComplete(div, data){
    this.initTask(true);
    /*
    var $div = $(div);
    $div.html("明天开启");
    $div.attr("class", "new-renwu-zt kaiqi");
    var $parent = $div.parents(".new-renwu-item");
    $parent.find(".new-renwu-top .new-renwu-size .new-red").html("X" + data.targetCompleted);
    $parent.find(".new-renwu-top .new-renwu-min").html(`<span class="new-red">0</span>/${data.targetCompleted}`);
    $parent.find(".new-renwu-bottom .new-red").html(data.completedReward);

    var aim = TASK_LIST.find((value, index)=>{
      return value.rewardStatus == 0;
    });

    if(aim){
      $(".new-renwu-ico").addClass("can-get");
    }
    else{
      $(".new-renwu-ico").removeClass("can-get");
    }
    */

  }


  //获取券广告
  getAds(host, gameId, callback){
    $.ajax({
        url: host + "/advert/getAdvert",
        type: 'GET',
        data: {
            sessionKey: CFG.usk,
            dsm: utils.getUrlParameter("dsm"),
            dcm: utils.getUrlParameter("dcm"),
            dpm: utils.getUrlParameter("dpm"),
            gameId: gameId,
            userId: CFG.consumerId,
            slotId: CFG.slotId,
            appKey: utils.getUrlParameter("appKey"),
            embedScenes: 2,
            pageId: utils.getUrlParameter("id")
        },
        timeout: 2400,
        dataType: 'json',
        success: function(data){
            callback && callback(data);
        },
        error: function(xhr){
            console.log(xhr);
            callback && callback({});
        }
    })
  }

  //显示广告券
  showQuan(host, gameId){
    this.getAds(host, gameId, (data)=>{
      console.log("请求券接口完成");
      var adsData = data.data;
      if(adsData && adsData.success){
          var adsEmbed = adsData.embed || adsData.advertEmbedBase;
          if(typeof adsEmbed == "string"){
            adsEmbed = JSON.parse(adsEmbed);
          }
          appendEmbed(adsEmbed);
          $(".quan-img").css("background-image", `url(${adsData.materialUrl})`);
          $(".quan-name").html(adsData.advertName);
          $(".quan").css("display", "flex");

          this.singleExp(TASK_EMBED.close_advert_exposure);
          this.singleExp(TASK_EMBED.advert_pic_exposure);
          this.singleExp(TASK_EMBED.advert_button_exposure);

          $(".quan-img").unbind().click(()=>{
            this.singleClk(TASK_EMBED.advert_pic_click);
            this.jumpLink(adsData);
          })

          $(".quan-btn").unbind().click(()=>{
            this.singleClk(TASK_EMBED.advert_button_click);
            this.jumpLink(adsData);
          })
      }
      else{
          
      }
    });
  }

  singleExp(data){
    var temp = typeof data == "string" ? data : JSON.stringify(data);
    window.DB.exposure.singleExp(temp);
  }

  singleClk(data){
    var temp = typeof data == "string" ? data : JSON.stringify(data);
    window.DB.exposure.singleClk({
      data: temp
    });
  }

  //跳转广告链接
  jumpLink(data){
    var link = data.clickUrl;
    if (data.customAd === false) {
        link = link + `&dpm=${utils.getUrlParameter("dpm")}&dcm=${utils.getUrlParameter("dcm")}&dsm=${utils.getUrlParameter("dsm")}`;
    }
    setTimeout(()=>{
        window.location = link;
    }, 120);
  }

  //显示金币动画
  showCoin(num){
    console.log("add : " + num);
    CFG.amount += num;
    CFG.rewardAmount = num;
    // TODO
    // this.showWelcomePop();
    new CoinPop({
      amountDiv: $('.new-money'),
      onClose: () => {
        this.showGesture();
      }
    }).show();
  }

  //初始化抓抓币素材
  initQiandai(){
    var jtemp = new Temp("qiandai-content");
    var html = jtemp.build({num: 0});
    $(".qiandai-content").html(html);
    canvas = document.getElementById("canvas");
    qiandai(lib, images, createjs);

    var manifest = [
      {src:"//yun.dui88.com/h5-mami/webgame/gameroom/v3.2/images/img_0.png", id:"img_0"},
      {src:"//yun.dui88.com/h5-mami/webgame/gameroom/v3.2/images/img_1.png", id:"img_1"},
      {src:"//yun.dui88.com/h5-mami/webgame/gameroom/v3.2/images/img_2.png", id:"img_2"}
    ];

    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest);

    function handleFileLoad(evt) {
      if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
    }

    function handleComplete() {
      console.log("complete load images");
    }

  }

  //显示获得抓抓币动画
  showQiandai(num){
    console.log("显示获得抓抓币动画");
    $(".qiandai-content .qd-add-num").html("+" + num);
    $(".qiandai-content .qd-add-word").html(`获得${num}抓抓币`);
    $(".qiandai-content").show().removeClass("fadeOut");

    exportRoot = new lib.qiandai();
    stage = new createjs.Stage(canvas);
    stage.addChild(exportRoot);
    stage.update();

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", stage);

    setTimeout(() => {
      $(".qiandai-content").addClass("fadeOut");
      setTimeout(() => {
        $(".qiandai-content").hide();
      }, 300);
    }, 4000);
  }
}

export default GameRoom;
