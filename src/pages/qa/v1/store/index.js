/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-03
 * @des
 */
import Vuex from 'vuex';
import Vue from 'vue';
import mutations from './mutations';
import actions from './action';

Vue.use(Vuex);

const state = {
  records:[], // 答题记录
  lastRecord: {}, // 上一条答题记录
  currentNum: 1, // 当前题目编号
  itemNum: 1, // 第几题
  allTime: 0,  //总共用时
  timer: '', //定时器
  // testResult: 0, // 测试结果
  configData: {
    theme: '你知道自己适合什么类型的人吗',
    introduce: '',
    userImg: '',
    nickName: '',
    downloadUrl: '',
    hasAnswer: 0,
    questions: {},
    answers: {},
    shareUrl: '#',
    unlockNum: 0,
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})