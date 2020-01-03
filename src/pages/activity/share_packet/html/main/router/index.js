
import App from '../App.vue';

const home = r=>require.ensure([],()=> r(require('../../../page/home')), 'home');
const landing = r=>require.ensure([],()=> r(require('../../landing/App')), 'landing');

export default [{
  path: '/',
  component: App,
  children: [{
    path: '',
    component: home
  }, {
    path: 'landing',
    component: landing
  }]
}]