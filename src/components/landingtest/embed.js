class Embed {
  constructor(baseEmbed) {
    this.baseEmbed = baseEmbed;
  }

  toJson(item) {
    // 埋点数据为对象格式，转换为json字符串
    if (item && typeof item === "object") {
      item = JSON.stringify(item);
    }
    return item;
  }
  toObject(item) {
    if (item && typeof item === "string") {
      item = JSON.parse(item);
    }
    return item;
  }

  singleClk(type, cb, params) {
    console.log(type);
    if (!this.baseEmbed) {
      console.log("没有埋点基础数据");
      return;
    }
    var item;
    let _type;
    switch (type) {
      case Embed.TYPE_10:
        _type = 10;
        break;

      case Embed.TYPE_901:
        _type = 901;
        break;

      case Embed.TYPE_902:
        _type = 902;
        break;

      case Embed.TYPE_903:
        _type = 903;
        break;

      case Embed.TYPE_904:
        _type = 904;
        break;
      default:
        _type = -1;
        break;
    }
    item = this.toObject(this.baseEmbed);
    item = Object.assign({}, item, { type: _type }, params);
    item = this.toJson(item);
    window.DB.exposure.singleClk({ data: item, callback: cb });
  }
}

Embed.TYPE_10 = Embed.prototype.TYPE_10 = "点击下载趣晒调起浏览器";
Embed.TYPE_901 = Embed.prototype.TYPE_901 = "进入下载落地页";
Embed.TYPE_902 = Embed.prototype.TYPE_902 = "点击下载落地页按钮";
Embed.TYPE_903 = Embed.prototype.TYPE_903 = "进入蒙层";
Embed.TYPE_904 = Embed.prototype.TYPE_904 = "蒙层点击复制按钮";

export default Embed;
