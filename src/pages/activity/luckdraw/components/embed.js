/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-09
 * @des
 */
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

  singleExp(type, params) {
    if (!this.data) {
      console.log('没有埋点数据');
      return;
    }
    var item;
    item = this.toObject(item);
    item = Object.assign({}, item,  params);
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
  toObject(item) {
    if (item && typeof item === 'string') {
      item = JSON.parse(item);
    }
    return item;
  }

  singleClk(type, params, cb) {
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
      case Embed.TYPE_301:
        item = this.data.st_info_301_click;
        break;
      case Embed.TYPE_5:
        item = this.data.st_info_5_done;
        break;
      case Embed.TYPE_9:
        item = this.data.st_info_9_click;
        break;
      case Embed.TYPE_904:
        item = this.data.st_info_904_click;
        break;
      case Embed.TYPE_10:
        item = this.data.st_info_10_click;
        break;
      case Embed.TYPE_15:
        item = this.data.st_info_15_click;
        break;
      case Embed.TYPE_1501:
        item = this.data.st_info_1501_click;
        break;
      case Embed.TYPE_4:
        item = this.data.st_info_4_click;
        break;
      default:
        item = null;
        break;
    }
    item = this.toObject(item);
    item = Object.assign({}, item,  params);
    item = this.toJson(item);
    window.DB.exposure.singleClk({data: item, callback: cb});
  }
}

Embed.TYPE_1 = Embed.prototype.TYPE_1 = '进入参与页面';
Embed.TYPE_2 = Embed.prototype.TYPE_2 = '点击"马上参与"';
Embed.TYPE_301 = Embed.prototype.TYPE_301 = '点击关闭弹窗'; // q_no
// Embed.TYPE_5 = '完成测试';
Embed.TYPE_4 = Embed.prototype.TYPE_4 = '进入开奖页';
// Embed.TYPE_7 = '帮助好友解锁';
Embed.TYPE_9 = Embed.prototype.TYPE_9 = '点击下载';
Embed.TYPE_904 = Embed.prototype.TYPE_904 = '蒙层点击复制按钮';
Embed.TYPE_10 = Embed.prototype.TYPE_10 = '点击下载趣晒调起浏览器';
Embed.TYPE_15 = Embed.prototype.TYPE_15 = 'app进入参与页面';
Embed.TYPE_1501 = Embed.prototype.TYPE_1501 = 'app点击"马上参与并分享"';

export default Embed;
