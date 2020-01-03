// 游戏大厅3.1 新增赛事竞猜区块
import './entry.less';
import GameRoom from './components/gr/index';
import '@lib/zepto-animate/1.0.0/index';


$(function () {
  window.moneyDetail = 0;
  window.restDetail = 0;

  const gameroom = new GameRoom({cfg: window.CFG});

  gameroom.init();
});