import MessageId from "../Message";
import JTemp from './template';

class Page{
    constructor(){
        // this.showShare(false);
        // this.showGame();
        $(".other-btn").click(()=>{
            // this.showGame();
            window.Global.startPk = true;
            GAME.event.send(GAME.EventType.INTER, MessageId.startPk, null);
            // GAME.app.state.start("Play");
            setTimeout(()=>{
                $(".pages").hide();
                $("canvas").click();
            }, 200);
        })

        $(".other-reshare").click(()=>{
            GAME.event.send(GAME.EventType.INTER, MessageId.showShare, {tip: "这道题太难了<br/>单身20年的手速都败了~", entry: 0});
        })
    }

    showShare(self){
        // $(".game-view").hide();
        $(".pages").show();
        if(self){
            $(".share-my").show().siblings().hide();
            var html = this.getHtmlByData("my-list", {list: [1,2,3,4]});
            $(".my-list").html(html);
        }
        else{
            $(".share-other").show().siblings().hide();
            var extra = GAME.tool.paramWrapper([]);
            extra["enter_layer_source"] = 0;//来源
            GAME.embed.embedExport(GAME.tool.append2Embed("share_challenge_click", extra));
        }
    }

    showGame(){
        // $(".game-view").show();
        $(".pages").hide();
    }

    getHtmlByData (sid, data) {
        var jtemp = new JTemp(sid);
        var html = jtemp.build(data);
        return html;
    }
}

var page = new Page();
export default page;