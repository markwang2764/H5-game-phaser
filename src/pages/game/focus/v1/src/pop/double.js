export default class Double{
    constructor(){
        $(".success-mask").click(function(e){
            if(e.target == e.currentTarget){
                $(".success-mask").hide();
            }
        })

        $(".fail-mask").click(function(e){
            if(e.target == e.currentTarget){
                $(".fail-mask").hide();
            }
        })

        $(".success-btn").click(()=>{
            $(".success-mask").hide();
        })

        $(".fail-btn").click(()=>{
            $(".fail-mask").hide();
        })
    }

    show(success){
        GAME.tool.hpGet("/youtui/extreme/upRate", {
            gameId: CFG.gameId,
            checkPointType: GAME.tool.getParamUrl("checkPointType")
        }, (data)=>{
            var extra = GAME.tool.paramWrapper(["share_way"]);
            if(data.data.success){
                $(".success-add").html(`为好友增加<span class="red-tip">${data.data.singleMoney}</span>元`);
                $(".success-all").html(`Ta已经赚了<span class="red-tip">${data.data.totalBonus}</span>元`);
                $(".success-mask").show();
                extra["red_result"] = 1;
            }
            else{
                $(".fail-mask").show();
                extra["red_result"] = 2;
            }

            GAME.embed.embedExport(GAME.tool.append2Embed("red_pack_result_click", extra));
        })
        
    }
}