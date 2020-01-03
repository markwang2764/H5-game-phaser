/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */
let path = '/common';

module.exports = {
  get: {
    '/game/loginTime': path + '/loginTime',
    '/advert/getAdvert': path + '/getAdvert',
    '/advert/getCustomAdvert': path + '/getCustomAdvert',
    '/puzzle/getPrize': path + '/getPrize',
    '/youtui/system/getDownloadUrl': path + '/getDownloadUrl',
    '/youtui/ab/getLand': path + '/getLand',
    '/youtui/content/share': path + '/share',
    '/youtui/share/commonShareUrl': path + '/commonShareUrl'
  },
  post: {
    '/consumer/commonLogin': path + '/commonLogin',
    '/consumer/commonLogin2': path + '/commonLogin2',
    '/puzzle/clickPuzzleAdvert': path + '/clickPuzzleAdvert'
  }
};