function Overspend(sel){
    Pop.call(this);
    this.init(sel);

    this.hide();

    //知道啦
    $('.item-0863989').click(()=>{
        this.hide();
    })

    //关闭
    $('.item-0876749').click(()=>{
        this.hide();
    })
}

Overspend.prototype = new Pop();
Overspend.prototype.constructor = Overspend;