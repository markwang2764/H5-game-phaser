/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-03
 * @des
 */
import App from '../App.vue';

const ask = r => require.ensure([], () => r(require('../../../page/ask')), 'ask');
const answer = r => require.ensure([], () => r(require('../../../page/answer')), 'answer');
const share = r => require.ensure([], () => r(require('../../../page/share')), 'share');
const earn = r => require.ensure([], () => r(require('../../../page/earn')), 'earn');

export default [{
  path: '/',
  component: App,
  children: [{
    path: '/ask',
    component: ask
  }, {
    path: '/answer',
    component: answer
  }, {
    path: '/share',
    component: share
  }, {
    path: '/earn',
    component: earn
  }, {
    path: '',
    component: share
  }]
}];
