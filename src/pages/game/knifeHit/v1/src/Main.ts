/// <reference path="../../../ts/phaser.d.ts"/>

import '../../../core/js/controller'
import gameCfg from "./game/Config";
import Boot from "./game/Boot";
import Match from './game/Match'
import UserData from './game/UserData';
import UserModel from './game/UserModel';
import Play from './game/Play';

export default class Main {

    private game: Phaser.Game;
    constructor() {
        var game = new Phaser.Game(gameCfg.STAGE_WIDTH, gameCfg.STAGE_HEIGHT, Phaser.CANVAS, '');
        game.state.add('Boot', Boot);
        game.state.add('Match', Match);
        game.state.add('Play', Play);
        this.run(game);
    }

    private run(game: Phaser.Game): void {
        var userSys: UserData = new UserData(0);
        userSys.selfId = CFG.uskA;
        userSys.add(CFG);
        game.state.start('Boot');
    }
}

var app = new Main();