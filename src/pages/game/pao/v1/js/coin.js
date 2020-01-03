function Coin(div, list) {
    this.div = div;
    this.list = list;
    this.timerId = 0;
    this.div.style.display = "none";
    this.running = false;
    this.scale = scale;
}

Coin.prototype.show = function (x, y) {
    this.div.style.display = "block";
    this.running = true;
    var potx = [0, 10, 20, 30, 40];
    var poty = [10, 20, 24, 20, 10];
    var scale = this.scale;

    this.list.forEach(function(item){
        var px = x + potx[2];
        var py = y + 60;
        item.style.opacity = 0;
        item.style.transform = `translate3d(${px}px, ${py}px, 3px)`;
    });

    setTimeout(() => {
        $(this.div).addClass("coin-out");
    }, 10);
    this.div.style.transitionDuration = "300ms";
    
    setTimeout(() => {
        this.list.forEach(function(item, i){
            var px = x + potx[i];
            var py = y - poty[i] - Math.random() * 9;
            item.style.opacity = 1;
            item.style.transitionDelay = Math.random() * 90 + "ms";
            item.style.transform = `translate3d(${px}px, ${py}px, 3px)`;
        });
    }, 20);

    this.div.style.transitionDuration = "800ms";
    var h = window.innerHeight - scale * 40;

    setTimeout(() => {
        this.list.forEach(function(item){
            //var px = x + potx[2];
            var px = 666 * scale;
            var py = h;
            item.style.transform = `translate3d(${px}px, ${py}px, 3px)`;
        });
    }, 320);

    setTimeout(() => {
        this.running = false;
        $(this.div).removeClass("coin-out");
        this.list.forEach(function(item, i){
            //var px = x + potx[i];
            //var py = y - poty[i];
            item.style.opacity = 0;
            item.style.transitionDelay = "0ms";
        });
    }, 1320);

}