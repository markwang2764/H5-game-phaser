/*
 * @Author: miaokefu@duiba.com.cn 
 * @Date: 2018-07-24 19:46:33 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-03 14:36:49
 */
import App from '../App.vue';

const mainContainer = r => require.ensure([], () => r(require('../../../page/main-container')), 'main-container');
const jsbridge = r => require.ensure([], () => r(require('../../../page/jsbridge')), 'jsbridge');

// const home = r => require.ensure([], () => r(require('../../../page/home')), 'home');
// const item = r => require.ensure([], () => r(require('../../../page/item')), 'item');
// const result = r => require.ensure([], () => r(require('../../../page/result')), 'result');
// const share = r => require.ensure([], () => r(require('../../../page/share')), 'share');

export default [{
  path: '/',
  component: App,
  children: [{
      path: '',
      component: mainContainer
    },
    {
      path: '/bridge',
      component: jsbridge
    }
    // ,{
    //   path: '/item',
    //   component: item
    // }, {
    //   path: '/result',
    //   component: result
    // }, {
    //   path: '/share',
    //   component: share
    // }
  ]
}]