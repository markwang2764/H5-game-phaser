function Info(div){
    this.div = div;
}

Info.prototype.show = function(){
    this.div.style.display = "block";
    var data = {
        list:this.getList(),
        desc: store.info
    }
    $(".info-scroll").html(dataTemplate("info-content", data));
}

Info.prototype.getList = function(){
    var list = store.monsters;
    var aim = [];
    for(var i = 0; i < list.length; i++){
        if(list[i].proportion > 0){
            aim.push({
                url: list[i].imgUrl,
                life: list[i].level,
                money: list[i].prizeAmount
            });
        }
    }
    return aim;
}

Info.prototype.hide = function(){
    this.div.style.display = "none";
}