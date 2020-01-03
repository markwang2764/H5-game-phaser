/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:27:31 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-03-22 19:04:32
 * 游戏介绍弹窗
 */
function Rule(){
    this.$div = $(".rule-mask");
    this.init();
}

Rule.prototype.init = function(){
    //游戏介绍
    $(".item-1847430").click(()=>{
        embed.singleClk("gameRuleClick");
        this.$div.show();
    })

    //关闭
    $(".item-1195639").click(()=>{
        embed.singleClk("gameRuleCloseClick");
        this.$div.hide();
    })

    //知道啦
    $(".item-1168486").click(()=>{
        embed.singleClk("iKnowClick");
        this.$div.hide();
    })

    httpGet("/soap/getGameRule", {
        gameId: store.gameId,
        dsm: getParamUrl("dsm")
    }, (data)=>{
        data = changeJson(data);
        $(".item-1207358").html(data.data);
    })
};

Rule.prototype.show = function(){
    this.$div.show();
    embed.singleExp("gameRuleExpose");
    embed.singleExp("gameRuleCloseExpose");
    embed.singleExp("iKnowExpose");
};