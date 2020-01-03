/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-09
 * @des
 */
import TimeList from './timelist';
import {embedClick, embedExposure, getAdvertClickUrl, getUrlParameter, httpGet} from '@js/utils.js';
import '@lib/swiper/4.0.0/index.js';
import Promise from 'promise-polyfill';
import GiftBox from './giftbox/index';
import Record from './record';

const ifvisible = require('ifvisible.js');
import toast from '@components/toast/1.0.0/index';
const PullToRefresh = require('@lib/pulltorefresh/1.0.0/index');

class Main {
  constructor() {
    this.swiperDefaultConifg = {
      startSlide: 0,
      speed: 400,
      auto: 2000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
    };

    this.pullToRefreshDefaultConifg = {
      instructionsPullToRefresh: '下拉加载更多',
      instructionsReleaseToRefresh: '松开后开始加载',
      instructionsRefreshing: '加载中',
      refreshTimeout: 500,
      iconArrow: '&#8675;',
    };

    this.IDLE_DURATION = 5; // 闲置时间
    this.giftShowed = false; // 礼盒是否显示过

    ifvisible.setIdleDuration(this.IDLE_DURATION);
    ifvisible.idle(() => {
      // This code will work when page goes into idle status
      if (!this.giftShowed) {
        this.giftBox = new GiftBox({});
        this.giftBox.show();
        this.giftShowed = true;
      }
    });
    this.bannerExposureIdxs = {};
    this.guessList = null; // 赛事竞猜数据
    this.current = 0; // 当前页数

    // 组件实例
    this.timeList = new TimeList({main: this});
    this.giftBox = null;
    this.record = null;

    this.init();
  }

  init() {
    this.record = new Record({});
    // 顶部券列表
    this.getAdvertList().then((data) => {
      console.log(data)
      data = data.data;

      console.log(data)
      if (!data || data.length === 0) {
        $('.top-coupon-container').hide();
      } else {
        this.createCouponDom(data);
        this.initSwiper(data);
        this.initCouponListEvents(data);
        this.onSwiperTransitionEnd(data, 0);
      }
    }).catch((err) => {
      console.error(err);
    });

    this.refreshList();
    this.initPullRefresh();

    this.events();
  }

  /**
   * 赔率变化时，刷新列表、余额
   */
  onOddsChange() {
    // 更新余额
    this.refreshList();
  }

  events() {

  }

  refreshList() {
    $('.time-list').html('');
    this.getTodayAfterList();
  }

  getTodayAfterList() {
    this.getDataList(getUrlParameter('id')).then((data) => {
      this.guessList = data.guessList;
      this.current = data.current;
      // 展示当天之后的所有数据
      this.timeList.addAfter(this.guessList.slice(this.current, this.guessList.length));
    }).catch((err) => {
      console.log(err);
    })
  }

  /**
   * 获取竞猜列表数据
   * @param gameId
   */
  getDataList(gameId) {
    return new Promise((resolve, reject) => {
      httpGet({
        url: '/hotGuess/getList',
        data: {gameId: gameId},
        success: (data) => {
          console.log('data success')
          if (data.success) {
            resolve(data.data);
          }
        },
        error: (err => {
          reject(err);
        })
      });
    });
  }

  /**
   * 获取券列表数据
   */
  getAdvertList() {
    return new Promise((resolve, reject) => {
      httpGet({
        url: '/advert/getCustomAdvert',
        data: {
          sessionKey: CFG.sessionKey,
          dsm: getUrlParameter('dsm'),
          dpm: getUrlParameter('dpm'),
          dcm: getUrlParameter('dcm'),
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

  initPullRefresh() {
    let ptr = PullToRefresh.init(Object.assign({
      mainElement: 'body',
      onRefresh: () => {
        this.current--;
        if (this.current < 0) {
          toast.make({
            type: 'info',
            content: '没有更多数据~'
          });
        } else {
          this.timeList.addBefore(this.guessList[this.current]);
        }
      }
    }, this.pullToRefreshDefaultConifg));
  }

  createCouponDom(data) {
    let $topCouponContainer = $('.top-coupon-container');
    let $swipeWrap = $topCouponContainer.find('.top-coupon-carousel .swipe-wrap');
    let $indicatorList = $topCouponContainer.find('.top-coupon-indicator .indicator-list');

    $swipeWrap.html('');
    $indicatorList.html('');

    if (!data || data.length === 0) {
      $topCouponContainer.hide();
    } else {
      $topCouponContainer.show();

      data.forEach((coupon, idx) => {
        let couponLi =
          `<div ><img class="top-coupon" src="${coupon.materialUrl}"></div>`;
        let indicatorLi =
          `<li class="indicator-item"></li>`;
        $swipeWrap.append(couponLi);
        $indicatorList.append(indicatorLi);
      })
    }
  }

  initCouponListEvents(data) {
    let $topCouponContainer = $('.top-coupon-container');
    $topCouponContainer.find('.top-coupon').on('click', (evt) => {
      let idx = $(evt.target).parent().index();

      // swiper bug
      if (data.length === 2) {
        if (idx === 2) {
          idx = 0;
        } else if (idx === 3) {
          idx = 1;
        }
      }

      embedClick(data[idx].advertEmbedBase.banner_adv_click, () => {
        location.href = getAdvertClickUrl(data[idx]);
      });
    });
  }

  updateIndicator(index) {
    let $topCouponContainer = $('.top-coupon-container');
    let $indicatorList = $topCouponContainer.find('.top-coupon-indicator .indicator-list');

    $indicatorList.find('.indicator-item').removeClass('selected').eq(index).addClass('selected');
  }

  onSwiperTransitionEnd(data, index) {
    if (data.length === 2) {
      if (index === 2) {
        index = 0;
      } else if (index === 3) {
        index = 1;
      }
    }
    if (!this.bannerExposureIdxs[index]) {
      embedExposure(data[index].advertEmbedBase.banner_adv_exposure);
      this.bannerExposureIdxs[index] = 1;
    }
    this.updateIndicator(index);
  }

  initSwiper(data) {
    // 当数据长度为2时循环存在bug，子元素长度会变为4项，导致数组超出
    Swipe(document.getElementById('couponList'), Object.assign({
      callback: (index, elem) => {
      },
      transitionEnd: (index, elem) => {
        this.onSwiperTransitionEnd(data, index);
      }
    }, this.swiperDefaultConifg));
  }


}

export default Main;