import Ads from './ads'

function Shunt(){
    this.data = null;
}

Shunt.prototype = {
    init: function(){
        var $this = this;
        var param = {
            usk: CFG.uskA,
            gameId: window.BT.getParamUrl('id'),
            dsm: window.BT.getParamUrl('dsm'),
            dcm: window.BT.getParamUrl('dcm')
        }; 
        if (window.BT.getParamUrl("pageId")) {
            param.pageId = window.BT.getParamUrl("pageId");
        }
        
        $.get("/common/getGameGuideInfo", param, (data)=>{
            if(typeof data == "string"){
                data = JSON.parse(data);
            }
            // data = JSON.parse(data);

            //更新埋点
            for(var i = 0; i < data.data.length; i++){
                Ads.append(data.data[i].embed);
            }

            //保存数据
            this.data = data.data;

            $(".other-games-item").click(function(){
                var n = $(this).index();
                var url = "";
                if(n === 0){
                    //点击埋点
                    Ads.embedClick(window.CFG.embed.img_guide_first_click);
                }
                else{
                    //点击埋点
                    Ads.embedClick(window.CFG.embed.img_guide_second_click);
                }
                setTimeout(()=>{
                    window.location = $this.data[n].url;
                }, 120)
            });

            this.show();
        })
    },
    show: function(){
        if(this.data){
            //设置引流图片地址
            $(".other-games-item").eq(0).css("background-image", `url(${this.data[0].image})`);
            $(".other-games-item").eq(1).css("background-image", `url(${this.data[1].image})`);

            //曝光埋点
            Ads.embedExport(window.CFG.embed.img_guide_first_exposure);
            Ads.embedExport(window.CFG.embed.img_guide_second_exposure);
        }
        else{
            this.init();
        }
    }
}

export default Shunt;