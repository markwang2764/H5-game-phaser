/// <reference path="../ts/core.d.ts" />

import './tooler';
import './eventManager';
import './dataManager';
import './embedManager';
import './message';
import './net';

var update = function(dlt) {
    GAME.event.update(dlt);
    GAME.net.update(dlt);
}
window.GAME = window.GAME || {};
GAME.update = update;
export default {};