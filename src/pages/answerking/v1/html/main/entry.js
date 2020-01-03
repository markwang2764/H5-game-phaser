/*
 * @Author: miaokefu@duiba.com.cn 
 * @Date: 2018-07-24 20:24:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-05 16:19:41
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router/index';
import axios from 'axios';
import '../../style/entry.less';
import Embed from '../../components/embed';
import bus from '@components/bus/index';

console.log('time= 1606')

let embed = new Embed();
embed.init();
Vue.prototype.$embed = embed;

Vue.prototype.$http = axios;

Vue.use(VueRouter);
Vue.use(bus);
const router = new VueRouter({
  routes: routes
});

var vm = new Vue({
  router
}).$mount('#app');