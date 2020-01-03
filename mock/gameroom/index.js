/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */
let path = '/gameroom';

module.exports = {
  get: {
    '/direct/getAnnouncement': path + '/getAnnouncement',
    '/direct/getDengqin': path + '/getDengqin-3',
    '/direct/getDuibaUrl': path + '/getDuibaUrl',
    '/direct/getGameHallEmbed': path + '/getGameHallEmbed',
    '/direct/getGameHallEmbed2': path + '/getGameHallEmbed2',
    '/direct/getNewGameHallEmbed': path + '/getNewGameHallEmbed',
    '/common/getUserAmount': path + '/getUserAmount',
    '/common/cashUserAmount': path + '/cashUserAmount',
    '/game/getBubbleInfo': path + '/getBubbleInfo',
    '/game/fishTask': path + '/fishTask',
    '/game/getTaskResult': path + '/getTaskResult',
  },
  post: {}
};