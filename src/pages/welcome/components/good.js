function Good() {
  this.list = [
    {
      "name": "5元话费券",
      "coin": 55000
    },
    {
      "name": "10元京东券",
      "coin": 110000
    },
    {
      "name": "爱奇艺会员",
      "coin": 5500
    },
    {
      "name": "键鼠套装",
      "coin": 1290000
    },
    {
      "name": "优酷会员",
      "coin": 220000
    }
  ];
  this.list.sort(function (a, b) {
    return a.coin > b.coin;
  })
}

Good.prototype.getAim = function (num) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].coin > num) {
      return this.list[i];
    }
  }
  return null;
};

module.exports = Good