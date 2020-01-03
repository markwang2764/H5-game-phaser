function Loading(sel){
    Pop.call(this);
    this.init(sel);
    
    var time = 2000;
    if(sessionStorage.getItem("loading")){
        time = 240;
    }
    else{
        sessionStorage.setItem("loading", 1);
    }


    $(".item-7408901,.item-7357696-color").css({
        "animation-duration": time + "ms"
    })

    setTimeout(() => {
        this.hide();
        //game.embed.singleExp(Embed.MA_SHANG);
    }, time);
}

Loading.prototype = new Pop();
Loading.prototype.constructor = Loading;