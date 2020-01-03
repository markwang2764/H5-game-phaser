/**
 * @desc:
 * @author : Dec-F
 * @Date : 2018-07-23 14:15:52
 * @Last Modified by: Dec-F
 * @Last Modified time: 2018-08-08 16:05:14
 */

import Vue from 'vue';

// var VConsole = require('vconsole/dist/vconsole.min');
// var vConsole = new VConsole();

import axios from 'axios';
import bus from '@components/bus/index';
import App from './App';
import VueScroller from 'vue-scroller';
Vue.use(VueScroller);

import '@components/vue-toast/index.css';
import Toast from '@components/vue-toast';
Vue.use(Toast);

Vue.prototype.$http = axios;

Vue.use(bus);

var vm = new Vue({
  components: {
    App
  },
  template: '<App/>'
}).$mount('#app');

document.body.addEventListener(
  'touchmove',
  function(evt) {
    //In this case, the default behavior is scrolling the body, which
    //would result in an overflow.  Since we don't want that, we preventDefault.
    if (evt.target.id == 'draw-canvas') {
      evt.preventDefault();
    }
  },
  { passive: false }
);

// var u = navigator.userAgent;

// var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端

// var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

// if (isiOS) {
//   document.body.addEventListener(
//     'touchmove',
//     function(e) {
//       e.preventDefault();
//     },
//     { passive: false }
//   );
// }
