import * as utils from '@js/utils';
import toast from '@components/toast/2.0.0'
import {isAndroid, isWeiXin} from "../../../../../common/js/utils";


//控制页面弹窗
function closeToshare() {
    console.log('closeToshare');
    $('.toshare-page').hide()
    $('.small-bag').show()
}

function showToshare() {
    console.log('showToshare');
    $('.toshare-page').show()
    $('.small-bag').hide()
}

function closeMask() {
    console.log('closeMask');
    $('.toshare-page .mask').hide()
    $('.small-bag').show()
}

function showShareTip() {
    console.log('showShareTip')
    $('.share-tip').show()

}

function closeShareTip() {
    console.log('closeShareTip')
    $('.share-tip').hide()
}

function closeShared() {
    console.log('closeShared');
    $('.shared-page').hide()
    $('.small-bag').show()
}

function showShared() {
    console.log('showShared');
    $('.shared-page').show()
    $('.small-bag').hide()
}

function showBag() {
    console.log('showBag')
    $('.toshare-page .big-bag').show()
}

function showDownloadTip() {
    embed(903, '进入下载蒙层', {
        layer_type: 1,
        bonus: info.money
    })
    console.log('showDownloadTip')
    $('.download-tip').show()
}

function closeDownloadTip() {
    console.log('closeDownloadTip')
    $('.download-tip').hide()
}

//初始状态
export function init() {
    //先隐藏
    if (!isAnimate && !isShare) {
        $('.toshare-page').hide()
        $('.toshare-page .big-bag').hide()
        $('.shared-page').hide()
        $('.small-bag').show()
        $('.share-tip').hide()
        $('.download-tip').hide()
    } else if (isAnimate && !isShare) {
        $('.toshare-page').hide()
        $('.toshare-page .mask').hide()
        $('.shared-page').hide()
        $('.small-bag').show()
        $('.share-tip').hide()
        $('.download-tip').hide()
    } else {
        $('.toshare-page').hide()
        $('.shared-page').hide()
        $('.small-bag').show()
        $('.share-tip').hide()
        $('.download-tip').hide()
    }
    //监听
    $('.page .button').click(function () {
        embed(8, '点击分享提现按钮(page文章页面上的“分享赚钱”按钮)', {
            share_source: 1,
            bonus: info.money
        })
        if (isShare) {
            showShared()
        } else {
            showToshare()
            showShareTip()
            // $('.small-bag').hide()
            // $('.share-tip-outer').show()
        }
    })
    // $('.share-tip-outer').click(function () {
    //      $('.small-bag').show()
    //     $('.share-tip-outer').hide()
    // })
    //------------------------------to share js
    $('.toshare-page .mask .close').click(function () {
        embed(103, '未分享点击关闭按钮(mask)')
        isClickMaskClose = 1;
        closeToshare()
        closeMask()
        showBag()
    });
    $('.toshare-page .mask').click(function () {
        closeShareTip()
    })
    //---------------------------- to share big bag js
    $('.toshare-page .button').click(function (e) {
        embed(8, '点击分享提现按钮(bigbag)', {
            share_source: 1,
            bonus: info.money
        })
        showShareTip()
        e.stopPropagation()
    })
    $('.toshare-page .omask').click(function () {
        closeShareTip()
    })
    $('.toshare-page .omask .close').click(function (e) {
        embed(401, '未分享点击关闭按钮(bigbag)', {
            bonus: info.money
        })
        closeToshare()
    })
    //----------------------------  shared big bag js
    $('.shared-page .button').click(function (e) {
        embed(9, '点击立即提现', {
            bonus: info.money
        })
        if (!utils.isAndroid()) {
            toast.make("抱歉，iOS版本还在全力研发中，敬请期待~");
        } else {
            if (info.downloadType) {
                showDownloadTip()
            } else {
                const str = `?id=${utils.getUrlParameter('id')}&shareUserId=${utils.getUrlParameter('shareUserId')}&consumerIdOrder=${utils.getUrlParameter('consumerIdOrder')}&share_way=${utils.getUrlParameter('share_way')}&appPreview=${utils.getUrlParameter('appPreview')}&sourceUserId=${utils.getUrlParameter('sourceUserId')}&sourceToken=${utils.getUrlParameter('sourceToken')}&sessionKey=${utils.getUrlParameter('sessionKey')}`
                window.location.href = '/youtui/ab/getHotCircleDownload' + str
            }
        }
        // e.stopPropagation()
    })
    $('.download-tip .mask').click(function () {
        closeDownloadTip()
    })
    $('.shared-page .omask .close').click(function () {
        embed(802, '已分享点击关闭按钮')
        closeShared()
    })
    $('.download-tip .main').click(function (e) {
        e.stopPropagation()
    })
    //-------------------------------small bag JS
    $('.small-bag .main').click(function () {


        isAnimate = utils.getStorage('isAnimate')
        if (isAnimate) {
            setTimeout(() => {
                if (!isClickMaskClose) {
                    embed(4, 'jie guo ye first', {
                        bonus: info.money
                    })
                } else {
                    console.log('guan bi le dong hua')
                }
            }, 2000);
            embed(101, '点击小红包again', {
                page_type: 2
            })

            isShare = utils.getStorage('isShare')
            if (isShare) {
                showShared()
            } else {
                showToshare()
            }
        } else {
            embed(101, '点击小红包first', {
                page_type: 1
            })
            utils.setStorage('isAnimate', 1)
            showToshare()
        }
    })
    //-------------------------------
    $('.download-tip .btn-content').click(function () {
        toast.make('复制成功');
        embed(904, '蒙层点击复制按钮', {
            layer_type: 1,
            bonus: info.money
        })
    })

}

//获取金额、邀请码、分流、页面状态
export function getInfo() {

    //本地缓存 标示是否弹出过红包 是否分享成功
    if (!utils.getStorage('isAnimate')) {
        isAnimate = 0
    } else {
        isAnimate = utils.getStorage('isAnimate')
    }
    if (!utils.getStorage('isShare')) {
        isShare = 0
    } else {
        isShare = utils.getStorage('isShare')
    }
    //获取金额、邀请码、分流
    $.ajax({
        url: '/youtui/article/getCDK',
        data: { // 需要传给后端的数据
            sessionKey: utils.getUrlParameter('sessionKey'),
            sourceToken: utils.getUrlParameter('sourceToken'),
            sourceUserId: utils.getUrlParameter('sourceUserId'),
            id: utils.getUrlParameter('id')
        },
        type: 'get',
        dataType: 'json',
        success: function success(res) {
            console.log('getinfo成功')
            info.money = res.data.amount / 100
            info.code = res.data.cdKey
            info.downloadType = res.data.pageType
            $('.money-content').text(info.money)
            $('.code-content .code').text(info.code)
         
            let channelString = info.downloadType ? 'yysc-cc-friendrb' : 'yysc-cc-friendra'
            $.ajax({
                url: '/youtui/system/getDownloadUrl?channelString=' + channelString,
                type: 'get',
                dataType: 'json',
                success: function (result) {
                    if (result.success) {
                  
                        let dowlondUrl = result.data
                        alert('二')
                        alert(dowlondUrl)
                        if (isAndroid() && !isWeiXin()) {
                            setTimeout(() => {
                                embed(10, '下载', {
                                    loadpage_source_type: 2,
                                    Bonus: info.money
                                })
                                window.location.href = dowlondUrl

                            }, 120);
                        }
                    }
                },
                error: function error() {
                    console.log('获取链接失败');
                }
            });
        },
        error: function error() {
            console.log('埋点失败');
        }
    });

}

//发起分享
export function wxShare() {
    let data = {
        contentType: 2,
        contentId: utils.getUrlParameter('id'),
        consumerIdOrder: utils.getUrlParameter('consumerIdOrder'),
        sourceUserId: utils.getUrlParameter('sourceUserId'),
        sourceToken: utils.getUrlParameter('sourcesToken'),
        sessionKey: utils.getUrlParameter('sessionKey')
    }
    $.ajax({
        url: '/youtui/share/commonShareUrl',
        data: data,
        type: 'get',
        dataType: 'json',
        success: function success(result) {
            // console.log('share 获取数据成功', result)
            let opts = result.data
            let shareData = {
                title: opts.title, //'分享标题',
                desc: opts.desc, //'分享描述',
                link: opts.clickUrl, //'分享链接，该链接域名必须与当前企业的可信域名一致'
                // type: 分享类型,music、video或link，不填默认为link,
                // dataUrl: 如果type是music或video，则要提供数据链接，默认为空,
                imgUrl: opts.picUrl, // 分享图标
                success: function () {
                    toast.make('分享成功');
                    finishShare();
                },
                //用户取消分享后执行的回调函数
                cancel: function () {
                    toast.make('取消分享');
                }
            };
            //分享到好友
            wx.onMenuShareAppMessage(shareData);
            //分享到朋友圈
            wx.onMenuShareTimeline(shareData);
            //分享到qq
            wx.onMenuShareQQ(shareData);
            wx.error(function (res) {
                alert(JSON.stringify(res));
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        },
        error: function error() {
            console.log('share 获取数据失败');
        }
    });

}

//分享成功
export function finishShare() {

    embed(801, '分享成功返回红包', {
        bonus: info.money,
    })

    $('.toshare-page').hide()
    $('.share-tip').hide()
    $('.shared-page').show()
    utils.setStorage('isShare', 1)
}

//复制到剪切板
export function clipCode() {
    let clipboard = new ClipboardJS('.btn-content');

}

//自动复制到剪切板
export function autoClip() {
    new ClipboardJS('.shared-page .button');
}

//全局变量
let isShare = 0
let info = {
    money: 'xxx',
    code: 'xxxxxxxxxx',
    downloadType: '',
}
let isAnimate
let isClickMaskClose = 0
//http://172.16.35.91:4000/friendsArticle/v1/entry.html?sessionKey=nFgB812fsKrM9TULeLiCEuGu1HNhvrdQ6kUoGu6QY&id=4

export const embed = (type, tip, obj) => {
    let consumerIdOrder
    if (utils.getUrlParameter('appPreview') == 1) {
        consumerIdOrder = 0
    } else {
        consumerIdOrder = 1
    }
    let commonData = {
        type: type,
        contentType: 2,
        contentId: utils.getUrlParameter('id'),
        shareUserId: utils.getUrlParameter('shareUserId'),
        consumerIdOrder: utils.getUrlParameter('consumerIdOrder') || consumerIdOrder,
        share_way: utils.getUrlParameter('share_way'),
        appPreview: utils.getUrlParameter('appPreview') || '',
        sourceUserId: utils.getUrlParameter('sourceUserId'),
        sourceToken: utils.getUrlParameter('sourceToken'),
        sessionKey: utils.getUrlParameter('sessionKey')
    };
    let finalData = commonData
    if (obj) {
        finalData = Object.assign({}, commonData, obj)
    }

    $.ajax({
        url: '/youtui/log/embedContentLogs',
        data: finalData,
        type: 'get',
        dataType: 'json',
        success: function success(result) {
            console.log('埋点成功')
        },
        error: function error() {
            console.log('埋点失败');
        }
    });
}

