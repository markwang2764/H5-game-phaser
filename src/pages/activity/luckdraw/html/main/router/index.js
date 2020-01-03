
import App from '../App.vue';

const home = r=>require.ensure([],()=> r(require('../../home/App')), 'home');
const ios = r=>require.ensure([],()=> r(require('../../ios/ios')), 'ios');

export default [{
  path: '/',
  component: App,
  children: [{
    path: '',
    component: home
  }, {
    path: '/ios',
    component: ios
  }]
}]