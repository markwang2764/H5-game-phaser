/**
 * @note   新的三端通信
 * @author 康旭峰
 * @email  kangxufeng@duiba.com.cn
 * @create 2018-05-22
 */
import { getUrlParameter, httpGetPromise, formatUrl } from '@common/js/utils';
import Promise from 'promise-polyfill';

require('./tmjssdk');
const jsBridge = window.TMJSBridge;

const bridge = Object.assign({}, jsBridge, {
  /**
   * 端内h5分享
   * @param params {
   * shareType：0：// 弹窗不带预览 1：弹窗带预览 2：直接分享
   * needDraw：0：不画 1：画
   * channel：参考下文channel 分享渠道
   * imgUrl: 分享的图片
   * desc: 描述
   * shareUrl:分享链接
   * title:标题
   * qRCodePoint: 二维码坐标 
   * {
  *   "height": 10,
      "leftTopX": 10,
      "leftTopY": 10,
      "width": 10
   * }
   */

  h5Share: function({ shareType = 1, needDraw = 0, channel = 2, imgUrl, desc,shareUrl,title, 
    qRCodePoint, id, urlParams = {} , callback = () => {}}) {
    console.log('h5Share');
    // 获取后台配置的分享信息,获取成功后再调起app分享
    getAppShareInfo({ id })
      .then(shareData => {
        console.log('start share');
        let params = { shareType, needDraw, channel };
        // shareContentType 0: 链接 1:图片
        if (shareData.shareContentType === 1) {
          if (imgUrl) {
            params.imgUrl = imgUrl;
          } else {
            console.log('使用默认大图');
          }
          if (qRCodePoint) {
            params.qRCodePoint = qRCodePoint;
          }
        } else {
          if (imgUrl) {
            params.imgUrl = imgUrl;
          }
          if (desc) {
            params.desc = desc;
          }
          if (shareUrl) {
            params.shareUrl = shareUrl;
          }
          if (title) {
            params.title = title;
          }
        }
       
        // 在分享出去的URL上拼接业务参数
        shareData.shareUrl = formatUrl(shareData.shareUrl, urlParams);

        let _params = Object.assign({}, shareData, params);
        console.log('do share');

        _params = { sharedata: JSON.stringify(_params) };
        console.log(_params);
        jsBridge.share(_params, callback);
      })
      .catch(err => {
        console.error(err);
      });
  },

  testShare: function(params, callback = () => {}) {
    console.log('testshare');
    jsBridge.share({ sharedata: JSON.stringify({}) }, callback);
  }
});

function transformShareData(origin) {
  let newData = {
      desc: origin.wxShareInfo || '',
      imgUrl: origin.wxShareImg || '',
      qRCodePoint: origin.qRCodePoint || {
        height: 10,
        leftTopX: 10,
        leftTopY: 10,
        width: 10
      },
      shareContentType: (origin.shareContentType === 0 ||  origin.shareContentType ===1) ? origin.shareContentType : '', 
      shareUrl: origin.shareUrl || '',
      title: origin.wxShareTitle || '',
      needDraw: 0,
      contentId: getUrlParameter('id'),
      contentType:getUrlParameter('type'),
      shareContentIndex: origin.shareContentIndex
  };
  return newData;
}

/**
 * 获取app分享信息
 */
function getAppShareInfo(params) {
  return new Promise((resolve, reject) => {
    httpGetPromise({
      url: '/youtui/content/share',
      data: {
        contentId: params.id || getUrlParameter('id'),
        contentType: getUrlParameter('type'),
        shareFrom: 1 // 固定为1 点击分享来源（0：app卡片；1：预览页）
      }
    })
      .then(result => {
        const { code, desc, data, success } = result;
        if (success && data) {
          let shareData = transformShareData(data);
          resolve(shareData);
        } else {
          console.error(desc);
          reject();
        }
      })
      .catch(err => {
        reject();
        console.error(err);
      });
  });
}

export default bridge;
