var DataManager = function () {
  this.players = {};
  this.self = null;
  this.selfId = null;
  // 当前投注档位
  this.gear = null;
  // 是否可投注状态
  this.betEnable = true;
};

var p = DataManager.prototype;

p.load = function (players) {
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    this.players[p.usk] = p;
    if (p.usk === this.selfId) {
      this.self = p;
    }
  }
};

p.getUsers = function () {
  var users = [];
  for (var id in this.players) {
    if (!this.players.hasOwnProperty(id)) continue;
    users.push(this.players[id]);
  }
  return users;
};

export default DataManager;
