function Store(callback){
    this.monsters = this.getMonsters(CFG.monsters);
    this.info = this.getInfo(CFG.rule);
    this.guns = this.getGuns(CFG.guns);
    this.moreUrl = this.getMoreUrl(CFG.url);
    this.sends = {};
    this.levels = this.getLevels();
    this.configImage = this.getConfigImage(CFG.imgList);
    this.background = this.configImage[Store.BACKGROUND1];
    this.banner = this.configImage[Store.BANNER];
    this.amount = this.getAmount(CFG.amount);
    this.nickName = CFG.nick_name == '**' ? '您' : CFG.nick_name;
    this.gameId = getParamUrl("id");
    this.singleId = 0;
    this.rankData = {};
    this.isPreview = CFG.isPreview == 'true';

    var $this = this;
    this.getStyles(function(){
        $this.initStyle($this.monsters);
        callback && callback();
    });
}

Store.MONSTER6 = '6';//6级怪物
Store.BANNER = '200';//标题
Store.BARREL1 = '300';//炮筒1
Store.BARREL2 = '301';//炮筒2
Store.BARREL3 = '302';//炮筒3
Store.BACKGROUND1 = '400';//背景图

Store.prototype.getGunImage = function(index){
    var n = Store['BARREL' + (index + 1)];
    return this.configImage[n];
}

Store.prototype.getAmount = function(data){
    if(this.noneData(data)){
        data = 0;
    }
    else{
        data = parseInt(data);
    }
    return data;
}

Store.prototype.getConfigImage = function(data){
    if(this.noneData(data)){
        data = {"200":"http://yun.tuisnake.com/tuia-media/img/cw9gi1zo38.png","300":"http://yun.tuisnake.com/tuia-media/img/2c5py1o21v.png","400":"http://yun.tuisnake.com/tuia-media/img/21ieiedp4w.png","301":"http://yun.tuisnake.com/tuia-media/img/xduuuzbyfu.png","302":"http://yun.tuisnake.com/tuia-media/img/j5aaey25fc.png"};
    }
    else{
        data = JSON.parse(data);
    }
    return data;
}

Store.prototype.reset = function(){
    this.sends = {};
    this.levels = this.getLevels();
}

Store.prototype.dispense = function(){
    var n = Math.floor(Math.random() * this.levels.length);
    var list = this.levels.splice(n, 1);
    var level = 0;
    if(list.length == 0){
        var m = Math.floor(Math.random() * this.monsters.length);
        level = this.monsters[m].level;
    }
    else{
        level = list[0];
    }
    this.sends[level] += 1;
    return level;
}

Store.prototype.getLevels = function(){
    var list = [];
    var total = 240;
    for(var i = 0; i < this.monsters.length; i++){
        var t = this.monsters[i].proportion / 100 * total;
        for(var j = 0; j < t; j++){
            list.push(this.monsters[i].level);
        }
        this.sends[this.monsters[i].level] = 0;
    }
    return list;
}

Store.prototype.getBackground = function(data){
    if(this.noneData(data)){
        data = "//yun.dui88.com/h5-mami/webgame/fish/bg.png";
    }
    return data;
}

Store.prototype.getBanner = function(data){
    if(this.noneData(data)){
        data = "//yun.dui88.com/h5-mami/webgame/fish/banner.png";
    }
    return data;
}

Store.prototype.getMoreUrl = function(data){
    if(this.noneData(data)){
        data = "#";
    }
    return data;
}

Store.prototype.noneData = function(data){
    return typeof data == "string" && data.substr(0, 2) == "${";
}

Store.prototype.initStyle = function(list){
    var s = [];
    for (var i = 0; i < list.length; i++) {
        var temp = [];
        temp.push(".monster" + (i + 1) + "{");
        temp.push("width:" + list[i].width / 200 + "rem;");
        temp.push("height:" + list[i].height / 200 + "rem;");
        temp.push("background-image: url(" + list[i].imgUrl + ");");
        temp.push("}");
        s.push(temp.join("\n"));
    }
    var style = document.createElement("style");
    style.innerHTML = s.join("\n");
    document.body.appendChild(style);
}

Store.prototype.getGuns = function(data){
    if(this.noneData(data)){
        /*
        data = [
            {
                "type": 10,
                "url": "//yun.dui88.com/h5-mami/webgame/fish/pao-10.png"
            },
            {
                "type": 100,
                "url": "//yun.dui88.com/h5-mami/webgame/fish/pao-100.png"
            },
            {
                "type": 1000,
                "url": "//yun.dui88.com/h5-mami/webgame/fish/pao-1000.png"
            }
        ]
        */
        data = [100, 200, 300];
    }
    else{
        data = JSON.parse(data);
    }
    return data;
}

Store.prototype.getInfo = function(data){
    if(this.noneData(data)){
        data = "点击开始游戏，开始一局游戏，在2分钟的时间内，玩家点击怪物发射炮筒相应金额的炮弹射击怪物";
    }
    return data;
}

Store.prototype.getMonsters = function(data){
    if(this.noneData(data)){
        data = [{"imgUrl":"http://yun.tuisnake.com/tuia-media/img/f1csfmkr2h.png","prizeAmount":5,"proportion":30,"level":1,"monsterType":0},{"imgUrl":"http://yun.tuisnake.com/tuia-media/img/0mo3b4k76i.png","prizeAmount":10,"proportion":40,"level":2,"monsterType":0},{"imgUrl":"http://yun.tuisnake.com/tuia-media/img/iehv4p27vn.png","prizeAmount":55,"proportion":10,"level":3,"monsterType":0},{"imgUrl":"http://yun.tuisnake.com/tuia-media/img/qc9b318y5d.png","prizeAmount":100,"proportion":10,"level":4,"monsterType":0},{"imgUrl":"http://yun.tuisnake.com/tuia-media/img/or9qo0nydw.png","prizeAmount":300,"proportion":5,"level":5,"monsterType":0},{"imgUrl":"http://yun.tuisnake.com/tuia-media/img/zyizqhzswl.png","prizeAmount":500,"proportion":5,"level":6,"monsterType":0}];
    }
    else{
        data = JSON.parse(data);
    }
    return data;
}

Store.prototype.getStyles = function(callback){
    var loaded = 0;
    var total = this.monsters.length;
    var $this = this;
    for(var i = 0; i < total; i++){
        var img = new Image();
        img.onload = function(){
            $this.updateImageSize(this.src, this.naturalWidth, this.naturalHeight);
            if(++loaded == total){
                callback && callback();
            }
        }
        img.src = this.monsters[i].imgUrl;
    }
}

Store.prototype.updateImageSize = function(url, w, h){
    url = url.substr(-20);
    for(var i = 0; i < this.monsters.length; i++){
        if(this.monsters[i].imgUrl.substr(-20) == url){
            this.monsters[i].width = w;
            this.monsters[i].height = h;
        }
    }
}