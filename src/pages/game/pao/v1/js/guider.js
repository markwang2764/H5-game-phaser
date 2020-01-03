function Guider(div){
    this.div = div;
    this.hide();
    //this.activity = localStorage.getItem("activity") != 1;//false 已经展示过， true 未展示
    this.activity = this.getState(store.nickName);
    //this.activity = true;
    if(this.activity){
        $(".guider").html(dataTemplate("guider", {}));
    }
}

Guider.prototype.show = function(x, y){
    this.activity = false;
    //localStorage.setItem("activity", 1);
    this.div.style.display = "block";
    this.div.style.transform = "translate(" + x + "px," + y + "px)";
}

Guider.prototype.hide = function(){
    this.div.style.display = "none";
}

Guider.prototype.getState = function(nickName){
    var app = getParamUrl("id");
    var names = localStorage.getItem(app);
    if(!names){
        var list = [nickName];
        var str = encodeURIComponent(JSON.stringify(list));
        localStorage.setItem(app, str);
        return true;
    }

    var str = decodeURIComponent(names);
    var list = JSON.parse(str);
    if(list.indexOf(nickName) == -1){
        list.push(nickName);
        var str = encodeURIComponent(JSON.stringify(list));
        localStorage.setItem(app, str);
        return true;
    }
    
    return false;
}