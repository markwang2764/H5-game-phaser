var STAGE_WIDTH = 750;
var STAGE_HEIGHT = STAGE_WIDTH / (window.innerWidth/window.innerHeight);
var hitSignal;
var devicePixelRatio = window.devicePixelRatio;
var phgame;
var phboss;
var phcombo;
var phboom;
var phguider;
var pheffect;
var phviews = [];
var phrows = [];
var phready = false;
var phover;
var phbossFire;
var phclock;
var phmusic;
var phbombMusic;
var phalertMusic;
var phcoinMusic;

//$(".info").html(window.innerWidth + "X" + window.innerHeight + " - " + window.devicePixelRatio);

function phgameInit(){
    hitSignal = new Phaser.Signal();
    phgame = new Phaser.Game(STAGE_WIDTH, STAGE_HEIGHT, Phaser.AUTO, 'phaser', { preload: preload, create: create, render: render}, true);
}

function preload() {
    phgame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    var list = JSON.parse(CFG.monsters);
    phgame.load.crossOrigin = 'anonymous';
    for(var i = 0, len = list.length; i < len; i++){
        phgame.load.image('monster' + list[i].level, list[i].imgUrl);
    }

    phgame.load.image("body", "//yun.tuisnake.com/h5-mami/webgame/fish/body2.png");
    phgame.load.image("xiangyan", "//yun.tuisnake.com/h5-mami/webgame/fish/xiangyan2.png");
    phgame.load.image("erduo", "//yun.tuisnake.com/h5-mami/webgame/fish/erduo2.png");
    phgame.load.image("huxu", "//yun.tuisnake.com/h5-mami/webgame/fish/huxu2.png");
    phgame.load.image("mojing", "//yun.tuisnake.com/h5-mami/webgame/fish/mojing2.png");
    phgame.load.image("onecoin", "//yun.tuisnake.com/h5-mami/webgame/fish/coin.png");
    phgame.load.image("tape", "//yun.tuisnake.com/h5-mami/webgame/fish/tape.png");
    phgame.load.image("hander", "//yun.tuisnake.com/h5-mami/webgame/fish/hander.png");
    phgame.load.image("clock", "//yun.tuisnake.com/h5-mami/webgame/fish/clock.png");
    phgame.load.spritesheet('boom', '//yun.tuisnake.com/h5-mami/webgame/fish/small.png', 180, 162, 10);

    phgame.load.image('bg', '//yun.tuisnake.com/h5-mami/webgame/fish/resultbg.png');
    phgame.load.image('bg_monster', '//yun.tuisnake.com/h5-mami/webgame/fish/bg_monster2.png');
    phgame.load.image('light', '//yun.tuisnake.com/h5-mami/webgame/fish/light2.png');
    phgame.load.image('new_gold', '//yun.tuisnake.com/h5-mami/webgame/fish/new_gold2.png');
    phgame.load.image('new_kill', '//yun.tuisnake.com/h5-mami/webgame/fish/new_kill2.png');
    phgame.load.image('newrecord', '//yun.tuisnake.com/h5-mami/webgame/fish/newrecord2.png');
    phgame.load.image('title', '//yun.tuisnake.com/h5-mami/webgame/fish/zhanji2.png');

    phgame.load.image('diebody', '//yun.tuisnake.com/h5-mami/webgame/fish/diebody.png');
    phgame.load.image('leftleg', '//yun.tuisnake.com/h5-mami/webgame/fish/leftleg.png');
    phgame.load.image('rightleg', '//yun.tuisnake.com/h5-mami/webgame/fish/rightleg.png');
    phgame.load.image('missemoji', CFG.facialExpression);

    //phgame.load.atlas('mulimg', '//yun.tuisnake.com/h5-mami/webgame/fish/sprites.png', '//yun.tuisnake.com/h5-mami/webgame/fish/sprites.json');

    phgame.load.spritesheet('coin', '//yun.tuisnake.com/h5-mami/webgame/fish/coin_roll2.png', 83, 80, 8);
    phgame.load.spritesheet('lights', '//yun.tuisnake.com/h5-mami/webgame/fish/light_sheet2.png', 150, 150, 5);

    // phgame.load.spritesheet('bossboom', '//yun.tuisnake.com/h5-mami/webgame/fish/bossboom.png', 463, 500, 25);
    // phgame.load.spritesheet('fireboss', '//yun.tuisnake.com/h5-mami/webgame/fish/fireboss.png', 450, 411, 21);
    // phgame.load.spritesheet('firetime', '//yun.tuisnake.com/h5-mami/webgame/fish/firetime.png', 230, 200, 27);

    phgame.load.spritesheet('bossboom', '//yun.tuisnake.com/h5-mami/webgame/fish/new-fire2.png', 400, 372, 25);
    phgame.load.spritesheet('fireboss', '//yun.tuisnake.com/h5-mami/webgame/fish/new-fire3.png', 310, 261, 21);
    phgame.load.spritesheet('firetime', '//yun.tuisnake.com/h5-mami/webgame/fish/new-fire1.png', 204, 193, 25);
    
    phgame.load.bitmapFont('w_num', '//yun.tuisnake.com/h5-mami/webgame/fish/w_num2.png', '//yun.tuisnake.com/h5-mami/webgame/fish/w_num.xml', null, 0);
    phgame.load.bitmapFont('num', '//yun.tuisnake.com/h5-mami/webgame/fish/num2.png', '//yun.tuisnake.com/h5-mami/webgame/fish/num.xml', null, 0);
    phgame.load.bitmapFont('comboxfont', '//yun.tuisnake.com/h5-mami/webgame/fish/combox-export.png', '//yun.tuisnake.com/h5-mami/webgame/fish/combox-export.xml');

    phgame.load.audio('bgmusic', '//yun.tuisnake.com/h5-mami/webgame/fish/TheNextEpisode2.mp3');
    phgame.load.audio('alertmusic', '//yun.tuisnake.com/h5-mami/webgame/fish/Special_alert.mp3');
    phgame.load.audio('bombmusic', '//yun.tuisnake.com/h5-mami/webgame/fish/Special_Bomb.mp3');
    phgame.load.audio('getcoin', '//yun.tuisnake.com/h5-mami/webgame/fish/SpecBeanChanged.mp3');

    phgame.stage.disableVisibilityChange = true;
}

// phgameInit();
function create() {
    console.warn("加载资源完成");
    // phboss = new Phboss();
    // phboss.enter();
    // phboss.group.x = 200;
    // return;

    // var robot = phgame.add.sprite(150, 300, 'mulimg');
    // robot.frameName = 'mojing.png';
    // robot.inputEnabled = true;
    // robot.input.enableDrag();

    //phgame.add.image(150, 200, 'mulimg', 'mojing.png');

    // initGameScene();

    phrows.push(new Phrow(-1, 30, STAGE_HEIGHT / 2 - 240, 0, false));
    phrows.push(new Phrow(1, -30, STAGE_HEIGHT / 2, 1, guider.activity));
    phrows.push(new Phrow(-1, 60, STAGE_HEIGHT / 2 + 240, 2, false));

    phrows.forEach(item => {
        phviews.push(item);
    });

    pheffect = new Pheffect();
    phviews.push(pheffect);

    phboss = new Phboss();
    phviews.push(phboss);

    phboom = new Phboom();
    phguider = new Phguider();
    phbossFire = new PhbossFire();
    phcombo = new Phcombo();

    phmusic = phgame.add.audio("bgmusic");
    phmusic.allowMultiple = true;
    phmusic.addMarker("bg", 2, phmusic.duration);
    
    //var item = phgame.add.bitmapText(100, 200, 'comboxfont', '', 64);
    //item.setText("combox24");
    //item.setText("combox24465734");

    phclock = new Phclock(phgame.world.centerX, 160);
    // phclock.showTime(0);
}

function showBoss(){
    phrows.forEach(item => {
        item.leave();
    });

    setTimeout(function(){
        phboss.enter();
        phmusic.play("bg");
    }, 4200);
    
    setTimeout(function(){
        playAlertMusic();
    }, 1200);
    
}

function stopMusic(){
    phmusic.stop();
    phcombo.hide();
}

function playBombMusic(){
    if(!phbombMusic){
        phbombMusic = phgame.add.audio("bombmusic");
    }
    phbombMusic.play();
}

function playAlertMusic(){
    if(!phalertMusic){
        phalertMusic = phgame.add.audio("alertmusic");
    }
    phalertMusic.play();
}

function playCoinMusic(){
    if(!phcoinMusic){
        phcoinMusic = phgame.add.audio("getcoin");
    }
    phcoinMusic.play();
}

function render() {
    if(!phready){
        return;
    }
    
    for(var i = 0, len = phviews.length; i < len; i++){
        phviews[i].move();
    }
}