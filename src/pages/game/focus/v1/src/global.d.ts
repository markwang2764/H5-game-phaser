declare module Global {
    /**标识是否点击过“PK”按钮 */
    var startPk: boolean;
    /**标识当前游戏模式是：1-PK，2-闯关 */
    var gameMode: number;
    /**
     * 1 关卡页面
     * 2 挑战失败页面-不服再战
     * 3 结果页面-再来一次
     * 4 挑战页面-PK
     * 5 排行榜-好友榜PK
     * 6 排行榜-全球榜PK
     * 7 排行榜-个人记录
     */
    var enterPlaySource: number;
}