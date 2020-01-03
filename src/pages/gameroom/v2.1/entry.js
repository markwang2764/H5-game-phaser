// 游戏大厅2.0 现金钱包3.1 自动跳转
// 第一个区块动效删除，用手势替代
import './entry.less';
import GameRoom from './components/gr/index';
import '@lib/zepto-animate/1.0.0/index';

$(function () {
  window.moneyDetail = 0;
  window.restDetail = 0;

  const gameroom = new GameRoom({
    cfg: window.CFG
  });

  gameroom.init();
});
