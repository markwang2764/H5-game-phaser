function Offline(sel){
    Pop.call(this);
    this.init(sel);

    this.hide();

    $(".item-7747726").click(()=>{
        this.hide();
    })

    $(".item-7815254").click(()=>{
        window.location.reload();
    })
}

Offline.prototype = new Pop();
Offline.prototype.constructor = Offline;

Offline.prototype.setData = function(msg, code){
    $(".item-7776742").html(msg);
    $(".item-7796390").html("错误码：" + code);
    $(".item-7815254").html("好的");
    this.show();
}