import '../../../core/js/controller';
import './Message';
import Boot from './Boot';
import Load from './Load';
import gcf from './Config';
import Start from './Start';
import Play from './Play';
import UserData from './UserData';
import { DataSystemType, EnterType } from './Enums';
import Pkresult from './Pkresult';
import MessageId from './Message';

var game: Phaser.Game;
export default class Main {
    constructor() {
        game = new Phaser.Game(gcf.WIDTH, gcf.HEIGHT, Phaser.CANVAS, 'game', {
            preload: this.preload.bind(this),
            create: this.create.bind(this)
        }, false, false);
        game.state.add('Boot', Boot);
        game.state.add('Load', Load);
        game.state.add('Start', Start);
        game.state.add('Play', Play);
        game.state.add('Pkresult', Pkresult);
        GAME.app = game;
    }

    private preload(): void {
        game.load.crossOrigin = 'anonymous';
        game.load.json('assets',  gcf.HOST + 'assets/boot.res.json');
        window.onbeforeunload = function() {
            if(!!game && game.sound) {
                game.sound.stopAll();
                game.destroy();
            }
        }
    }

    private create(): void {
        var sys: UserData = new UserData(DataSystemType.USER);
        sys.selfId = CFG.uskA || CFG.sessionKey;
        sys.add(CFG);
        switch(CFG.enterGameSource) {
            case EnterType.WX:
                var SCFG: any = CFG;
                var rivalId = GAME.tool.getParamUrl('sourceToken');
                if(rivalId === sys.selfId) {
                    rivalId += 'r';
                }
                var rival = {
                    id: rivalId,
                    name: SCFG.shareNickName,
                    headUrl: SCFG.shareHeadUrl,
                    best: SCFG.shareScore,
                    // rank: GAME.tool.getParamUrl('exceedPercent'),
                }
                sys.add(rival);
                sys.curLevelId = parseInt(GAME.tool.getParamUrl('checkPointType'));
                game.state.start('Boot');
                break;
            case EnterType.HB:
            case EnterType.APP:
                game.state.start('Boot');
                break;
            default:
                break;
        }
        game.onBlur.add(()=>{
            console.log('onBlur');
            GAME.event.send(GAME.EventType.INTER, MessageId.onBlur, Date.now());
        });
        game.onFocus.add(()=>{
            console.log('onFocus');
            GAME.event.send(GAME.EventType.INTER, MessageId.onFocus, null);
        });
    }
}