/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-03
 * @des
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router/index';
import axios from 'axios';
import '../../style/entry.less';

Vue.prototype.$http = axios;

Vue.use(VueRouter);
const router = new VueRouter({
  routes: routes
});

var vm = new Vue({
  router
}).$mount('#app');

// if (module.hot) {
//   // mutation 成为可热重载模块
//   module.hot.accept(['../../store/mutations'], () => {
//     const newMutations = require('../../store/mutations').default;
//     // 加载新模块
//     store.hotUpdate({
//       mutations: newMutations
//     })
//   })
// }
