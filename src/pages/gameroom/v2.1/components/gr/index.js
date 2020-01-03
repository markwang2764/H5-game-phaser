/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-01
 * @des
 */
import * as utils from '@js/utils';
import tryInitNewWall from '../../../components/initNewWall/v1/index';
import EventEmitter from '../../../components/event-emitter/index';
import TongDun from '@components/tongdun/index';
import WelcomePop from '../../../components/welpop/v3.1.2/index';
import toast from '@components/toast/1.0.0/index';

const Pop = require('../../../components/showPop');

var showNum = 0;
var domAppend;
var playNum = '';
var RegionType = {
  /** 未知 */
  Seven: 7,
  /** 未知 */
  Eight: 8,
  /** 未知 */
  Nine: 9,
  /** 游戏入口图标 */
  Icon: 11,
  /** 浮标 */
  Banner: 12,
  /** 奖品展示 */
  Produce: 13
};
var html;

class GameRoom extends EventEmitter {
  constructor (options = {}) {
    super();

    this.prizeLog1 = {};
    this.prizeLog2 = {};
    this.prizeLog3 = {};
    this.prizeLog4 = {};
    this.duibaLog = {};
    this.totalPlayerNum = 0;
    this.cfg = options.cfg;

    // 用户信息
    this.userInfo = {
      amount: this.cfg.amount,
      headUrl: this.cfg.headUrl,
      nickName: this.cfg.nickName,
      sex: this.cfg.sex,
      userId: this.cfg.consumerId
    };
  }

  events () {
    let embed = this.cfg.embed;
    // 20180524发布兼容
    if (typeof embed === 'string') {
      embed = JSON.parse(embed);
    }

    // 用户头像修改功能
    $('.new-header').on('click', () => {
      toast.make({
        type: 'info',
        content: '修改昵称功能即将上线~'
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

  showWelcomePop () {
    this.tryPop();
  }

  // 获取曝光数据
  setWalletEmbed () {
    let _ = this;
    $.ajax({
      url: '/direct/getNewGameHallEmbed',
      type: 'get',
      dataType: 'json',
      data: {
        pageId: utils.getUrlParameter('id'),
        dsm: utils.getUrlParameter('dsm')
      }, // 现金钱包类型
      success: function success (result) {
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
      error: function error () {
        console.log('曝光失败');
      }
    }); // 获取余额，渲染至首页
  }

  // 展示弹层
  tryPop () {
    Pop.showPop(() => {
      new WelcomePop({
        amountDiv: $('.new-money')
      }).show();
    });
  }

  /**
   * 向全局CFG对象注入属性
   * @param {string} key 属性名
   * @param {Object} val 属性值
   */
  rejectCFG (key, val) {
    this.cfg[key] = val;
  }

  getDuibaUrl () {
    let _ = this;
    $.ajax({
      url: '/direct/getDuibaUrl',
      type: 'get',
      dataType: 'json',
      data: {
        balanceType: 2,
        pageId: utils.getUrlParameter('id')
      },
      success: function success (result) {
        window.DB.exposure.singleExp(_.duibaLog.st_info_exposure_btn_credit);

        $('#three a').click(function (e) {
          var data = $(this).parent().attr('db-click');
          window.DB.exposure.singleClk({
            data: data,
            callback: () => {
              window.location.href = result.data;
            }
          });
        });

        $('.thirteen-more').click(function () {
          window.location.href = result.data;
        });
      },
      error: function error () {
        console.log('获取链接失败');
      }
    });
  }

  wxShare () {
    /** *用于获得当前连接url用**/
    /** *用户点击分享到微信圈后加载接口接口*******/
    $.ajax({
      url: '//play.tacota.cn/wxLogin/share',
      dataType: 'json',
      type: 'get',
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
      error: function () {
        console.log('transferToAccount error');
      }
    });
  }

  init () {
    this.updateUserInfo();
    this.showWelcomePop();

    this.getBlock(); // 初始化区块
    if (utils.isWeiXin()) {
      this.wxShare();// 分享功能
    }
    this.setWalletEmbed(); // 初始化按钮曝光埋点数据
    this.events();
  }

  renderRegionType (type, typename) {
    for (var i = 0; i < type.blocks.length; i++) {
      if (typename == 'one') {
        domAppend = $('#one .container');
      } else {
        domAppend = $('#' + typename);
      }
      var t_blocks = type.blocks[i];
      html = `<li class="activity-li" db-exposure=${
        t_blocks.embedInfo.st_info_dpm_exposure
        } db-click=${t_blocks.embedInfo.st_info_dpm_click} data-block="${
        t_blocks.blockType
        }" data-blockName="${t_blocks.blockName}"> `;
      switch (type.regionType) {
        case RegionType.Eight:
        case RegionType.Nine:
          html += `<a data-href="${
            t_blocks.url
            }"><img class="activity-img" src= "${
            t_blocks.image
            }" alt= "" ><div class="activity-box"><span class="activity-title">${
            t_blocks.blockName
            }</span></div></a ></li >`;
          break;
        case RegionType.Seven:
          showNum = isNaN(parseInt(t_blocks.blockName * (Math.random() + 9)));
          if (!showNum) {
            html += `<a data-href="${
              t_blocks.url
              }"><img class="activity-img" src= "${
              t_blocks.image
              }" alt= "" ><div class="activity-box"><span class="activity-title">${utils.tostring(
              parseInt(t_blocks.blockName * (Math.random() * 0.1 + 0.9))
            )}</span></div></a ></li >`;
          } else {
            html += `<a data-href="${
              t_blocks.url
              }"><img class="activity-img" src= "${
              t_blocks.image
              }" alt= "" ></a ></li >`;
          }
          break;
        case RegionType.Icon:
          showNum = parseInt(t_blocks.blockName);
          if (!showNum) showNum = 10000;
          // showNum *= Math.random() * 0.1 + 0.9;
          this.totalPlayerNum += showNum;
          if (i == 0) {
            html += `<a data-href="${t_blocks.url}">
                  <img class="activity-img" src= "${t_blocks.image}" alt= "" >
                  <div class="activity-box">
                    <span class="activity-title">${utils.tostring(showNum) + '人在玩'}</span>
                  </div>
                  <div class="room-gesture"></div>
                </a >
              </li >`;
          } else {
            html +=
              `<a data-href="${t_blocks.url}">
                  <img class="activity-img" src= "${t_blocks.image}" alt= "" >
                  <div class="activity-box">
                    <span class="activity-title">${utils.tostring(showNum) + '人在玩'}</span>
                  </div>
                </a >
              </li >`;
          }
          break;
        case RegionType.Banner:
          break;
        case RegionType.Produce:
          html += `<a data-href="${
            t_blocks.url
            }"><img class="activity-img" src= "${
            t_blocks.image
            }"></a ></li >`;
          break;
        default:
          html = `${t_blocks.url}`;
      }
      domAppend.addClass('activity-' + this.getNumberWord(type.regionType));
      domAppend.append(html);
    }
  }

  getBlock () {
    var _url = '/direct/getDengqin';
    var ajaxData = {
      pageId: this.cfg.id,
      login: this.cfg.login,
      slotId: this.cfg.slotId,
      deviceId: this.cfg.deviceId,
      appKey: this.cfg.appKey,
      dpm: this.cfg.dpm,
      dsm: utils.getUrlParameter('dsm')
    };
    $.getJSON(_url, ajaxData, (result) => {
      if (result.success && result.data.region) {
        for (let i = 0; i < $('.content').length; i++) {
          var block_id = $('.content')[i].id;
          if (block_id) {
            result.data.region[$('#' + block_id).attr('data-name')] // 获取页面对应id的dataname,根据datananme获取数据
              ? this.renderRegionType(
                result.data.region[$('#' + block_id).attr('data-name')],
                block_id
              ) // 渲染数据
              : $(`[data-list=${block_id}]`)
                .data('hide', 'true')
                .hide(); // 没有对应数据隐藏区域
          }
        }
        let banner = result.data.region['banner'];
        if (banner && banner.blocks.length > 0) {
          let block = banner.blocks[0];

          window.DB && window.DB.exposure && window.DB.exposure.singleExp(block.embedInfo.st_info_dpm_exposure);
          $('.coin-work').show();
          $('.coin-work').attr('data-href', block.blockType === 7 ? '' : block.url);
          $('.coin-work')[0].style.backgroundImage = `url(${block.image})`;
          $('.coin-work').click(function (e) {
            window.DB && window.DB.exposure && window.DB.exposure.singleClk({
              data: block.embedInfo.st_info_dpm_click,
              callback: function () {
                if (block.blockType === 7) {
                  this.requestPlugin(block.blockName);
                } else {
                  window.location.href = block.url;
                }
              }
            });
          });
        }

        this.setClickArea();
        tryInitNewWall(this);
        window.DB && window.DB.exposure && window.DB.exposure.initLog();
      }
    });
  }

  // 设置中奖区域和区块点击
  setClickArea () {
    $('#one a,#two a').on('click', function () {
      var self = $(this);
      sessionStorage.setItem('key', true);
      var idx = self.data('index');
      if (idx == 1) {
        return;
      }
      window.location.href = self.data('href');
    });
  }

  /**
   * 查询指定数字对应的英文单词
   * @param {number} num 要查询的数字
   */
  getNumberWord (num) {
    var region_block = [
      'zero',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen'
    ];
    if (num < 0 || num >= region_block.length) return '';
    return region_block[num];
  }

  initCanvas () {
    creatCssPao();
    $('.item-3401959').click(function () {
      console.log(this);
      window.location.href = $('#one a').eq(0).attr('data-href');
    });
  }

  /**
   * 请求指定名字的插件
   * @param {string} secName 指定的插件名字
   */
  requestPlugin (secName) {
    window['EmbedPlugin']({
      section: secName,
      mainPageType: 3, // 固定的
      cacheKey: 'pa-adpages-gameroom',
      closeCB: () => {
      }
    });
  }

  updateUserInfo () {
    $('.new-money').text(this.userInfo.amount);
    $('.new-header')[0].style.backgroundImage = `url(${this.userInfo.headUrl})`;
    $('.new-nickname')[0].innerHTML = `<span class="nickname-txt">${this.userInfo.nickName}</span><div class="sex-ico"></div>`;
    this.setSex(this.userInfo.sex);
  }

  getUrlImage (imgNm) {
    return `url(//yun.tuisnake.com/h5-mami/adpages/gameroom/v1/${imgNm})`;
  }

  setSex (sex) {
    var arr = ['', 'boy', 'girl'];
    var colors = ['#ffffff', '#379fe1', '#ff6e9f'];
    if (sex) {
      $('.sex-ico')[0].style.backgroundImage = this.getUrlImage(arr[sex] + '-ico.png');
      $('.new-header')[0].style.backgroundColor = colors[sex];
    } else {
      $('.new-header')[0].style.backgroundColor = colors[0];
    }
  }

  getAnnouncement(cb) {
    utils.httpGet({
      url: '/direct/getAnnouncement',
      success: (rs) => {
        if (rs.success) {
          cb && cb(rs.data);
        } else {
          console.error('/direct/getAnnouncement failed');
        }
      }
    });
  }

}

export default GameRoom;
