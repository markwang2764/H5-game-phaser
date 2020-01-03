import {getUrlParameter, parseUrlParams} from '@js/utils';

const auth = ()=>{
    let urlParams = parseUrlParams();
    let wxAuth = `https://open.weixin.qq.com/connect/oauth2/authorize`;
    let appid = `wx231876932416d2c7`;
    // 预发：youtui-pre.tuia.cn/youtui/temporary/getWxUserInfo
    // 线上：activity.qushaio.com/youtui/temporary/getWxUserInfo
    let redirectUrl = encodeURIComponent(`${location.origin}/youtui/temporary/getWxUserInfo4extreme`);
    let state = [];
    let userId = '';
    if (window.CFG && CFG.userId) {
        userId = CFG.userId;
    }
    var obj = urlParams;
    obj.userId = userId;
    var str = JSON.stringify(obj);
    // state.push('extreme');
    // state.push(JSON.stringify(urlParams));
    // state.push(userId);
    // state = state.join(',');
    console.log(JSON.stringify(CFG));
    setTimeout(() => {
        location.href = `${wxAuth}?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=${str}#wechat_redirect`
    }, 10);
}

auth();

