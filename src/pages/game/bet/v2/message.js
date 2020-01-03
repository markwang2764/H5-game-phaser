var MsgId = {
  // 开奖
  lottery: 1,

  // 下注
  bet: 2,

  // 猫背光展示完毕
  catShowOver: 3,

  // 开奖信息提示
  tipBubble: 4,

  // 更新账户余额
  updateMoney: 5,

  // 游戏正式开始
  readyStart: 6,

  // 设置账户余额
  setMoney: 7,

  // 加载完成
  loaded: 8,

  // 押注请求
  betReq: 100,

  // 玩家角色请求
  enterReq: 105,

  // 押注响应
  betRsp: 200,

  // 开奖结果请求
  lotteryReq: 101,

  // 开奖响应
  lotteryRsp: 201,

  // 救济金请求
  almsReq: 102,

  // 救济金响应
  almsRsp: 202,

  // 领取救济金请求
  getAlmsReq: 109,

  // 领取救济金响应
  getAlmsRsp: 209,

  // 券请求
  advertReq: 103,

  // 券响应
  advetrRsp: 203,

  // 往期结果
  pastResultRsp: 204,

  // 玩家进入响应
  enterRsp: 205,

  // 玩家离开响应
  leaveRsp: 206,

  // 添加玩家请求
  addPlayerReq: 107,

  // 添加玩家响应
  addPlayerRsp: 207,

  // 押注失败（超过每日上限）
  betLimitRsp: 2001,

  // 押注失败（余额不足）
  betLowRsp: 2002,

  // 押注失败（开奖状态）
  betStatusRsp: 2003,

  // 押注失败（系统异常）
  betErrorRsp: 2004,

  // 游戏状态请求
  startReq: 108,

  // 游戏状态响应
  startRsp: 208

};

window.BT.MsgId = MsgId;

export default MsgId;
