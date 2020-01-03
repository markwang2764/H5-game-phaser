import MessageId from '../Message';
export default class Cash{
    constructor(){
        // this.clipboard = null;
        $(".fecth-close").click(()=>{
            this.hide();
        });
        $(".fetch-mask-main").click(()=>{
            this.hide();
        })

        $(".code-copy").click(()=>{
            new ClipboardJS('.code-copy');
            var extra = GAME.tool.paramWrapper([]);
            extra["page_type"] = Global.page == 0 ? 1 : 2;
            extra["bonus"] = parseFloat($(".fecth-num").html());
            GAME.embed.embedExport(GAME.tool.append2Embed("layer_copy_click", extra));
            GAME.event.send(GAME.EventType.UI, MessageId.showTip, "奖励码已复制");
        })

        $(".fecth-btn").click(()=>{
            new ClipboardJS(".fecth-btn");
            GAME.event.send(GAME.EventType.UI, MessageId.showDownload, {tip: "", entry: 0});
            var extra = GAME.tool.paramWrapper([]);
            // extra["loadpage_source_type"] = 0;
            extra["page_source"] = Global.pageSource;
            extra["bonus"] = parseFloat($(".fecth-num").html());
            GAME.embed.embedExport(GAME.tool.append2Embed("download_button_click", extra));
        })
        
    }

    hide() {
        // this.clipboard && this.clipboard.destroy();
        $(".fecth-mask").hide();
    }
    show(){
        $(".fecth-mask").show();
        var extra = GAME.tool.paramWrapper([]);
        extra["page_source"] = Global.pageSource;
        extra["bonus"] = parseFloat($(".fecth-num").html());
        GAME.embed.embedExport(GAME.tool.append2Embed("enter_download_click", extra));

        // if (ClipboardJS.isSupported()) {
        //     // 按钮添加复制到剪切板功能
        //     this.clipboard = new ClipboardJS(".code-copy");
        //     this.clipboard.on('success', function (e) {
        //         debugger

        //         GAME.event.send(GAME.EventType.UI, MessageId.showTip, "奖励码已复制");
        //     });
        //     this.clipboard.on('error', function (e) {
        //         alert('当前浏览器不支持该功能，请手动复制内容');
        //     });
        // } else {
        //     alert("当前浏览器不支持该功能，请手动复制内容");
        // }

        GAME.tool.hpGet("/youtui/extreme/getCdk", {
            gameId: CFG.gameId
        }, (res)=>{
            $("#code").html(res.data);
        });

    }

    getCDK() {
        // 获取cdk值
        GAME.tool.hpGet("/youtui/extreme/switchGameMode", {gameMode: GameMode.LEVEL}, (res)=>{
            if(res.success){
                GAME.event.send(GAME.EventType.UI, MessageId.returnStart, {num: 100});
                Global.gameMode = GameMode.LEVEL;
            }
            
            this.hide();
            Global.page = 0;
            Global.pageSource = 5;
        })
    }

}