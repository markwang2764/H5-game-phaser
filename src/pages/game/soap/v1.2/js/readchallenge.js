/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:27:09 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-03-27 18:38:02
 * 查看挑战列表
 */
function ReadChallenge(){
    this.$div = $(".read-page");
    this.init();
    this.show();
}

ReadChallenge.prototype.init = function(){
    httpGet("/soap/getMyChallengeData", {
        challengeId: store.challengeId,
        dsm: getParamUrl("dsm")
    }, (data)=>{
        data = changeJson(data);
        //embed.update(data.data);
        var list = data.data.soapChallengerInfos;
        var html = dataTemplate("tiaozhan-list", {list: list});
        $(".tiaozhan-list").show().html(html);
        $(".item-4803594").html(data.data.score + "m");
        $(".item-4764594").html(`我已打败全国${data.data.rank}%的人`);
        $(".tiaozhan-tip").html(`共有${list.length}位挑战者向你发出了挑战。`);

        var divs = $(".item-5594899");
        for(var i = 0; i < list.length; i++){
            if(!list[i].isSuccess){
                divs[i].setAttribute("class", "item-5594899 red-tip");
            }
        }
    })

};

ReadChallenge.prototype.show = function(){
    embed.update(CFG.SoapyEmbedDto);
    this.$div.show();
    embed.singleExp("pkResultExpose");
};