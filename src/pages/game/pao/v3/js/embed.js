function Embed() {
  this.data = null;
  this.rank = null;
  this.lottery = null;
}

Embed.TYPE_1 = "竞速模式按钮";
Embed.TYPE_2 = "无尽模式按钮";
Embed.TYPE_3 = "游戏介绍按钮";
Embed.TYPE_4 = "获得金币按钮";
Embed.TYPE_5 = "排行榜关闭按钮";
Embed.TYPE_6 = "排行榜出券";
Embed.TYPE_7 = "排行榜立即领取按钮";
Embed.TYPE_8 = "排行榜返回按钮";
Embed.TYPE_9 = "游戏规则关闭按钮";
Embed.TYPE_10 = "排行榜知道啦按钮";
Embed.TYPE_11 = "金币弹窗关闭按钮";
Embed.TYPE_12 = "金币弹窗获取金币按钮";
Embed.TYPE_13 = "首页排行榜按钮";
Embed.TYPE_14 = "首页排行榜关闭按钮";
Embed.TYPE_15 = "游戏规则按钮";
Embed.TYPE_16 = "福利按钮";


Embed.prototype.init = function (callback) {
  var $this = this;
  var param = {
    gameId: getParamUrl("id"),
    dsm: getParamUrl("dsm")
  }

  httpGet("/fish/getFishEmbed", param, function (data) {
    console.log(data);
    $this.data = data;
    callback && callback();
  })
}

Embed.prototype.singleExp = function (type) {
  if (!this.data) {
    console.log("没有埋点数据");
    return;
  }
  var item;
  switch (type) {
    case Embed.TYPE_1:
      item = this.data.st_info_exposure_race;
      break;
    case Embed.TYPE_2:
      item = this.data.st_info_exposure_endless;
      break;
    case Embed.TYPE_3:
      item = this.data.st_info_exposure_introduce;
      break;
    case Embed.TYPE_4:
      item = this.data.st_info_exposure_get;
      break;
    case Embed.TYPE_5:
      item = this.rank.st_info_exposure_close;
      break;
    case Embed.TYPE_6:
      item = this.rank.st_info_exposure_advert;
      break;
    case Embed.TYPE_7:
      item = this.rank.st_info_exposure_advert_button;
      break;
    case Embed.TYPE_8:
      item = this.rank.st_info_exposure_refresh_button;
      break;
    case Embed.TYPE_9:
      item = this.data.st_info_exposure_rule_close;
      break;
    case Embed.TYPE_10:
      item = this.rank.st_info_exposure_know_button;
      break;
    case Embed.TYPE_11:
      item = this.data.st_info_exposure_amount_close;
      break;
    case Embed.TYPE_12:
      item = this.data.st_info_exposure_get_amount;
      break;
    case Embed.TYPE_13:
      item = this.data.st_info_exposure_rank;
      break;
    case Embed.TYPE_14:
      item = this.data.st_info_exposure_rank_close;
      break;
    case Embed.TYPE_15:
      item = this.data.st_info_exposure_rule;
      break;
    case Embed.TYPE_16:
      item = this.data.st_info_exposure_duiba_shop;
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

Embed.prototype.singleClk = function (type) {
  if (!this.data) {
    console.log("没有埋点数据");
    return;
  }
  var item;
  switch (type) {
    case Embed.TYPE_1:
      item = this.data.st_info_click_race;
      break;
    case Embed.TYPE_2:
      item = this.data.st_info_click_endless;
      break;
    case Embed.TYPE_3:
      item = this.data.st_info_click_introduce;
      break;
    case Embed.TYPE_4:
      item = this.data.st_info_click_get;
      break;
    case Embed.TYPE_5:
      item = this.rank.st_info_click_close;
      break;
    case Embed.TYPE_6:
      item = this.rank.st_info_click_advert;
      break;
    case Embed.TYPE_7:
      item = this.rank.st_info_click_advert_button;
      break;
    case Embed.TYPE_8:
      item = this.rank.st_info_click_refresh_button;
      break;
    case Embed.TYPE_9:
      item = this.data.st_info_click_rule_close;
      break;
    case Embed.TYPE_10:
      item = this.rank.st_info_click_know_button;
      break;
    case Embed.TYPE_11:
      item = this.data.st_info_click_amount_close;
      break;
    case Embed.TYPE_12:
      item = this.data.st_info_click_get_amount;
      break;
    case Embed.TYPE_13:
      item = this.data.st_info_click_rank;
      break;
    case Embed.TYPE_14:
      item = this.data.st_info_click_rank_close;
      break;
    case Embed.TYPE_15:
      item = this.data.st_info_click_rule;
      break;
    case Embed.TYPE_16:
      item = this.data.st_info_click_duiba_shop;
      break;
    default:
      item = null;
      break;

  }
  // 埋点数据为对象格式，转换为json字符串
  if (item && typeof item === 'object') {
    item = JSON.stringify(item);
  }
  window.DB.exposure.singleClk({data:item});
}



/**
 * 追加埋点
 * @param {埋点数据} obj
 */
Embed.prototype.append = function (obj) {
  for (var i in obj) {
    if (obj[i]) {
      this.data[i] = obj[i];
    }
  }
  console.warn("append");
}

/**
 * 发送普通数据点击埋点
 * @param {埋点数据，字符串或json都可} item
 */
Embed.prototype.embedClick = function (item) {
  if (item && typeof item === 'object') {
    item = JSON.stringify(item);
  }
  window.DB.exposure.singleClk({data: item});
}

/**
* 发送普通数据曝光埋点
* @param {埋点数据，字符串或json都可} item
*/
Embed.prototype.embedExport = function (item) {
  if (item && typeof item === 'object') {
    item = JSON.stringify(item);
  }
  window.DB.exposure.singleExp(item);
}

/**
* 根据编号发送点击埋点
* @param {埋点编号} dpm 后两位
* @param {埋点编号} dcm 后两位
*/
Embed.prototype.numClick = function (dpm, dcm) {
  var data = this.data;
  var dpmReg = new RegExp("\\." + dpm.split(".").join("\\.") + "$");
  var dcmReg = dcm ? new RegExp("\\." + dpm.split(".").join("\\.") + "$") : null;
  for (var i in data) {
    var d = data[i];

    if (dpmReg.test(d.dpm)) {
      var aim = false;
      if (dcmReg) {
        if (dcmReg.test(d.dcm)) {
          aim = true;
        }
      } else {
        aim = true;
      }
      if (aim) {
        if (i.indexOf("click") !== -1) {
          this.embedClick(d);
          break;
        }
      }
    }

  }
}

/**
* 根据编号发送曝光埋点
* @param {埋点编号} dpm 后两位
* @param {埋点编号} dcm 后两位
*/
Embed.prototype.numExport = function (dpm, dcm) {
  var data = this.data;
  var dpmReg = new RegExp("\\." + dpm.split(".").join("\\.") + "$");
  var dcmReg = dcm ? new RegExp("\\." + dpm.split(".").join("\\.") + "$") : null;
  for (var i in data) {
    var d = data[i];

    if (dpmReg.test(d.dpm)) {
      var aim = false;
      if (dcmReg) {
        if (dcmReg.test(d.dcm)) {
          aim = true;
        }
      } else {
        aim = true;
      }
      if (aim) {
        if (i.indexOf("exposure") !== -1) {
          this.embedExport(d);
          break;
        }
      }
    }
  }
}