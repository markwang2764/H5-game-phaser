import Fresh from '../page/detail'

export default class Detail{
    constructor(){
        $(".detail-close").click(()=>{
            $(".detail-mask").hide();
        });
        $(".detail-mask").click(()=>{
            $(".detail-mask").hide();
        })

        this.fresh = new Fresh();
        this.isInit = false;
    }

    show(){
        $(".detail-mask").show();
        if(!this.isInit){
            this.fresh.init();
            this.isInit = true;
        }

        var extra = GAME.tool.paramWrapper([]);
        extra["page_source"] = Global.pageSource;
        GAME.embed.embedExport(GAME.tool.append2Embed("bonus_detail_click", extra));
    }

}