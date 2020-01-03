/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-09
 * @des
 */
import {getUrlParameter} from '../components/utils';
import axios from 'axios';

/**
 * 获取所有题目及其他数据
 */
export const getConfig = () => axios.get('/youtui/context/getConfig', {
  params: {
    sessionKey: getUrlParameter('sessionKey'),
    sourceToken: getUrlParameter('sourceToken'),
    sourceUserId: getUrlParameter('sourceUserId'),
    sourceId: getUrlParameter('sourceId'),
    sourceType: getUrlParameter('sourceType'),
    share_way: getUrlParameter('share_way'),
    pageShareType: getUrlParameter('pageShareType')
  }
});

/**
 * 分享出去的页面配置数据
 */
export const getConfig2 = () => axios.get('/youtui/context/getConfig2', {
  params: {
    sessionKey: getUrlParameter('sessionKey'),
    sourceToken: getUrlParameter('sourceToken'),
    sourceUserId: getUrlParameter('sourceUserId'),
    sourceId: getUrlParameter('sourceId'),
    sourceType: getUrlParameter('sourceType'),
    share_way: getUrlParameter('share_way'),
    pageShareType: getUrlParameter('pageShareType')
  }
});

/**
 * 获取解锁的数量
 */
export const getUnlockCount = () => axios.get('/youtui/context/getUnlockCount', {
  params: {
    sessionKey: getUrlParameter('sessionKey'),
    sourceToken: getUrlParameter('sourceToken')
  }
});

/**
 * 解锁
 */
export const unlock = () => axios.get('/youtui/context/unlock', {
  params: {
    sessionKey: getUrlParameter('sessionKey'),
    sourceToken: getUrlParameter('sourceToken'),
    sourceUserId: getUrlParameter('sourceUserId'),
    pageShareType: getUrlParameter('pageShareType')
  }
});

/**
 * 提交结果
 * @param rid
 */
export const setAnswer = (rid) => axios.get('/youtui/context/setAnswer', {
  params: {
    sessionKey: getUrlParameter('sessionKey'),
    sourceToken: getUrlParameter('sourceToken'),
    answerId: rid
  }
});

/** *用于获得当前连接url用**/
/** *用户点击分享到微信圈后加载接口接口*******/
export const getWxConfig = (url) => axios.get('/youtui/context/getWxConfig', {
  params: {
    sessionKey: getUrlParameter('sessionKey'),
    sourceToken: getUrlParameter('sourceToken'),
    url: url
  }
});

