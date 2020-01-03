/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */
/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-02
 * @des
 */
let path = '/game';

let eventsQuizzes = '/events-quizzes';
let soap = '/soap';
let chicken = '/chicken';

module.exports = {
  get: {
    '/consumer/getNickName': path + '/getNickName',
    '/hotGuess/getList': path + eventsQuizzes + '/getList',
    '/hotGuess/getEmbed': path + eventsQuizzes + '/getEmbed',
    '/hotGuess/getUserBetHistory': path + eventsQuizzes + '/getUserBetHistory',

    '/fish/getFishEmbed': path + '/getFishEmbed',
    '/fish/startGame': path + '/fishStartGame',
    '/fish/getWinPublic': path + '/getWinPublic',
    '/fish/singleDoJoin': path + '/singleDoJoin',
    '/fish/getResult': path + '/getResult',
    '/fish/getRank': path + '/getRank',
    '/fish/getRankList': path + '/getRankList',
    '/fish/killTreasureBox': path + '/killTreasureBox',
    '/game/getFishEmbed': path + '/getFishEmbed',
    '/game/startGame': path + '/startGame',
    '/game/getWinPublic': path + '/getWinPublic',
    '/game/singleDoJoin': path + '/singleDoJoin',
    '/game/getResult': path + '/getResult',
    '/game/getRank': path + '/getRank',
    '/game/getRankList': path + '/getRankList',
    '/common/getChickenEmbed': path + '/getChickenEmbed',
    '/common/getChickenGift': path + '/getChickenGift',
    '/common/getChickenTaskResult': path + '/getChickenTaskResult',
    '/common/getChickenGameGuideUrl': path + '/getChickenGameGuideUrl',

    '/youtui/extreme/startGame': [path + '/getStartGame', "172.16.35.160:17801"],
    '/youtui/extreme/completeGame': [path + '/getCompleteGame', "172.16.35.160:17801"],
    '/youtui/extreme/getRank': [path + '/getFocusRank', "172.16.35.160:17801"],
    '/youtui/extreme/upRate': [path + '/getFocusRank', "172.16.35.160:17801"],
    '/youtui/extreme/switchGameMode': [path + '/getFocusRank', "172.16.35.160:17801"],
    '/youtui/extreme/getEmbed': [path + '/getFocusRank', "172.16.35.160:17801"],
    '/youtui/extreme/getMyRecord': [path + '/getFocusRank', "172.16.35.160:17801"],
    '/youtui/extreme/balanceDetail': [path + '/getFocusRank', "172.16.35.160:17801"],

    // '/youtui/extreme/startGame': path + '/getStartGame',
    // '/youtui/extreme/completeGame': path + '/getCompleteGame',
    // '/youtui/extreme/getRank': path + '/getFocusRank',
    // '/youtui/extreme/upRate': path + '/getFocusRank',
    // '/youtui/extreme/switchGameMode': path + '/getFocusRank',
    // '/youtui/extreme/getEmbed': path + '/getFocusEmbed',
    // '/youtui/extreme/getMyRecord': path + '/getFocusRank',
    // '/youtui/extreme/balanceDetail': path + '/getFocusRank',

    '/soap/getGameRule': path + '/getGameRule',
    '/soap/getIndexEmbed': path + '/getIndexEmbed',
    '/soap/startGame': path + '/soapStartGame',
    '/soap/getProps': path + '/getProps',
    '/soap/getResult': path + '/soapGetResult',
    '/soap/updateResult': path + '/soapUpdateResult',
    '/soap/nextCheckpoint': path + '/nextCheckpoint',
    '/fish/fishTaskReward': path + '/fishTaskReward',
    '/fish/getFishTaskResult': path + '/getFishTaskResult',
    '/third/V1/getAdvert': path + '/ads',
    '/common/getGameGuideInfo': path + '/getGameGuideInfo',

    '/common/getChickenBarrage': path + chicken + '/barrage'
  },
  post: {
    '/consumer/commonLogin': path +'/commonLogin',
    '/hotGuess/guess': path + eventsQuizzes + '/guess',
    '/soap/updateResult': path + soap +'/updateResult',
    '/soap/useProps': path + soap + '/useProps'
  }
};