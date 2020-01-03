/*
 * @Author: miaokefu@duiba.com.cn 
 * @Date: 2018-07-25 10:12:24 
 * @Last Modified by: miaokefu@duiba.com.cn
 * @Last Modified time: 2018-07-31 16:46:22
 */
let path = '/answerking';

module.exports = {
  get: {
    '/youtui/questionKing/findQuestionList': path + '/getConfig',
    '/youtui/questionKing/getCDK': path + '/getCDK',
    '/youtui/questionKing/getEmbed': path + '/getEmbed',
    '/youtui/questionKing/checkAnswer': path + '/checkAnswer',
    '/youtui/questionKing/getShareUrl': path + '/getShareUrl'

  },
  post: {}
};