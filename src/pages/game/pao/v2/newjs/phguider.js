function Phguider(){
    this.graphics = null;
    this.hander = null;
    this.runing = false;
}

Phguider.prototype = {
    show: function(x, y){
        this.runing = true;
        //var group = phgame.add.sprite(0, 0);
        var bmd = phgame.add.bitmapData(128,128);
        // draw to the canvas context like normal
        bmd.ctx.beginPath();
        bmd.ctx.strokeStyle = "#ffffff";
        bmd.ctx.lineWidth = 8;
        bmd.ctx.arc(64, 64, 60, 0, 2 * Math.PI);
        bmd.ctx.stroke();
        this.graphics = phgame.add.sprite(x, y, bmd);
        this.graphics.anchor.set(0.5, 0.5);
        phgame.add.tween(this.graphics).to( { alpha: 0 }, 900, "Linear", true, 0, -1);
        phgame.add.tween(this.graphics.scale).to( { x: 2, y: 2 }, 900, "Linear", true, 0, -1);
        
        this.hander = phgame.add.sprite(x + 80, y + 80, "hander");
        var tween = phgame.add.tween(this.hander).to( { x: x + 100, y: y + 100 }, 900, "Linear", true, 0, -1);
        tween.yoyo(true, 30);

        /*
        graphics.inputEnabled = true;
        hander.inputEnabled = false;
        graphics.events.onInputDown.add(function(e){
            graphics.destroy();
            hander.destroy();
            hitSignal.dispatch({type: "hide_guider", x: e.input.downPoint.x, y: e.input.downPoint.y});
        }, this);
        */
    },
    hide: function(){
        game.running = true;
        if(this.runing){
            this.runing = false;
            this.hander.destroy();
            this.graphics.destroy();
            phready = true;
        }
    }
};