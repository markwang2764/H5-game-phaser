/**
 * @desc:
 * @author : Dec-F
 * @Date : 2018-08-01 11:35:27
 * @Last Modified by: Dec-F
 * @Last Modified time: 2018-08-06 18:39:47
 */
let path = '/activity/drawGuess';

module.exports = {
  get: {
    '/youtui/paintAndGuess/getPaintTheme': path + '/theme',
    '/youtui/paintAndGuess/getPainting': path + '/painting',
    '/youtui/paintAndGuess/getAnswerList': path + '/list',
    '/youtui/paintAndGuess/calculateBonus': path + '/bonus',
    '/youtui/paintAndGuess/updateNickName': '/common/post',
    '/youtui/paintAndGuess/selectBonus': path + '/bonus',
    '/youtui/share/getPaintGuessShareUrl': '/common/post',
    '/youtui/log/youtuiEmbedLog': '/common/post',
    '/youtui/paintAndGuess/getEmbed':path+'/getEmbed'
  },
  post: {
    '/youtui/paintAndGuess/finishPainting': '/common/post',
    '/upload/uploadPicByBase64': '/common/post'
  }
};
