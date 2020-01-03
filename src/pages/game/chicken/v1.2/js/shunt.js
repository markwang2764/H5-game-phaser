function Shunt(){
    this.data = null;
}

Shunt.prototype = {
    init: function(){
        var $this = this;
        var param = {
            usk: CFG.uskA,
            gameId: getParamUrl('id'),
            dsm: getParamUrl('dsm'),
            dcm: getParamUrl('dcm')
        }; 
        if (getParamUrl("pageId")) {
            param.pageId = getParamUrl("pageId");
        }
        
        $.get("/common/getGameGuideInfo", param, (data)=>{
            // data = JSON.parse(data);

            //更新埋点
            for(var i = 0; i < data.data.length; i++){
                embedAppend(data.data[i].embed);
            }

            //保存数据
            this.data = data.data;
            this.show();

            $(".other-games-item").click(function(){
                var n = $(this).index();
                var url = "";
                if(n === 0){
                    //点击埋点
                    embedClick(embedData.img_guide_first_click);
                }
                else{
                    //点击埋点
                    embedClick(embedData.img_guide_second_click);
                }
                setTimeout(()=>{
                    window.location = $this.data[n].url;
                }, 120)
            });
        })
    },
    show: function(){
        if(this.data){
            //曝光埋点
            embedExport(embedData.img_guide_first_exposure);
            embedExport(embedData.img_guide_second_exposure);

            //设置引流图片地址
            $(".other-games-item").eq(0).css("background-image", `url(${this.data[0].image})`);
            $(".other-games-item").eq(1).css("background-image", `url(${this.data[1].image})`);
        }
        else{
            this.init();
        }
    }
}