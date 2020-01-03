/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */
let path = '/qa';

module.exports = {
  get: {
    '/youtui/context/getConfig': path + '/getConfig',
    '/youtui/context/unlock': path + '/unlock',
    '/youtui/context/setAnswer': path + '/setAnswer',
    '/youtui/context/getUnlockCount': path + '/getUnlockCount',
    '/youtui/context/getConfig2': path + '/getConfig2',
    '/youtui/context/getWxConfig': path + '/getWxConfig'
  },
  post: {}
};