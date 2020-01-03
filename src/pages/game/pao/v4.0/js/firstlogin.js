function FirstLogin(){

}

FirstLogin.prototype.init = function(){
    $(".mask.new-user").css("display", "flex");

    var counter = 8;

    var tid = setInterval(function(){
        if(--counter == 0){
            hide();
        }
        $(".new-user-tip").html(`正在为你跳转（${counter}）`);
    }, 1000);

    var $this = this;

    embed.numExport("2.4");
    $(".new-user-open").click(function(){
        embed.numClick("2.4");

        clearInterval(tid);
        $(this).addClass("opened");
        $(".new-song-title, .new-song-tip1, .new-song-tip2").css("transform", "translateX(3rem)");
        $(".new-song-img1, .new-song-img2").css("transform", "translateX(-3rem)");
        setTimeout(() => {
            $(".new-song").show();
            $(".new-user").hide();
            $this.play();
        }, 1200);
    })

    $(".new-user-close").click(function(){
        hide();
    })

    function hide(){
        clearInterval(tid);
        $(".mask.new-user").hide();
    }

    $(".new-user-header").css("background-image", `url(${CFG.headUrl})`);
    $(".new-user-name").html(CFG.nick_name);
}

FirstLogin.prototype.play = function(){
    setTimeout(() => {
        $(".fire1").show();
    }, 500);

    setTimeout(() => {
        $(".fire2").show();
    }, 900);

    anime({
        targets: ".new-song-title",
        translateX: "0",
        duration: 300,
        delay: 300,
        easing: "easeOutExpo"
    })
    anime({
        targets: ".new-song-tip1",
        translateX: "0",
        duration: 300,
        delay: 600,
        easing: "easeOutExpo"
    })
    anime({
        targets: ".new-song-tip2",
        translateX: "0",
        duration: 300,
        delay: 900,
        easing: "easeOutExpo"
    })
    anime({
        targets: ".new-song-img1",
        translateX: "0",
        duration: 300,
        delay: 700,
        easing: "easeOutExpo"
    })
    anime({
        targets: ".new-song-img2",
        translateX: "0",
        duration: 300,
        delay: 1000,
        easing: "easeOutExpo"
    })

    setTimeout(() => {
        $(".new-song").hide();
        onEnterGame();
    }, 2500);
}