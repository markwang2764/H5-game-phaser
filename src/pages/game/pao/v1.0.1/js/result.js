function Result(div){
    this.div = div;
}

Result.prototype.show = function(data){
    this.div.style.display = "block";
    var aim = {
        total: data.killNum,
        money: 0,
        list: this.getList(data.perKillNum)
    }

    $(".result-content").html(dataTemplate("result-content", aim));
    var txt = $(".result-money")[0];
    var cur = 0;
    var step = Math.floor(data.amount / 24);
    step = step > 1 ? step : 1;
    setTimeout(()=>{
        var tid = setInterval(function(){
            cur += step;
            if(cur >= data.amount){
                clearInterval(tid);
                cur = data.amount;
                txt.innerHTML = cur + "枚<span class='result-scale-txt'>" + cur + "</span>";
            }
            else{
                txt.innerHTML = cur + "枚";
            }
        }, 30);
    }, 300);
    
}

Result.prototype.getList = function(list){
    var aim = [];
    for(var i = 0; i < list.length; i++){
        if(store.monsters[i].proportion > 0){
            aim.push({
                url: store.monsters[i].imgUrl,
                num: "x" + list[i]
            })
        }
    }
    return aim;
}

Result.prototype.hide = function(){
    this.div.style.display = "none";
}