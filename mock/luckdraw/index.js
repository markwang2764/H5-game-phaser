/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */
let path = '/luckdraw';

module.exports = {
  get: {
    '/youtui/sendPrize/index': path + '/sendPrize',
    '/youtui/sendPrize/getEmbed': path + '/getEmbed',
    '/youtui/sendPrize/doJoin': path + '/common',
    '/youtui/system/getDownloadUrl': path + '/down',
  },
  post: {}
};