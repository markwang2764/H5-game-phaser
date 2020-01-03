import * as utils from '@js/utils';
// 游戏页面的弹层逻辑
function showPop (popUserReward) {
  const id = getParamUrl('id');
  const key = 'ta-game-' + id;
  const towId = getParamUrl('towId');

  // 普通用户
  if (CFG.firstLogin == 0) {
    let cache = JSON.parse(utils.getStorage(key)) || {};
    if (!cache) {
      // popUserReward && popUserReward();
    } else if (cache && cache.towId !== towId) {
      // popUserReward && popUserReward();
    }

    cache.today = getTodayFull();
    cache.towId = towId || '';
    utils.setStorage(key, JSON.stringify(cache));
  }
  // 新用户
  else if (CFG.firstLogin == 1) {
    CFG.nick_name = CFG.nickName;
    CFG.userHeader = CFG.headUrl;
    CFG.rewardMoney = CFG.rewardAmount;
    popUserReward && popUserReward();

    let cache = {};
    cache.today = getTodayFull();
    cache.towId = towId || '';
    utils.setStorage(key, JSON.stringify(cache));
  }
  // 老用户今日第一次访问
  else if (CFG.firstLogin == 2) {
    let cache = JSON.parse(utils.getStorage(key)) || {};

    if (!cache || cache.towId !== towId) {
      // popUserReward && popUserReward();
      cache.today = getTodayFull();
      cache.towId = towId || '';
      utils.setStorage(key, JSON.stringify(cache));
    }
  }

  // 获取日期
  function getTodayFull () {
    const now = new Date();

    return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  }

  // 获取url参数
  function getParamUrl (name, path) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return null;
    }
  }
}

// 游戏页面的弹层逻辑
function showGamePop (popUserReward) {
  const id = getParamUrl('id');
  const key = 'ta-game-' + id;
  const towId = getParamUrl('towId');
  // 游戏大厅进入游戏，没有弹层
  if (!towId) return;
  // 普通用户
  if (CFG.firstLogin == 0) {
    let cache = JSON.parse(utils.getStorage(key));
    if (!cache) {
      popUserReward && popUserReward();
    } else if (cache && cache.towId !== towId) {
      popUserReward && popUserReward();
    }
    cache.today = getTodayFull();
    cache.towId = towId || '';
    utils.setStorage(key, JSON.stringify(cache));
  }
  // 新用户
  else if (CFG.firstLogin == 1) {
    CFG.nick_name = CFG.nickName;
    CFG.userHeader = CFG.headUrl;
    CFG.rewardMoney = CFG.rewardAmount;
    popUserReward && popUserReward();

    let cache = {};
    cache.today = getTodayFull();
    cache.towId = towId || '';
    utils.setStorage(key, JSON.stringify(cache));
  }
  // 老用户今日第一次访问
  else if (CFG.firstLogin == 2) {
    let cache = JSON.parse(utils.getStorage(key));

    if (!cache || cache.towId !== towId) {
      popUserReward && popUserReward();
      cache.today = getTodayFull();
      cache.towId = towId || '';
      utils.setStorage(key, JSON.stringify(cache));
    }
  }
  // 获取日期
  function getTodayFull () {
    const now = new Date();

    return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  }

  // 获取url参数
  function getParamUrl (name, path) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return null;
    }
  }
}

module.exports = {
  showPop,
  showGamePop
};
