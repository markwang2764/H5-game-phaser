import {getUrlParameter} from '../components/utils';
import axios from 'axios';

/**
 * 获取所有题目及其他数据
 */
export const getDowlondUrl = () => axios.get('/youtui/system/getDownloadUrl');


/** *用于获得当前连接url用**/
/** *用户点击分享到微信圈后加载接口接口*******/
export const getWxConfig = (url) => axios.get('/youtui/context/getWxConfig', {
  params: {
    sessionKey: getUrlParameter('sessionKey'),
    sourceToken: getUrlParameter('sourceToken'),
    url: url
  }
});

