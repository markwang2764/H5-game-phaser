import App from '../App.vue';

const home = r => require.ensure([], () => r(require('../../../page/home')), 'home');
const result = r => require.ensure([], () => r(require('../../../page/result')), 'result');
export default [{
  path: '/',
  component: App,
  children: [{
    path: '',
    component: home
  },{
    path: 'result',
    component: result
  }]
}]