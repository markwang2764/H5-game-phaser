/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */

class Embed {
  constructor() {
    this.data = null;
  }

  init() {
    let embed = CFG.embed;
    // 20180524发布兼容
    if (typeof embed === 'string') {
      embed = JSON.parse(embed);
    }
    this.data = embed;
    // this.data = CFG.embed;

    // 拼接埋点
    let baseExposure = JSON.parse(this.toJson(this.data.st_info_exposure_new_one_3_close));
    let baseClick = JSON.parse(this.toJson(this.data.st_info_click_new_one_3_close));
    let new_one_3_auto_close_dpm = {
      dpm: baseExposure.dpm.split('.').splice(0, 3).join('.') + '.3'
    };

    let start_game_dpm = {
      dpm: baseExposure.dpm.split('.').splice(0, 2).join('.') + '.4.4'
    };

    this.data.st_info_exposure_new_one_3_auto_close = $.extend(true, {}, baseExposure, new_one_3_auto_close_dpm);
    this.data.st_info_click_new_one_3_auto_close = $.extend(true, {}, baseClick, new_one_3_auto_close_dpm);

    this.data.st_info_exposure_start_game = $.extend(true, {}, baseExposure, start_game_dpm);
    this.data.st_info_click_start_game = $.extend(true, {}, baseClick, start_game_dpm);

  }

  singleExp(type) {
    if (!this.data) {
      console.log('没有埋点数据');
      return;
    }
    var item;
    switch (type) {
      case Embed.TYPE_1:
        item = this.data.st_info_exposure_new_one_close;
        break;
      case Embed.TYPE_2:
        item = this.data.st_info_exposure_new_one_public;
        break;
      case Embed.TYPE_3:
        item = this.data.st_info_exposure_new_one_start;
        break;
      case Embed.TYPE_4:
        item = this.data.st_info_exposure_new_one_auto_close;
        break;
      case Embed.TYPE_5:
        item = this.data.st_info_exposure_no_window_public;
        break;
      case Embed.TYPE_6:
        item = this.data.st_info_exposure_new_one_3_close;
        break;
      case Embed.TYPE_7:
        item = this.data.st_info_exposure_new_one_3_start;
        break;
      case Embed.TYPE_8:
        item = this.data.st_info_exposure_new_one_3_auto_close;
        break;
      case Embed.TYPE_9:
        item = this.data.st_info_exposure_start_game;
        break;
      default:
        item = null;
        break;
    }

    item = this.toJson(item);
    window.DB.exposure.singleExp(item);
  }

  toJson(item) {
    // 埋点数据为对象格式，转换为json字符串
    if (item && typeof item === 'object') {
      item = JSON.stringify(item);
    }
    return item;
  }

  singleClk(type, cb) {
    if (!this.data) {
      console.log('没有埋点数据');
      return;
    }
    var item;
    switch (type) {
      case Embed.TYPE_1:
        item = this.data.st_info_click_new_one_close;
        break;
      case Embed.TYPE_2:
        item = this.data.st_info_click_new_one_public;
        break;
      case Embed.TYPE_3:
        item = this.data.st_info_click_new_one_start;
        break;
      case Embed.TYPE_4:
        item = this.data.st_info_click_new_one_auto_close;
        break;
      case Embed.TYPE_5:
        item = this.data.st_info_click_no_window_public;
        break;
      case Embed.TYPE_6:
        item = this.data.st_info_click_new_one_3_close;
        break;
      case Embed.TYPE_7:
        item = this.data.st_info_click_new_one_3_start;
        break;
      case Embed.TYPE_8:
        item = this.data.st_info_click_new_one_3_auto_close;
        break;
      case Embed.TYPE_9:
        item = this.data.st_info_click_start_game;
        break;
      default:
        item = null;
        break;
    }

    item = this.toJson(item);
    window.DB.exposure.singleClk({data: item, callback: cb});
  }
}

Embed.TYPE_1 = '新人弹层关闭按钮';
Embed.TYPE_2 = '新人弹层公告';
Embed.TYPE_3 = '新人弹层立即开玩';
Embed.TYPE_4 = '新人弹层自动关闭按钮';
Embed.TYPE_5 = '新人弹层无弹窗版公告';
Embed.TYPE_6 = '新人弹层3.0关闭';
Embed.TYPE_7 = '新人弹层3.0开始';
Embed.TYPE_8 = '新人弹层3.1自动跳转';
Embed.TYPE_9 = '新人弹层3.3.1开始游戏';

export default Embed;
