/**
 * @note    停留时长统计
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-25
 * @des
 */
const uuidv4 = require('uuid/v4');
/**
 * 获取url中特定字符串的值
 * @param {*} name 字符串key
 * @param {*} path 默认为页面链接地址，也可自己传某段string
 */
const getUrlParameter = function (name, path = window.location.href) {
  const result = decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(path) || [undefined, ''])[1].replace(/\+/g, '%20')) || null;
  return result ? result.split('/')[0] : '';
};

const StayTime = function (options) {
  let _default = {
    interval: 10e3,
    type: 3,
    cfg: {}
  };
  options = $.extend(true, {}, _default, options);
  this.count = 0;
  this.timer = null;
  this.interval = options.interval ;
  this.running = true;
  this.type = options.type; // 请求类型 1 广告位点击 7 进入游戏大厅或者游戏 2 游戏大厅 3 游戏
  this.cfg = options.cfg;
  this.uuid = uuidv4();
  this.init();
};

// StayTime.PageType = {};
// StayTime.PageType.TYPE_MID = 1; // 中间页
// StayTime.PageType.TYPE_GAMEROOM = 2; // 游戏大厅
// StayTime.PageType.TYPE_GAME = 3; // 游戏
// StayTime.PageType.TYPE_BATTLE = 4; // 对战类游戏

StayTime.prototype.init = function () {
  $(window).on('beforeunload',  ()=>{
    // 不确定是否发送成功
    this.sendLog();
  })
};

StayTime.prototype.start = function () {
  this.stop();
  this.sendLog();
  this.running = true;
  this.timer = setInterval(() => {
    if (this.running) {
      this.sendLog();
    }
  }, this.interval);
};

StayTime.prototype.resume = function () {
  this.running = true;
};

StayTime.prototype.pause = function () {
  this.running = false;
};

StayTime.prototype.stop = function () {
  this.timer && clearInterval(this.timer);
};

/**
 * 发送停留日志
 */
StayTime.prototype.sendLog = function () {
  let _ = this;
  $.ajax({
    url: '/game/loginTime',
    type: 'get',
    dataType: 'json',
    data: {
      id: getUrlParameter('id'),
      dsm: getUrlParameter('dsm'),
      dcm: getUrlParameter('dcm'),
      dpm: getUrlParameter('dpm'),
      slotId: getUrlParameter('slotId') || _.cfg.slotId ,
      appId: getUrlParameter('appId') || _.cfg.appId,
      appKey: getUrlParameter('appKey') ,
      reqLocation: _.type,
      userId: _.cfg.consumerId || null,
      markId:_.uuid
    },
    success: function (result) {
      // console.log('send log success');
    },
    error: function (err) {
      console.log('send log error');
    }
  });
};



export default StayTime;