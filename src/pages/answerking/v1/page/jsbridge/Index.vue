<template>
    <div class="jsbridge-page">
        <div class="btn" @click="share(0)">分享-弹窗不带预览-画</div>
        <div class="btn" @click="share(1)">分享-弹窗带预览-画</div>
        <div class="btn" @click="share(2, undefined, 3)">分享-直接分享-画</div>
        <div class="btn" @click="share(0, 1)">分享-不画</div>

        <div class="btn" @click="open">打开端内uri</div>
        <div class="btn" @click="controlToolbar"> 控制toolbar</div>
        <div class="btn" @click="closeWeb">关闭webview</div>
        <div class="btn" @click="openBroswer">打开外部浏览器</div>
        <div class="btn" @click="getAppInfo">获取app用户信息</div>
        <div class="btn" @click="copyTxt">复制到剪贴板</div>
    </div>
</template>

<script>

import {getUrlParameter} from '@js/utils';
import bridge from '@components/bridge/index';


const  shareData = {
               "desc": "desc",
                "imgUrl": "http://werqq21/123213",
                "qRCodePoint": {
                    "height": 10,
                    "leftTopX": 10,
                    "leftTopY": 10,
                    "width": 10
                },
                "shareContentType": 2,
                "shareUrl": "http://share/uwercd",
                "title": "title",
                "needDraw": 0
            }
export default {
    name: 'bridge',

    data() {
        return {
            inApp: false,
            toolbarShow: true,
            shareData: {}
        }
    },

    methods:{
        /**
         * @param shareType：0：弹窗不带预览 1：弹窗带预览 2：直接分享
         * @param needDraw：0：画 1： 不画
         * @param channel：参考下文channel
         */
        share(shareType, needDraw, channel){
            console.log('share')
          let data = JSON.parse(JSON.stringify(this.shareData));
          if (shareType !== undefined) {
               data.shareType = shareType;
           }
           if (needDraw !== undefined) {
               data.needDraw = needDraw;
           } 
           if (channel !== undefined) {
               data.channel = channel;
           }
           let params = {sharedata: JSON.stringify(data)};

           
           bridge.share(params);
        },
        open(){
           bridge.open({uri: '/main/balance_activity', params:	'xxxx'});
        },
        controlToolbar() {
            this.toolbarShow = !this.toolbarShow;
            bridge.controlToolbar({
                isShow: this.toolbarShow ? 1 : 0
            });
        },
        closeWeb() {
            bridge.closeWeb();
        },
        openBroswer() {
            bridge.openBroswer({
                uri: 'http://www.baidu.com'
            })
        },
        getAppInfo() {
            bridge.getAppInfo({}, function(res) {
                // res.data
                    alert(JSON.stringify(res));
                })
            },
        copyTxt() {
            bridge.copyTxt({
                txt: 'this is a string'
            })
        },
        transformShareData(origin) {
            let newData = {
                desc: origin.wxShareInfo,
                imgUrl: origin.wxShareImg,
                qRCodePoint: origin.qRCodePoint,
                shareContentType: origin.shareContentType, 
                shareUrl: origin.shareUrl,
                title: origin.wxShareTitle,
                needDraw: 0
            };
            return newData;
        }   
    },
    mounted() {
      
    }
}
</script>
<style lang="less" scoped>
    .bg(@url) {
        background-repeat: no-repeat;
        background-size: cover;
        background-image: url("../../img/@{url}");
    }
    .bg-fill(@url) {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url("../../img/@{url}");
    }

    .jsbridge-page{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 750px;
        padding-top: 40px;
       
        .btn{
            display: inline-block;

            width: 596px;
            height: 143px;
            color:#16151A;
            font-size: 56px;
            font-weight: 600;
            text-align: center;
            line-height: 120px;
            .bg-fill('btn_yellow.png');
            margin: 20px;
        }
    }
</style>

