var CK = CK || {};

(function () {
	var NetMsgID = {
		//匹配用户请求
		match:101,

		//匹配用户响应（msg为对手对象json字符串）@see cn.com.duiba.panguweb.dto.rsp.UserMatchRsp
		matchRsp:201,

		//开始游戏请求（需要游戏双方都发送才算游戏开始）
		play:102,

		//开始游戏响应（通知前端）
		start:202,

		//用户点击事件请求
		click:103,

		//用户点击事件响应（小鸡起跳，包含小鸡的起跳Y轴位置）
		clickRsp:203,

		//用户射击请求
		shoot:104,

		//用户射击广播（服务端定时发送，包含子弹的Y轴坐标）
		shootRsp:204,

		//子弹道具通知
		bulletPropRsp:205,

		//命中子弹请求
		hitBulletProp:106,

		//命中子弹道具响应
		hitBulletPropRsp:206,

		//子弹碰撞通知
		hitBullet:207,

		//命中玩家请求
		hitPlayer:108,

		//子弹命中通知(命中玩家，剩余血量，当为0时判定输赢)
		hitPlayerRsp:208,

		//用户胜利通知
		win:209,

		//用户失败通知
		lose:210,

		//再来一局请求
		playAgain:111,

		//再来一局通知
		playAgainRsp:211,

		//同意再战请求
		agree:112,

		//同意再战通知
		agreeRsp:212,

		//玩家离开请求
		leave:113,

		//玩家离开响应
		leaveRsp:213,

		//平局响应
		draw: 214,

		//表情符号请求
		emoji: 115,
        
		//表情符号通知
        emojiRsp: 215,

        // 小鸡重生请求
        reborn: 116,

        //心跳消息
        heartBeat: 120,

        // 领取道具 请求
        rcvReq: 118,

        // 领取道具 响应
        rcvRsp: 218,

        // 再战一局（与原对手） 请求
        fakeMatchReq: 119,

        // 再战一局（与原对手） 响应
        fakeMatchRsp: 219,

        // 命中保护罩 响应
        hitCoverRsp: 217,

		// 使用道具信息 响应
		useItemRsp: 220,
		
		// 在线人数请求
		onlineNumReq: 121,

		// 在线人数响应
		onlineNumRsp: 221
	}

	CK.NetMsgID = NetMsgID;
})()