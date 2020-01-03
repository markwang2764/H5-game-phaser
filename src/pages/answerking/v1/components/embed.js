/*
 * @Author: miaokefu@duiba.com.cn 
 * @Date: 2018-07-24 20:56:04 
 * @Last Modified by: miaokefu@duiba.com.cn
 * @Last Modified time: 2018-08-09 19:42:48
 */
import {getUrlParameter, parseUrlParams} from '@js/utils';

class Embed {
  constructor() {
    this.data = null;
  }

  init() {
    console.log('embed init');
  }

  update(newData) {
    this.data = Object.assign({}, this.data, newData);
  }

  toJson(item) {
    // 埋点数据为对象格式，转换为json字符串
    if (item && typeof item === 'object') {
      item = JSON.stringify(item);
    }
    return item;
  }
  toObject(item) {
    if (item && typeof item === 'string') {
      item = JSON.parse(item);
    }
    return item;
  }

  singleClk(type, cb, params) {
    console.log(type)

    if (!this.data) {
      console.log('没有埋点数据');
      return;
    }
    var item;
    switch (type) {
      case Embed.TYPE_1:
        item = this.data.st_info_1_click;
        break;
      case Embed.TYPE_2:
        item = this.data.st_info_2_click;
        break;
      case Embed.TYPE_3:
        item = this.data.st_info_3_click;
        break;
      case Embed.TYPE_4:
        item = this.data.st_info_4_click;
        break;
      case Embed.TYPE_5:
        item = this.data.st_info_5_click;
        break;
      case Embed.TYPE_6:
        item = this.data.st_info_6_click;
        break;
      case Embed.TYPE_7:
        item = this.data.st_info_7_click;
        break;
      case Embed.TYPE_301:
        item = this.data.st_info_301_click;
        break;
      case Embed.TYPE_9:
        item = this.data.st_info_9_click;
        break;
      case Embed.TYPE_10:
        item = this.data.st_info_10_click;
        break;

      case Embed.TYPE_15:
        item = this.data.st_info_15_click;
        break;

      case Embed.TYPE_801:
        item = this.data.st_info_801_click;
        break;

      case Embed.TYPE_901:
        item = this.data.st_info_901_click;
        break;

      case Embed.TYPE_902:
        item = this.data.st_info_902_click;
        break;

      case Embed.TYPE_903:
        item = this.data.st_info_903_click;
        break;

      case Embed.TYPE_904:
        item = this.data.st_info_904_click;
        break;
      default:
        item = null;
        break;
    }
    item = this.toObject(item);
    item = Object.assign({}, this.type1Click(item), params);
    item = this.toJson(item);
    window.DB.exposure.singleClk({ data: item, callback: cb });
  }

  /**
   * 页面访问 type=1 拼上url所有参数
   */
  type1Click(item) {
    if (item.type === 1) {
      return Object.assign({}, item, {urlQuery: JSON.stringify(parseUrlParams())});
    }
    return item;
  }
}


Embed.TYPE_1 = Embed.prototype.TYPE_1 = '进入答题主页好友助力复活页';
Embed.TYPE_2 = Embed.prototype.TYPE_2 = '点击开始答题我也要答题赢奖金';

Embed.TYPE_3 = Embed.prototype.TYPE_3 = '进入开始答题页';
Embed.TYPE_4 = Embed.prototype.TYPE_4 = '进入答题结果页';
Embed.TYPE_5 = Embed.prototype.TYPE_5 = '答错页按钮点击';
Embed.TYPE_6 = Embed.prototype.TYPE_6 = '进入提现弹层';
Embed.TYPE_7 = Embed.prototype.TYPE_7 = '提现弹层按钮点击';
Embed.TYPE_301 = Embed.prototype.TYPE_301 = '答题结果状态';
Embed.TYPE_9 = Embed.prototype.TYPE_9 = '点击提现';
Embed.TYPE_10 = Embed.prototype.TYPE_10 = '点击下载趣晒调起浏览器';

Embed.TYPE_15 = Embed.prototype.TYPE_15 = '端内访问';
Embed.TYPE_801 = Embed.prototype.TYPE_801 = '邀请分享成功';
Embed.TYPE_901 = Embed.prototype.TYPE_901 = '进入下载落地页';
Embed.TYPE_902 = Embed.prototype.TYPE_902 = '点击下载落地页按钮';
Embed.TYPE_903 = Embed.prototype.TYPE_903 = '进入蒙层';
Embed.TYPE_904 = Embed.prototype.TYPE_904 = '蒙层点击复制按钮';

export default Embed;
