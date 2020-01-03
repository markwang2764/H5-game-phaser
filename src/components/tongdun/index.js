/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-06
 * @des
 */
import * as utils from '@js/utils';

class TongDun {
  constructor(options) {
    this.evtEmitter = options.evtEmitter;
    this.TONGDUN_INIT = 'tongdun-init';
    this.init();
  }

  init() {
    window._fmOpt = {
      partner: 'duiba',
      appName: 'tuia_h5',
      token: 'duiba' + "-" + new Date().getTime() + "-" + Math.random().toString(16).substr(2),
      fmb: true,
      getinfo: function () {
        return "e3Y6ICIyLjUuMCIsIG9zOiAid2ViIiwgczogMTk5LCBlOiAianMgbm90IGRvd25sb2FkIn0=";
      }
    };

    let cimg = new Image(1, 1);
    cimg.onload = function () {
      _fmOpt.imgLoaded = true;
    };
    cimg.src = "https://fp.fraudmetrix.cn/fp/clear.png?partnerCode=duiba&appName=tuia_h5&tokenId=" + _fmOpt.token;
    let fm = document.createElement('script');
    fm.type = 'text/javascript';
    fm.async = true;
    fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.fraudmetrix.cn/v2/fm.js?ver=0.1&t=' + (new Date().getTime() / 3600000).toFixed(0);
    let s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(fm, s);

    // 从js初始化到获取设备数据间隔时间过短，造成设备信息获取失败。切勿初始化之后立即获取设备信息。
    setTimeout(() => {
      this.userLogin();
    }, 500);

  }

  userLogin() {
    let _ = this;
    utils.httpPost({
      url: '/consumer/commonLogin2',
      data: {
        appKey: CFG.appKey || utils.getUrlParameter('appKey'),
        slotId: CFG.slotId || utils.getUrlParameter('slotId'),
        tokenId: _fmOpt.token
      },
      success: (data)=>{
        // 后端合并用户信息
        let {
          needUpdate,
        } = data;

        if (needUpdate) {
          // 更新用户信息
          // 数据绑定，修改大厅对应用户数据并且修改视图
          _.evtEmitter.trigger(_.TONGDUN_INIT, data);
        }
      }
    });
  }

}

export default TongDun;