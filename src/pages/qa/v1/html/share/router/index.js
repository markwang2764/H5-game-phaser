/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-03
 * @des
 */
import App from '../App.vue';

const home = r=>require.ensure([],()=> r(require('../../../page/home')), 'home');
const item = r=>require.ensure([],()=> r(require('../../../page/item')), 'item');
const result = r=>require.ensure([],()=> r(require('../../../page/result')), 'result');
const share = r=>require.ensure([],()=> r(require('../../../page/share')), 'share');

export default [{
  path: '/',
  component: App,
  children: [{
    path: '',
    component: share
  }]
}]