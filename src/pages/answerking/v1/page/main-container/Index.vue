<template>
    <div class="main-container">
        <home v-if="state=== pages[0]" :barrages="data.barrages"></home>
        <item v-if="state=== pages[1] || state=== pages[3] || state=== pages[4]" :data="data" ></item>
        <all-right v-if="state=== pages[2]" :bonus="bonusNow" :deadline="data.completeTime" :data="data" ></all-right>
      
        <share v-if="state=== pages[5]" ></share>
        <timeout v-if="state=== pages[6]" :bonus="bonusNow" ></timeout>
        <download-pop v-if="isDownloadPopShow" :onClose="onDownloadPopClose"></download-pop>
        <withdraw-pop v-if="isWithdrawPopShow" :onCancel="onWithdrawPopCancel" :onConfirm="onWithdrawPopConfirm" :bonus="bonusNow" :totalBonus="totalBonus"></withdraw-pop>
        <wx-share-pop v-if="isWxPopShow" :onClose="onWxPopClose" ></wx-share-pop>
        <div class="white-mask" v-if="isWhiteMaskShow"></div>

    </div>

</template>

<script>
import Home from '../home/Index';
import Item from '../item/Index';
import Share from '../share/Index';
import Timeout from '../timeout/Index';
import AllRight from '../allright/Index';

import DownloadPop from '../../components/DownloadPop';
import WithdrawPop from '../../components/WithdrawPop';
import WxSharePop from '../../components/WxSharePop.vue';
import LandingTest from '@components/landingtest/index'

import { getConfig, getEmbed, getDownloadUrl ,getShareInfo, getWxConfig, getCDK} from '../../service/getData.js';
import dataMixins from '../../components/dataMixins.js';
import { isAndroid, isWeiXin, getUrlParameter ,appendUrlParameter, toDownloadUrl, isAppDownload} from '@js/utils';
import Promise from 'promise-polyfill';
import toast from '@components/toast/2.0.0';

const pages = {
  0: 'home',
  1: 'item',
  2: 'allright',
  3: 'wrong',
  4: 'die',
  5: 'share',
  6: 'timeout'
};
export default {
  name: 'main-container',
  components: {
    Home,
    Item,
    Share,
    Timeout,
    AllRight,
    DownloadPop,
    WithdrawPop,
    WxSharePop
  },
  mixins: [dataMixins],
  data() {
    return {
      state: '',
      data: {},
      pages: pages,
      isDownloadPopShow: false,
      isWithdrawPopShow: false,
      isWhiteMaskShow:true,
      isWxPopShow: false,
      bonusNow: 0,
      totalBonus: 0,
      shareInfo: {
        clickUrl: '',
        desc: '',
        picUrl: '',
        title: ''
      },
      downloadUrl: '',
      type: 0,
      landingTest: null,
      channelBase: 'yysc-cc-ans'
    };
  },
  methods: {
    setState(page) {
      this.state = page;
    },
    initEvents() {
      this.$bus.$on('changeState', ({state, bonusNow}) => {
        console.log('changeState= ' + state)
        this.setState(state);
        if (bonusNow){
          this.bonusNow = bonusNow;
        }
      });

      this.$bus.$on('showDownloadPop', ({from, bonus}) => {
        // 页面来源page_source(1-答题结果正确页   2-答题结果错误页 3-答题复活错误页）
        let pageSource = 0;
        switch(from) {
          case pages[2]: 
            pageSource = 1;
            break;
          case pages[3]:
            pageSource = 3;
            break;
          case pages[4]:
            pageSource = 2;
            break;
        }
        console.log('downloadpop show');
        console.log('this.isDownloadPopShow = ' + this.isDownloadPopShow);

        this.bonusNow = bonus;
        getCDK()
          .then((res)=>{
            res = res.data;
            let {
              code,
              desc,
              success,
              data
            } = res;
            // this.isDownloadPopShow = true;
            if (success) {
              this.landingTest = new LandingTest({
                bonus: this.bonusNow,
                code: data,
                pageSource: pageSource,
                channel: this.channelBase,
                baseEmbed: this.$embed.data.st_info_1_click // 需要服务端的埋点公共字段
              });
            } else {
              console.error(desc);
            }           
          })
          .catch((err)=>{
            console.error(err);
          });
        
      });

      this.$bus.$on('showWithdrawPop', data => {
        console.log('showWithdrawPop ');
        console.log(data);
        console.log('this.isWithdrawPopShow = ' + this.isWithdrawPopShow);
        this.bonusNow = data.bonusNow;
        this.totalBonus = data.totalBonus;
        this.isWithdrawPopShow = true;
      });

      this.$bus.$on('revive', ({layer_source, bonus}) => {
        console.log('revive');
        this.isWxPopShow = true;
        this.getShareInfo(bonus)
          .then(()=>{
            // 初始化微信分享
            if (isWeiXin()) {
              this.wxShare(layer_source);
            } else {
              console.error('当前不是微信环境');
            }
          })
          .catch((err)=>{
            console.error(err);
          });
      });

      this.$bus.$on('updateTime', completeTime => {
        this.data.completeTime = completeTime;
      });

      this.$bus.$on('restart', ()=>{
        // 重新答题需要刷新题目
        this.getConfigData()
          .then(()=>{
            this.$embed.singleClk(this.$embed.TYPE_3, null, {
              answer_source: '4' 
            });
            this.$bus.$emit('changeState', {state: 'item'});
            })
          });
    },  

    onDownloadPopClose() {
      this.isDownloadPopShow = false;
    },

    onWithdrawPopCancel() {
      this.isWithdrawPopShow = false;
      this.$embed.singleClk(this.$embed.TYPE_7, null, { button_type: 1 });
      this.$bus.$emit('revive', {layer_source:2, bonus: this.bonusNow});
    },

    onWithdrawPopConfirm() {
      this.isWithdrawPopShow = false;
      this.$embed.singleClk(this.$embed.TYPE_7, null, { button_type: 2 });
      this.$bus.$emit('showDownloadPop', {from: 'wrong', bonus: this.bonusNow});
    },

    onWxPopClose() {
      this.isWxPopShow = false;
    },
    initState(pageNum) {
      this.setState(pages[pageNum]);
    },

    wxShare(layer_source) {
      let _ = this;
      // 微信url不能包含#hash后面部分
      getWxConfig(window.location.href.split('#')[0])
        .then(res => {
          res = res.data.data;

          wx.config({
            debug: false,
            appId: res.appId,
            timestamp: res.timeStamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: [
              'checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ'
            ]
          });
          wx.ready(function() {
            let shareData = {
              title: _.shareInfo.title,
              desc: _.shareInfo.desc,
              link: _.shareInfo.clickUrl,
              // 必须带上协议，否则微信无法识别
              imgUrl: _.shareInfo.picUrl
                // location.protocol +
                // '//yun.tuisnake.com/h5-mami/webgame/qa/share_pic.png'
            };

            let friendsShareData = Object.assign({}, shareData, {
              link: appendUrlParameter(_.shareInfo.clickUrl, 'share_way', '2'),
              success: () => {
                debugger
                if (_.state === pages[2] || _.state === pages[4]) {
                  toast.make('分享成功');
                } else {
                  _.$bus.$emit('reviveSuccess');
                }
                _.isWxPopShow = false;

                // 微信好友埋点
                _.$embed.singleClk(_.$embed.TYPE_801, null, {
                  layer_source: layer_source,
                  share_way: 2,
                  shareContentIndex: _.shareInfo.shareContentIndex
                });
              }
            });
            let circleShareData = Object.assign({}, shareData, {
              link: appendUrlParameter(_.shareInfo.clickUrl, 'share_way', '1'),

              success: () => {
                _.$bus.$emit('reviveSuccess');
                _.isWxPopShow = false;

                // 微信朋友圈埋点
                _.$embed.singleClk(_.$embed.TYPE_801, null, {
                  layer_source: layer_source,
                  share_way: 1,
                  shareContentIndex: _.shareInfo.shareContentIndex
                });
              }
            });
            // 分享给朋友
            wx.onMenuShareAppMessage(friendsShareData);
            // 分享到朋友圈
            wx.onMenuShareTimeline(circleShareData);
            wx.onMenuShareQQ(shareData);
            // wx.hideOptionMenu();/***隐藏分享菜单****/
            wx.error(function(res) {
              alert(JSON.stringify(res));
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
          });
        })
        .catch(err => {
          console.log('transferToAccount error');
        });
    },

    getDownloadUrl(channel) {
      // 获取下载链接
      return new Promise((resolve, reject) => {
        getDownloadUrl(channel)
          .then(result => {
            result = result.data;
            const { code, desc, data, success } = result;
            if (success && data) {
              this.downloadUrl = data;
              resolve();
            } else {
              console.error(desc);
              reject();
            }
          })
          .catch(err => {
            reject();
            console.error(err);
          });
      });
    },

    getShareInfo(bonus) {
      // 获取下载链接
      return new Promise((resolve, reject) => {
        getShareInfo(bonus)
          .then(result => {
            result = result.data;
            const { code, desc, data, success } = result;
            if (success && data) {
              this.shareInfo = data;
              resolve();
            } else {
              reject();
              console.error(desc);
            }
          })
          .catch(err => {
            reject();
            console.error(err);
          });
      });
    }
  },

  mounted() {
    this.getDownloadUrl(this.channelBase + 'b'); // 蒙层统一为b测试
    this.getEmbedData()
      .then(() => {
        return this.getConfigData();
      })
      .then(() => {
        console.log('configData get');
        this.bonusNow = this.data.bonus;
        if (!isWeiXin() && !getUrlParameter('appPreview')) {
            // 当前页面在安卓的其他浏览器中并且不在趣晒app中 自动发起下载
           if (isAndroid()) {
            this.$embed.singleClk(this.$embed.TYPE_10, null, {
              loadpage_source_type: 2 // （1-落地页  2-直接蒙层）
            });
            toDownloadUrl(this.downloadUrl);
          } else {
              location.href = '/youtui/ab/getIosDownload';
          }
        } else {
          this.isWhiteMaskShow = false;
          this.initEvents();
          this.initState(this.data.page);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>
<style lang="less" scoped>
.bg(@url) {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('../../img/@{url}');
}
.bg-fill(@url) {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('../../img/@{url}');
}
.white-mask{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000;
      background-color: #fff;
    }

.main-container {
}
</style>

