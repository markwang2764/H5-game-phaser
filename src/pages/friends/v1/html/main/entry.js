import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router/index';
import axios from 'axios';
import '../../style/entry.less';
import Embed from '../../components/embed';


let embed = new Embed();
embed.init();
Vue.prototype.$embed = embed;
Vue.prototype.$http = axios;

Vue.use(VueRouter);
const router = new VueRouter({routes: routes});
var vm = new Vue({
  router,
}).$mount('#app');


