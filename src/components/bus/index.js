/**
 * 绑定   this.$bus.$on('refresh', () => {
 *          this.fetchData();
 *        });
 * 解绑   this.$bus.$off('refresh');
 * 触发   this.$bus.$emit('refresh');
 */

import Vue from 'vue';
let bus = new Vue();

const install = (Vue, opts = {}) => {
  Vue.prototype.$bus = bus;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default install;
