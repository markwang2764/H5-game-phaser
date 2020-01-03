/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-10
 * @des
 */
import './entry.less';
import '@lib/loader/1.0.0/index.js';

require('./components/welcome');

const _array = [
  '//yun.tuisnake.com/h5-mami/webgame/lib/zepto.min.js',
  '//yun.tuisnake.com/h5-mami/webgame/lib/easeljs-0.6.0.min.js',
  '//yun.tuisnake.com/h5-mami/webgame/lib/tweenjs-0.4.0.min.js',
  '//yun.tuisnake.com/h5-mami/webgame/lib/movieclip-0.6.0.min.js',
  '//yun.tuisnake.com/h5-mami/webgame/lib/preloadjs-0.3.0.min.js',
  '//yun.tuisnake.com/h5-mami/webgame/lib/anime.min.js',
  '//yun.dui88.com/h5-mami/webgame/user-pop/rain.js'
];

// const _array = [
//   'lib/zepto.min.js',
//   'lib/easeljs-0.6.0.min.js',
//   'lib/tweenjs-0.4.0.min.js',
//   'lib/movieclip-0.6.0.min.js',
//   'lib/preloadjs-0.3.0.min.js',
//   'lib/anime.min.js',
//   'components/rain.js'
// ];

// function showPop (data) {
//   return new CREATE.WelcomePop(data);
// }

Loader.sync(_array, function () {
  window.postMessage('showpop', '*');
  // window.addEventListener('message',)
  //
  // var config = {
  //   loginType: 3,
  //   userHeader: "//yun.tuisnake.com/h5-mami/webgame/web-login/header/header2.png",
  //   userName: "哈哈感觉",
  //   inHall: true,
  //   amount: 4201,
  //   rewardMoney: 6125
  // }
  //
  // showPop(config)
});

// window.CREATE = window.CREATE || {};
// window.CREATE.showWelcomePop = showWelcomePop
