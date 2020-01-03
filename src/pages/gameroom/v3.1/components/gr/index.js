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
import WelcomePop from '../../../components/welpop/v3.1.2/index';
import toast from '@components/toast/1.0.0/index';

const Pop = require('../../../components/showPop');
const IScroll = require('@lib/iscroll-probe/5.2.0/index');

const STORAGE_START_IDX = 'start_idx';

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
    $('body,html').animate({scrollTop: '0px'}, 600);
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
    switch (hash) {
      case '':
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
}

export default GameRoom;
