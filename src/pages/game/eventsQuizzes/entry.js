// 赛事竞猜
import './entry.less';
import '@lib/swiper/4.0.0/index.less';
import $ from '@js/base';
import '@lib/zepto-animate/1.0.0/index';
import Main from './components/main';
import {getUrlParameter, httpGet} from '@js/utils';
import Promise from 'promise-polyfill';

window.embedData = {};
window.CREATE = window.CREATE || {};
window.CREATE.balance = CFG.balance || 0;

$(function () {

  /**
   * 获取埋点数据
   */
  const getEmbed = () => {
    return new Promise((resolve, reject) => {
      httpGet({
        url: '/hotGuess/getEmbed',
        data: {
          sessionKey: CFG.sessionKey,
          dsm: getUrlParameter('dsm'),
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
  };

  /**
   * 新人赠送
   * @returns {Promise}
   */
  const getPrize = ()=>{
    return new Promise((resolve, reject) => {
      httpGet({
        url: '/puzzle/getPrize',
        data: {
          sessionKey: CFG.sessionKey,
          dsm: getUrlParameter('dsm'),
          gameId: getUrlParameter('id'),
          pageId: getUrlParameter('pageId')
        },
        success: (data) => {
          // "data": {
          //   "amount": 0,
          //     "embed": {},
          //   "firstLogin": 0,
          //     "headUrl": "string",
          //     "nickName": "string",
          //     "rewardAmount": 0,
          //     "sex": 0
          // },
          resolve(data);
        },
        error: (err) => {
          reject(err);
        }
      })
    });
  };

  getEmbed().then((data) => {
    embedData = data.data;
  }).catch((err)=>{
    console.error(err);
  });

  getPrize().then((data)=> {
    console.log('getPrize success');
    // 刷新CFG余额
    window.CREATE.balance = data.data.amount || 0;
  }).catch((err)=>{
    console.error(err);
  });

  let main = new Main();

});
