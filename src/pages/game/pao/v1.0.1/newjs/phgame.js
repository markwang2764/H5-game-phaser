var STAGE_WIDTH = 750;
var STAGE_HEIGHT = 1206;
var monsters = [];
var devicePixelRatio = window.devicePixelRatio;
var game = new Phaser.Game(STAGE_WIDTH, STAGE_HEIGHT, Phaser.AUTO, 'phaser', { preload: preload, create: create, render: render}, true);


$(".info").html(window.innerWidth + "X" + window.innerHeight + " - " + window.devicePixelRatio);
function preload() {
    var list = JSON.parse(CFG.monsters);
    game.load.crossOrigin = 'anonymous';
    for(var i = 0, len = list.length; i < len; i++){
        game.load.image('monster' + list[i].level, list[i].imgUrl);
    }
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
}

function create() {
    /*
    var images = game.cache.getKeys(Phaser.Cache.IMAGE);
    var monster1 = game.add.sprite(0, 0, 'monster1');
    monster1.x = 60;
    monster1.y = 200;
    var monster11 = game.add.sprite(0, 0, 'monster1');
    monster11.x = 60;
    monster11.y = 200;
    monster11.scale.set(0.75);
    var row = game.add.group();
    var monster2 = row.create(0, 0, "monster2");
    row.x = 240;
    row.y = 200;

    monsters.push(monster1);
    monsters.push(monster11);
    monsters.push(row);
    

    monster11.inputEnabled = true;
    monster11.events.onInputDown.add(function(e){
        
    }, this);
    */

    for(var i = 0; i < 3; i++){
        var sprite = game.add.sprite(0, 0, 'monster' + (i + 1));
        var phmonster = new Phmonster(sprite);
        monsters.push(phmonster);
    }
}

function render() {
    for(var i = 0, len = monsters.length; i < len; i++){
        monsters[i].move();
    }
}

