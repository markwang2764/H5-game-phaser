function Phboss(){
    this.phbossCoin = new PhbossCoin();
    this.dieGroup = phgame.add.group();
    this.dieGroup.visible = false;
    this.drawDie();

    this.group = phgame.add.group();

    this.left = this.group.create(0, 0, "erduo");
    this.right = this.group.create(0, 0, "erduo");
    this.body = this.group.create(0, 0, "body");
    this.huxu = this.group.create(0, 0, "huxu");
    this.xiangyan = this.group.create(0, 0, "xiangyan");
    this.mojing = this.group.create(0, 0, "mojing");
    
    /*
    this.group = phgame.add.sprite(0, 0, "body");
    this.left = phgame.make.sprite(0, 0, "erduo");
    this.right = phgame.make.sprite(0, 0, "erduo");
    this.body = phgame.make.sprite(0, 0, "body");
    this.huxu = phgame.make.sprite(0, 0, "huxu");
    this.xiangyan = phgame.make.sprite(0, 0, "xiangyan");
    this.mojing = phgame.make.sprite(0, 0, "mojing");

    this.group.addChild(this.left);
    this.group.addChild(this.right);
    this.group.addChild(this.body);
    this.group.addChild(this.huxu);
    this.group.addChild(this.xiangyan);
    this.group.addChild(this.mojing);
    */

    this.left.anchor.set(0.5, 1);
    this.right.anchor.set(0.5, 1);

    this.huxu.x = 124;
    this.huxu.y = 187;

    this.left.x = 60;
    this.left.y = 124;

    this.right.x = 154;
    this.right.y = 72;
    this.right.scale.x = -1;

    this.left.inputEnabled = true;
    this.right.inputEnabled = true;

    this.xiangyan.x = 228;
    this.xiangyan.y = 228;
    this.mojing.x = -200;
    this.mojing.y = -10;
    this.mojing.alpha = 0;

    this.left.rotation = -60 * Math.PI / 180;
    this.right.rotation = 10 * Math.PI / 180;

    this.group.x = 100;
    this.group.y = 300;

    this.x = 0;
    this.y = 360;
    this.xspeed = 0;
    this.yspeed = 0;
    this.timer = 0;
    this.shaking = false;
    this.shakeTimes = 0;
    this.group.visible = false;
    this.aroundTimer = 0;
    this.stop = false;
    this.autoHideTimer = 0;
    this.readyHide = false;
    this.init();

    // this.group.setAll('inputEnabled', true);
    // this.group.callAll('input.enableDrag', 'input');
}

Phboss.prototype = {
    init: function(){
        this.body.inputEnabled = true;
        this.body.events.onInputDown.add(function(e){
            this.shake();
            hitSignal.dispatch({type: "hit_boss", x: e.input.downPoint.x, y: e.input.downPoint.y});
        }, this);

        //phgame.add.tween(this.mojing).to( { alpha: 1, x: -22, y: 42, rotation: Math.PI * 2 }, 1200, "Linear", true);
        
        setInterval(()=>{
            phgame.add.tween(this.left).to( { rotation: -50 * Math.PI / 180 }, 40, Phaser.Easing.Bounce.InOut, true, 10, 2, true);
            phgame.add.tween(this.right).to( { rotation: -10 * Math.PI / 180 }, 40, Phaser.Easing.Bounce.InOut, true, 10, 2, true);
            // phgame.add.tween(this.left).to( { rotation: -40 * Math.PI / 180 }, 40, Phaser.Easing.Bounce.Out, true).onComplete.add(()=>{
            //     phgame.add.tween(this.left).to( { rotation: -20 * Math.PI / 180 }, 50, Phaser.Easing.Bounce.In, true);
            // }, this);
            // phgame.add.tween(this.right).to( { rotation: 10 * Math.PI / 180 }, 40, Phaser.Easing.Bounce.Out, true).onComplete.add(()=>{
            //     phgame.add.tween(this.right).to( { rotation: -20 * Math.PI / 180 }, 50, Phaser.Easing.Bounce.In, true);
            // }, this)
        }, 1200)
    },
    drawDie: function(){
        this.leftLeg = this.dieGroup.create(175, 462, "leftleg");
        this.rightLeg = this.dieGroup.create(206, 462, "rightleg");
        this.diebody = this.dieGroup.create(0, 0, "diebody");
        this.leftLeg.anchor.set(1, 0);
        this.rightLeg.anchor.set(0, 0);
        this.bossboom = this.dieGroup.create(200, 200, "bossboom");
        this.bossboom.scale.set(2, 2);
        this.bossboom.visible = false;
    },
    enter: function(){
        this.stop = false;
        this.aroundTimer = 0;
        this.dieGroup.visible = false;
        this.group.addChild(this.mojing);
        this.group.addChild(this.xiangyan);

        this.x = -320;
        this.group.x = this.x;
        this.group.visible = true;
        this.timer = 0;
        this.shaking = false;
        this.shakeTimes = 0;
        this.group.visible = true;

        this.mojing.alpha = 0;
        this.mojing.visible = true;
        this.mojing.x = 640;
        this.mojing.y = -700;
        this.mojing.rotation = -1.2;
        this.mojing.scale.set(1, 1);

        this.huxu.visible = true;
        this.huxu.alpha = 0;
        this.huxu.x = 800;
        this.huxu.y = 600;
        this.huxu.rotation = -1.2;      

        this.xiangyan.visible = true;
        this.xiangyan.alpha = 0;
        this.xiangyan.x = 760;
        this.xiangyan.y = 1200;
        this.xiangyan.rotation = -1.2;
        this.xiangyan.scale.set(1, 1);   

        var tid = setInterval(()=>{
            if(this.group.x > 100){
                console.log("动画开始");
                clearInterval(tid);

                setTimeout(()=> {
                    phgame.add.tween(this.mojing).to( { alpha: 1, x: -22, y: 42, rotation: Math.PI * 2 }, 400, "Linear", true);
                }, 10);

                setTimeout(()=> {
                    phgame.add.tween(this.huxu).to( { alpha: 1, x: 124, y: 187, rotation: Math.PI * 2 }, 400, "Linear", true);
                }, 10);

                setTimeout(()=> {
                    phgame.add.tween(this.xiangyan).to( { alpha: 1, x: 228, y: 228, rotation: Math.PI * 2 }, 400, "Linear", true);
                }, 10);
            }
        }, 400);

        this.readyHide = false;
        clearTimeout(this.autoHideTimer);
        this.autoHideTimer = setTimeout(()=>{
            this.readyHide = true;
        }, 13200);

    },
    move: function(){
        if(this.stop){
            return;
        }
        this.x += this.xspeed;
        this.timer += 0.24;
        this.yspeed = Math.sin(this.timer) * 0.8;
        this.y += this.yspeed;

        if(this.xspeed > 0){
            if(this.group.x > STAGE_WIDTH - this.body.width * 0.6){
                if(!this.readyHide){
                    this.xspeed = -3;
                    this.group.scale.x = -1;
                    this.x += this.body.width * 0.6;
                }
            }
        }
        else{
            if(this.group.x < this.body.width * 0.6){
                if(!this.readyHide){
                    this.xspeed = 3;
                    this.group.scale.x = 1;
                    this.x -= this.body.width * 0.6;
                }
            }
        }

        if(this.shaking){
            this.group.x = this.x + (0.5 - Math.random()) * 12;
            this.group.y = this.y + (0.5 - Math.random()) * 12;
            if(++this.shakeTimes > 10){
                this.shaking = false; 
            }
        }
        else{
            this.group.x = this.x;
            this.group.y = this.y;
        }
        if(this.readyHide){
            if(this.group.x > STAGE_WIDTH + 30){
                hitSignal.dispatch({type: "hide_boss"});
                console.log("[右边消失]");
                this.stop = true;
                clearTimeout(this.autoHideTimer);
            }
            else if(this.group.x < -30){
                hitSignal.dispatch({type: "hide_boss"});
                console.log("[左边消失]");
                this.stop = true;
                clearTimeout(this.autoHideTimer);
            }
        }
    },
    shake: function(){
        this.shaking = true;
        this.shakeTimes = 0;
    },
    hide: function(){
        this.group.visible = false;
        this.dieGroup.visible = false;
        clearTimeout(this.autoHideTimer);
    },
    die: function(){
        clearTimeout(this.autoHideTimer);
        this.stop = true;
        this.readyHide = false;
        this.hide();
        this.dieGroup.visible = true;
        this.diebody.y = 0;
        this.dieGroup.x = this.group.x;
        this.dieGroup.y = this.group.y;
        this.dieGroup.scale.x = this.group.scale.x;
        this.leftLeg.rotation = -30 * Math.PI / 180;
        this.rightLeg.rotation = 30 * Math.PI / 180;
        phgame.add.tween(this.leftLeg).to( { rotation: 30 * Math.PI / 180 }, 200, Phaser.Easing.Bounce.InOut, true);
        phgame.add.tween(this.rightLeg).to( { rotation: -30 * Math.PI / 180 }, 200, Phaser.Easing.Bounce.InOut, true);
        phgame.add.tween(this.diebody).to( { y: 12 }, 200, Phaser.Easing.Bounce.InOut, true);

        this.mojing.alpha = 1;
        this.mojing.visible = true;
        this.mojing.x = -22;
        this.mojing.y = 42;
        this.mojing.rotation = 0;
        this.dieGroup.addChild(this.mojing);

        this.xiangyan.alpha = 1;
        this.xiangyan.visible = true;
        this.xiangyan.x = 228;
        this.xiangyan.y = 228;
        this.xiangyan.rotation = 0;
        this.dieGroup.addChild(this.xiangyan);

        this.leftLeg.visible = true;
        this.rightLeg.visible = true;
        this.diebody.visible = true;
        
        setTimeout(()=> {
            phgame.add.tween(this.mojing).to( { x: 80, y: 360, rotation: 1.92 }, 200, "Linear", true);
            phgame.add.tween(this.mojing.scale).to( { x: 0.4, y: 0.4}, 200, "Linear", true);

            phgame.add.tween(this.xiangyan).to( { x: 240, y: 420, rotation: 0.8 }, 200, "Linear", true);
            phgame.add.tween(this.xiangyan.scale).to( { x: 0.4, y: 0.4 }, 200, "Linear", true);

            playBombMusic();
        }, 200);

        setTimeout(()=>{
            this.bossboom.visible = true;
            var anim = this.bossboom.animations.add("fire");
            this.bossboom.animations.play("fire", 30, false);
            this.bossboom.animations.loop = false;
            this.bossboom.anchor.set(0.5, 0.5);
            anim.onComplete.add(function(a, b){
                this.bossboom.visible = false;
            }, this);

            this.diebody.visible = false;
            this.xiangyan.visible = false;
            this.leftLeg.visible = false;
            this.rightLeg.visible = false;
            this.mojing.visible = false;
            this.phbossCoin.show(32);

            playCoinMusic();
        }, 600)

        stopMusic();
    }
};