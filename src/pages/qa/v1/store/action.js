/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-03
 * @des
 */
export default {
  /**
   *点击进入下一题
   * @param commit
   * @param state
   * @param payload {qid, aid, nextNum} qid 问题id, aid 答案id, nextNum 下一题id
   */
  addNum({ commit, state}, {qid,aid,nextNum}) {
    console.log(qid, aid, nextNum)
    commit('REMEMBER_ANWSER', {
      qid: qid ,
      aid:aid
    });
    // if (state.itemNum < state.itemDetail.length) {
      commit('ADD_ITEM_NUM', {
        num: 1,
        nextNum: nextNum
      });
    // }
  },

  /**
   * 返回上一题
   * @param commit
   * @param state
   */
  subNum({commit, state}) {
    // 先读取上一题信息，再删除记录
    commit('SUB_ITEM_NUM', {
      num:1
    });
    commit('SUB_ANSWER');

  },

  initializeData({ commit }) {
    commit('INITIALIZE_DATA');
  },

  setConfigData({commit}, configData) {
    commit('SET_CONFIG_DATA', configData);
  },

  saveResult({commit}, result) {
    commit('SAVE_RESULT', result);
  }

}