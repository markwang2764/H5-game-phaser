var NetMsgId = {
    
    //匹配请求
    matchReq: 101,
    
    //匹配响应,对手信息
    matchRsp: 201,
    
    //开始游戏请求
    startReq: 102,
    
    //开始游戏响应,服务器时间
    startRsp: 202,
    
    //扎心请求
    shootReq: 103,
    
    //扎心响应
    shootRsp: 203,
    
    //命中请求
    hitReq: 104,
    
    //命中针响应（失败）
    hitRsp: 204,
    
    //获取结果请求
    resultReq: 105,
    
    //获取结果响应
    resultRsp: 205,
    
    //再来一局请求
    playAgainReq: 106,
    
    //再来一局响应
    playAgainRsp: 206,
    
    //同意/拒绝 再战请求
    decideReq: 107,
    
    //同意/拒绝 再战响应
    decideRsp: 207,
    
    //玩家离开响应
    leaveRsp: 208,
    
    //心跳
    heartReq: 666,

    // 网络连接关闭
    netClose: 1,


    //再来一局
    playAgain: 11,

    //接受邀请再战
    playAgree: 12,

    //显示邀请弹层
    showInviteByGame: 14,

    //显示用户离开弹层
    showLeaveByGame: 15,

    //显示结果弹层
    showResultByGame: 16,

    //隐藏结果弹层
    hideResultByGame: 17,

    //换个对手
    matchAgain: 18,

}

export default NetMsgId;