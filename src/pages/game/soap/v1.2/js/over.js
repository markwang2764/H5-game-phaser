/*
 * @Author: 江思志 
 * @Date: 2018-03-21 10:26:29 
 * @Last Modified by: 江思志
 * @Last Modified time: 2018-06-29 16:57:33
 * 游戏结束弹窗
 */
function Over(){
    this.$div = $(".over-mask");
    this.callback = null;
    this.data = null;
    this.shunt = new Shunt();
    this.init();
}

Over.prototype.init = function(){
    //关闭
    $(".over-mask .item-5502382").click(()=>{
        embed.singleClk("advertCloseClick");
        this.$div.hide();
        window.history.back();
    })

    //查看成绩
    $(".over-mask .item-6979558").click(()=>{
        embed.singleClk("initScoreClick");
        this.$div.hide();
        game.showResult();
    })

    //立即领取
    $(".over-mask .item-6971870").click(()=>{
        embed.singleClk("useAdvertClick");
        this.$div.hide();
        game.cache.setState(2, "点击游戏结束弹窗领取按钮");
        //window.location = this.data.soapPropsRsp.clickUrl;
        game.trick.autoJump();
    })

    //点击广告图片
    $(".over-mask .item-5458182").click(()=>{
        embed.singleClk("advertClick");
        game.cache.setState(2, "点击游戏结束弹窗图片");

        game.trick.autoJump();
        //window.location = this.data.soapPropsRsp.clickUrl;
    })
};

Over.prototype.show = function(data, showGuide){
    this.data = data.data;
    this.$div.show();
    this.setView();

    $(".item-7036863").show();
    $(".item-6971870").addClass("short");
    $('.item-6979558').hide();
    setTimeout(() => {
        $(".item-7036863").hide();
      $('.item-6979558').show();
      $(".item-6971870").removeClass("short");
    }, 2000);

    // 显示引流
    if (showGuide) {
      $('.item-6637991 .item-5458182').hide();
      $('.item-6637991 .item-5528583').hide();

      $('.item-6637991').addClass('shunt');
        this.shunt.show();
    } else {
      $('.item-6637991 .item-5458182').show();
      $('.item-6637991 .item-5528583').show();

      $('.item-6637991').removeClass('shunt');
      embed.singleExp("useAdvertExpose");
      embed.singleExp("advertExpose");
    }
    embed.singleExp("advertCloseExpose");
    embed.singleExp("initScoreExpose");
};

Over.prototype.setView = function(){
    console.log(this.data);
    if(this.data.soapPropsRsp.isSuccess){
        $(".item-5458182").css("background-image", `url(${this.data.soapPropsRsp.materialUrl})`);
        $(".item-5528583").html(this.data.soapPropsRsp.advertName);
    }
    else{
      // 没有券的情况下显示引流，不展示成绩
        // this.$div.hide();
        // game.showResult();
        // this.over.show(data, true);
    }
};

Over.prototype.hide = function(){
    this.$div.hide();
};