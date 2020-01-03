export default class Download{
    constructor(){
        $(".download-mask").click(()=>{
            $(".download-mask").hide();
        });
    }

    show(){
        $(".download-mask").show();
        // var extra = GAME.tool.paramWrapper([""]);
        // extra["loadpage_source_type"] = 2;
        // GAME.embed.embedExport(GAME.tool.append2Embed("download_pull_browser_click", extra));
    }
}