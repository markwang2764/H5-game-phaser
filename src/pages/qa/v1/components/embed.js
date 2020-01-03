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
   console.log('friendsArticle embed init');

  }

  update(newData) {
    this.data = Object.assign({}, this.data, newData);
  }

  singleExp(type) {
    if (!this.data) {
      console.log('没有埋点数据');
      return;
    }
    var item;
    switch (type) {
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
  toObject(item) {
    if (item && typeof item === 'string') {
      item = JSON.parse(item);
    }
    return item;
  }

  singleClk(type, cb , params) {
    console.log(type)

    if (!this.data) {
      console.log('没有埋点数据');
      return;
    }
    var item;
    switch (type) {
      case Embed.TYPE_1:
        item = this.data.st_info_success_click;
        break;
      case Embed.TYPE_2:
        item = this.data.st_info_me_click;
        break;
      case Embed.TYPE_3:
        item = this.data.st_info_start_click;
        break;
      case Embed.TYPE_4:
        item = this.data.st_info_end_click;
        break;
      case Embed.TYPE_5:
        item = this.data.st_info_end_done;
        break;
      case Embed.TYPE_6:
        item = this.data.st_info_down_click;
        break;
      case Embed.TYPE_7:
        item = this.data.st_info_unlock_click;
        break;
      case Embed.TYPE_8:
        item = this.data.st_info_result_click;
        break;
      case Embed.TYPE_9:
        item = this.data.st_info_request_click;
        break;
      case Embed.TYPE_10:
        item = this.data.st_info_unlock2_click;
        break;

      case Embed.TYPE_12:
        item = this.data.st_info_down2_click;
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

Embed.TYPE_1 = Embed.prototype.TYPE_1 = '分享成功';
Embed.TYPE_2 = Embed.prototype.TYPE_2 = '点击我也要测';
Embed.TYPE_3 = Embed.prototype.TYPE_3 = '开始测';
Embed.TYPE_4 = Embed.prototype.TYPE_4 = '测试题目完成情况'; // q_no
// Embed.TYPE_5 = '完成测试';
Embed.TYPE_6 = Embed.prototype.TYPE_6 = '安卓点击下载趣晒';
// Embed.TYPE_7 = '帮助好友解锁';
Embed.TYPE_8 = Embed.prototype.TYPE_8 = '进入结果页';
Embed.TYPE_9 = Embed.prototype.TYPE_9 = '邀请好友解锁'; // share_way
Embed.TYPE_10 = Embed.prototype.TYPE_10 = '结果页邀请好友来解锁';
Embed.TYPE_12 = Embed.prototype.TYPE_12 = '进入下载页';

export default Embed;
