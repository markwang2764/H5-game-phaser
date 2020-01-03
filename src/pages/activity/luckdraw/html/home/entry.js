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
import '@css/common.less';
import App from './App';
import Embed from '../../components/embed';

let embed = new Embed();
embed.init();
Vue.prototype.$embed = embed;

Vue.prototype.$http = axios;

Vue.use(bus);

var vm = new Vue({
  components: {
    App,
  },
  template: '<App/>',
}).$mount('#app');
