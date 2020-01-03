/*
 * @Author: miaokefu@duiba.com.cn 
 * @Date: 2018-07-25 14:55:23 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-05 16:19:38
 */
import {getUrlParameter} from '@js/utils';
import axios from 'axios';

const baseGet  = (url, data)=> axios.get(url, {params: {
  sessionKey: getUrlParameter('sessionKey'),
  sourceToken: getUrlParameter('sourceToken'),
  sourceUserId: getUrlParameter('sourceUserId'),
  ...data
}});

const basePost  = (url, data)=> axios.post(url,  {
  sessionKey: getUrlParameter('sessionKey'),
  sourceToken: getUrlParameter('sourceToken'),
  sourceUserId: getUrlParameter('sourceUserId'),
  ...data
});


/**
 * 获取所有题目及其他数据
 */
export const getConfig = () => baseGet('/youtui/questionKing/findQuestionList', {
    consumerIdOrder: getUrlParameter('consumerIdOrder'),
});

/**
 * cdk
 */
export const getCDK = () => baseGet('/youtui/questionKing/getCDK',{
    id: getUrlParameter('id')
});

/**
 * 埋点数据
 */
export const getEmbed = () => baseGet('/youtui/questionKing/getEmbed', {
    share_way: getUrlParameter('share_way'),
    consumerIdOrder: getUrlParameter('consumerIdOrder'),
    appPreview: getUrlParameter('appPreview'),
    id: getUrlParameter('id')
});

export const checkAnswer = (questionId, userAnswerId) => baseGet('/youtui/questionKing/checkAnswer', {
    questionId: questionId,
    userAnswerId: userAnswerId
});

export const getShareInfo = (bonus) => baseGet('/youtui/questionKing/getShareUrl', {
    id: getUrlParameter('id'),
    consumerIdOrder: getUrlParameter('consumerIdOrder'),
    bonus: bonus
});

export const getDownloadUrl = (channel) => baseGet('/youtui/system/getDownloadUrl', {
    channelString: channel
});

/** *用于获得当前连接url用**/
/** *用户点击分享到微信圈后加载接口接口*******/
export const getWxConfig = (url) => baseGet('/youtui/context/getWxConfig', {
    url: url
  });

// 获取app端内分享信息
export const getAppShareInfo = () => baseGet('/youtui/content/share', {
    contentId: getUrlParameter('id'),
    contentType:getUrlParameter('contentType'),
    shareFrom: 1 // 固定为1 点击分享来源（0：app卡片；1：预览页）
});

/**
 * 通用分享信息接口
 * @param {*} extParam 扩展参数
 */
export const getCommonShare = (extParam) => baseGet('/youtui/share/commonShareUrl', {
    contentId: getUrlParameter('id'),
    contentType:getUrlParameter('contentType'),
    consumerIdOrder: getUrlParameter('consumerIdOrder'),
    ...extParam  
});