/**
 * @desc:
 * @author : Dec-F
 * @Date : 2018-07-23 14:15:52
 * @Last Modified by: Dec-F
 * @Last Modified time: 2018-07-23 14:18:29
 */

import Vue from 'vue';

import axios from 'axios';
import bus from '@components/bus/index';
import '../../style/entry.less';
import App from './App';

Vue.prototype.$http = axios;

Vue.use(bus);

var vm = new Vue({
  components: {
    App,
  },
  template: '<App/>',
}).$mount('#app');
