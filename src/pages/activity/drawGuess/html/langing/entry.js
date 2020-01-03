/**
 * @desc:
 * @author : Dec-F
 * @Date : 2018-07-23 14:15:52
 * @Last Modified by: Dec-F
 * @Last Modified time: 2018-08-08 16:16:39
 */

import Vue from 'vue';

// var VConsole = require('vconsole/dist/vconsole.min');
// var vConsole = new VConsole();

import axios from 'axios';
import bus from '@components/bus/index';
import App from './App';

import '@components/vue-toast/index.css';
import Toast from '@components/vue-toast';
Vue.use(Toast);

Vue.use(bus);

var vm = new Vue({
  components: {
    App
  },
  template: '<App/>'
}).$mount('#app');
