/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-03
 * @des
 */
const ADD_ITEM_NUM = 'ADD_ITEM_NUM';
const SUB_ITEM_NUM = 'SUB_ITEM_NUM';
const REMEMBER_ANWSER = 'REMEMBER_ANWSER';
const SUB_ANSWER = 'SUB_ANSWER';
const REMEMBER_TIME = 'REMEMBER_TIME';
const INITIALIZE_DATA = 'INITIALIZE_DATA';
const SET_CONFIG_DATA = 'SET_CONFIG_DATA';
const SAVE_RESULT = 'SAVE_RESULT';

export default {
  // 答题数+1
  [ADD_ITEM_NUM](state, {num, nextNum}) {
    state.itemNum += num;
    state.currentNum = nextNum;
  },
  [SUB_ITEM_NUM](state, {num}) {
    state.itemNum -= num;
    state.currentNum = state.records[state.records.length - 1].qid;
  },
  //记录答案
  [REMEMBER_ANWSER](state, {qid, aid}) {
    console.log(qid, aid)
    state.records.push({qid: qid, aid: aid});
  },
  // 删除答案记录
  [SUB_ANSWER](state) {
    state.lastRecord =  state.records.pop();
  },
  /*
  记录做题时间
   */
  [REMEMBER_TIME](state) {
    state.timer = setInterval(() => {
      state.allTime++;
    }, 1000)
  },
  /*
  初始化信息，
   */
  [INITIALIZE_DATA](state) {
    state.itemNum = 1;
    state.currentNum = 1;
    state.allTime = 0;
    state.records = [];
    state.lastRecord = {};
  },
  [SET_CONFIG_DATA](state, configData) {
    state.configData.introduce = configData.introduce;
    state.configData.userImg = configData.userImg;
    state.configData.nickName = configData.nickName;
    state.configData.questions = configData.questions;
    state.configData.answers = configData.answers;
    state.configData.downloadUrl = configData.downloadUrl;
    state.configData.hasAnswer = configData.hasAnswer;
    state.configData.shareUrl = configData.shareUrl;
    state.configData.unlockNum = configData.unlockNum;
  },
  [SAVE_RESULT](state, result) {
    state.timer && clearInterval(state.timer);
    state.timer = null;

    console.log(result)
    state.configData.hasAnswer = result;
  }
}

