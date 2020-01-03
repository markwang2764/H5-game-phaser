/**
 * @note    积分兑换埋点
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-18
 * @des
 */

class Embed {
  constructor() {
    this.data = null;
  }

  init(embed) {
    // 20180524发布兼容
    if (typeof embed === 'string') {
      embed = JSON.parse(embed);
    }
    this.data = embed;
    // this.data = embed || {};
  }

  singleExp(type) {
    if (!this.data) {
      console.log('没有埋点数据');
      return;
    }
    let item;
    switch (type) {
      case Embed.TYPE_1:
        item = this.data.st_info_love_money_exposure;
        break;
      case Embed.TYPE_2:
        item = this.data.st_info_love_credits_exposure;
        break;
      case Embed.TYPE_3:
        item = this.data.st_info_sure_money_exposure;
        break;
      case Embed.TYPE_4:
        item = this.data.st_info_sure_credits_exposure;
        break;
      case Embed.TYPE_5:
        item = this.data.st_info_close_credits_exposure;
        break;
      case Embed.TYPE_6:
        item = this.data.st_info_exchange_gold_exposure;
        break;
      case Embed.TYPE_7:
        item = this.data.st_info_exchange_integral_exposure;
        break;
      default:
        item = null;
        break;
    }

    // 埋点数据为对象格式，转换为json字符串
    if (item && typeof item === 'object') {
      item = JSON.stringify(item);
    }
    window.DB.exposure.singleExp(item);
  }

  singleClk(type, cb) {
    if (!this.data) {
      console.log('没有埋点数据');
      return;
    }
    let item;
    switch (type) {
      case Embed.TYPE_1:
        item = this.data.st_info_love_money_click;
        break;
      case Embed.TYPE_2:
        item = this.data.st_info_love_credits_click;
        break;
      case Embed.TYPE_3:
        item = this.data.st_info_sure_money_click;
        break;
      case Embed.TYPE_4:
        item = this.data.st_info_sure_credits_click;
        break;
      case Embed.TYPE_5:
        item = this.data.st_info_close_credits_click;
        break;
      case Embed.TYPE_6:
        item = this.data.st_info_exchange_gold_click;
        break;
      case Embed.TYPE_7:
        item = this.data.st_info_exchange_integral_click;
        break;
      default:
        item = null;
        break;
    }
    // 埋点数据为对象格式，转换为json字符串
    if (item && typeof item === 'object') {
      item = JSON.stringify(item);
    }
    window.DB.exposure.singleClk({data: item, callback: cb});
  }
}

Embed.TYPE_1 = '我要金币TAB';
Embed.TYPE_2 = '我要积分TAB';
Embed.TYPE_3 = '金币界面确认兑换';
Embed.TYPE_4 = '积分界面确认兑换';
Embed.TYPE_5 = '兑换弹层关闭按钮';
Embed.TYPE_6 = '第三方全部兑换金币';
Embed.TYPE_7 = '全部兑换第三方积分';

export default Embed;
