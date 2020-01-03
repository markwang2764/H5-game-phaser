/**
 * @desc:
 * @author : Dec-F
 * @Date : 2018-07-31 15:13:36
 * @Last Modified by: Dec-F
 * @Last Modified time: 2018-08-07 22:46:24
 */

/**
 * wxShare(opts) 
 * 
 * opts:{
 *    url:'' //当前页面url（不带hash）
 *    wxShareTitle: ‘’,   //标题
        wxShareSubTitle:‘’, // 副标题
        shareUrl: {//分享出去的url
          circle:'' //朋友圈
          friends:''  //好友
        },       
        wxShareImg: ‘’      //图片,
        success:function(res) {  //成功的回调   res.type=1:分享好友成功 =2 分享朋友圈成功
          
        }
 * }
 *
 *
 */
import axios from 'axios';
const getUrlParameter = (name, path = window.location.href) => {
  const result =
    decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(path) || [undefined, ''])[1].replace(/\+/g, '%20')) || null;
  return result ? result.split('/')[0] : '';
};
const getWxConfig = url =>
  axios.get('/youtui/context/getWxConfig', {
    params: {
      sessionKey: getUrlParameter('sessionKey'),
      sourceToken: getUrlParameter('sourceToken'),
      url: url
    }
  });
export const wxShare = opts => {
  // 微信url不能包含#hash后面部分
  getWxConfig(opts.url)
    .then(res => {
     
      res = res.data.data;
      console.log(opts,'===>opt',res);
      wx.config({
        debug: false,
        appId: res.appId,
        timestamp: res.timeStamp,
        nonceStr: res.nonceStr,
        signature: res.signature,
        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ']
      });
      wx.ready(function() {
        let shareData = {
          title: opts.wxShareTitle,
          desc: opts.wxShareSubTitle,
          //                link: '//' + window.location.host + '/youtui/consumer/share?id=30&type=2&sourceToken=&sessionKey=&pageShareType=3',

          // 必须带上协议，否则微信无法识别
          imgUrl: opts.wxShareImg
        };

        let friendsShareData = Object.assign({}, shareData, {
          link: opts.shareUrl.friends,
          success: function() {
            try {
              opts.success({
                type: 1
              });
            } catch (err) {}
          }
        });
        let circleShareData = Object.assign({}, shareData, {
          link: opts.shareUrl.circle,
          success: function() {
            try {
              opts.success({
                type: 2
              });
            } catch (err) {}
          }
        });
        // 分享给朋友
        console.log(friendsShareData,circleShareData,'=====>sharedata');
        wx.onMenuShareAppMessage(friendsShareData);
        // 分享到朋友圈
        wx.onMenuShareTimeline(circleShareData);
        wx.onMenuShareQQ(shareData);
        // wx.hideOptionMenu();/***隐藏分享菜单****/
        wx.error(function(res) {
          alert(JSON.stringify(res));
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      });
    })
    .catch(err => {
      console.log('transferToAccount error');
    });
};
