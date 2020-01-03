import './entry.less';
import './page/main/main.less';
import Text from './components/Text'
import * as mainf from './page/main/main'
import * as utils from '@js/utils';
import bridge from '@components/bridge/index'
import {
  isWeiXin,
  isAndroid,
  getUrlParameter,
  embed
} from './components/utils'
// var VConsole = require('vconsole/dist/vconsole.min');
// var vConsole = new VConsole();
$(function () {

  if (isWeiXin()) {
    $.ajax({
      url: `/youtui/context/getWxConfig`,
      data: {
        sessionKey: getUrlParameter('sessionKey'),
        sourceToken: getUrlParameter('sourceToken'),
        url: window.location.href.split('#')[0]
      },
      type: 'get',
      dataType: 'json',
      success: function success(res) {
        res = res.data
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
          NewText.wxReady();
          mainf.wxShare()
        })
      },
    })
  }

  const NewText = new Text();
    NewText.render();
    console.log(utils.getUrlParameter('appPreview'));
    
  if (utils.getUrlParameter('appPreview')) {
    mainf.embed(15, '端内');
    $('.small-bag').remove()
    $('.toshare-page').remove()
    $('.shared-page').remove()
    initApp()
    return
  }
  const urlQuery = JSON.stringify(utils.parseUrlParams())
  mainf.embed(1, '进入文章页面端外', {
    urlQuery: urlQuery
  });
  //模拟分享成功
  // $('.toshare-page .main .after .front .large').click(function (e) {
  //   alert('手动模拟分享成功')
  //   mainf.finishShare()
  //   e.stopPropagation()
  // })
  //调接口获取信息
  mainf.getInfo();
  //初始化
  mainf.init()

  //监听微信分享
  mainf.wxShare()
  //监听复制
  mainf.autoClip();
  mainf.clipCode();
});

function initApp() {
    $('.page .button').click(function () {
        bridge.h5Share({})
    })
}
