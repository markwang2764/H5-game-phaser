import '../../entry.less';
import './entry.less';
import { embed } from "../../page/main/main";
import toast from '../../../../../components/toast/2.0.0'
import * as utils from '@js/utils';
import { isWeiXin, isAndroid } from '../../../../../common/js/utils';
$(function() {
    
  
    if(utils.getUrlParameter('isPreview')) embed(15,'端内访问')
    embed(901,'进入下载落地页',{bonus:info.mom})
    //调接口获取信息
    getInfo();
    //隱藏
    $('.download-guide').css('display', 'none')
    //监听
    $('.todownload-page .mask').click(function () {
        closeDownloadGuide()
    })
    $('.todownload-page .button').click(function () {
        embed(902,'点击下载落地页按钮',{bonus:info.mom})
        showDownloadGuide()
    })
    $('.code-content').click(function () {
        toast.make('复制成功');
        embed(904,'下载落地页点击复制按钮',{layer_type:2,bonus:info.mom})
    })
    clipCode();
})
//获取金额、邀请码、分流
function getInfo() {
    //获取金额、邀请码、分流
    utils.httpGetPromise({
        url: '/youtui/article/getCDK',//获取金额和激活码分配的接口
        data: {// 需要传给后端的数据
            id: utils.getUrlParameter('id')
        }
    }).then((res) => {
        //获取到的数
        console.log('get info', res)
        info.money = res.data.amount
        info.mom = res.data.amount
        info.code = res.data.cdKey
        info.pageType = res.data.pageType
        switch (info.money){
            case 388 : info.money='one';break;
            case 588 : info.money='two';break;
            case 888 : info.money='three';break
        }
        $('.code-content .code').text(info.code)
        $('#money-content').addClass(info.money)
   
        let channelString = info.pageType ? 'yysc-cc-friendrb' : 'yysc-cc-friendra'
   
        $.ajax({
            url: '/youtui/system/getDownloadUrl?channelString='+channelString,
            type: 'get',
            dataType: 'json',
            success: function (result) {
              if (result.success) {
                  let dowlondUrl = result.data
                  if (isAndroid() && !isWeiXin()) {
                  setTimeout(() => {
                    embed(10, '下载', {
                        loadpage_source_type: 1,
                        Bonus: info.mom
                    })
                      window.location.href = dowlondUrl
                    //   $('body').append('<div class=\'maskall\'></div>')
                    //   $('.small-bag').hide()
                      $('.todownload-page').hide()
                      
                  }, 120);
                } else {
                //   $('.page').show()
                  // if (getUrlParameter('appPreview')==1) {
                  //   embed(15, false, (res) => {
                  //     console.log('pengyouquan mandian chenggong')
                  //   })
                  // } else {
                  //   embed(1, false, (res) => {
                  //     console.log('pengyouquan mandian chenggong')
                  //   })
                  // }
                }
              }
            },
            error: function error () {
              console.log('获取链接失败');
            }
          });
    }).catch((res) => {
        console.log('get info error', res)
    });
}
//弹出蒙层
function showDownloadGuide() {
    embed(903,'进入落地页蒙层',{layer_type:2,bonus:info.mom})
    console.log('showDownloadGuide')
    $('.download-guide').css('display', 'block')
}

function closeDownloadGuide() {
    console.log('closeDownloadGuide')
    $('.download-guide').css('display', 'none')
}
//复制到剪切板
function clipCode() {
    let clipboard = new ClipboardJS('.code-content');
   
    // clipboard.on('success', function(e) {
    //     toast('复制成功')
    //     e.clearSelection();
    // });
    // clipboard.on('error', function (e) {
    //     toast('复制失败!')
    // });
}
//
let info={
    money:'one',
    code: 'xxxxxx',
    mom: '388',
    pageType: 0
}
//http://172.16.35.91:4000/friendsArticle/v1/page/download/entry.html?sessionKey=nFgB812fsKrM9TULeLiCEuGu1HNhvrdQ6kUoGu6QY&id=4




