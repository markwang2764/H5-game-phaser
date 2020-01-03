<template>
  <div class="result-page" v-if="isConfigLoaded">
    <top-header :title="configData.theme"></top-header>
    <div class="analyze-result">
      <div class="keywords-wrap">
        <div >我的结果：<span class="keywords1">{{overview.name}}</span></div>
        <div >个性关键词：<span class="keywords2">{{overview.keyWord}}</span></div>
      </div>
      <div class="overview">
        <div class="initial-content" v-if="!isShowAll">
          <p>{{divideContext(overview.context).collapse}}</p>
        </div>
        <div class="expand-content" v-else>
          <p v-for="p in divideContext(overview.context).expand">
            {{p}}
          </p>
        </div>
        <div class="btn-expand" @click="showAll(true)" v-if="!isShowAll">展开</div>
        <div class="btn-collapse" @click="showAll(false)" v-else>收起</div>
      </div>
      <result-list :result-list="this.resultList" :unlock-num="unlockNum"
                   v-if="Object.keys(this.resultList).length > 0" :onInviteClick="onInviteClick"></result-list>
    </div>

    <div class="bottom-box">
      <template v-if="unlockNum < 3">
        <div class="btn-invite btn" @click="invite">马上邀请</div>
      </template>
      <template v-else-if="isAndroid">
        <div class="btn-invite btn" @click="download">玩测试赚零钱</div>
      </template>
      <template v-else>
        <div class="btn-invite btn" @click="invite">邀请好友来测</div>
      </template>
    </div>

    <wx-share-pop :onClose="onWxPopClose" v-if="isWxPopShow"></wx-share-pop>
    <download-pop :onClose="onDownloadPopClose" v-if="isDownloadPopShow"></download-pop>

    <div class="white-mask" v-if="isWhiteMaskShow"></div>
  </div>
</template>

<script>
  import TopHeader from '../../components/TopHeader.vue';
  import ResultList from '../../components/ResultList.vue';
  import WxSharePop from '../../components/WxSharePop.vue';
  import {getUnlockCount, getConfig} from '../../service/getData';
  import {isObjectEmpty, isAndroid, isWeiXin, getUrlParameter} from '../../components/utils';
  import {divideContext, transformAnswer} from '../../components/mixins';
  import {mapState, mapActions} from 'vuex';
  import {getWxConfig} from "../../service/getData";
  import DownloadPop from "../../components/DownloadPop.vue";

  export default {
    data() {
      return {
        isShowAll: false,
        overview: {},
        resultList: [],
        unlockNum: 0,
        unlockTimer: null,
        isWxPopShow: false,
        isDownloadPopShow: false,
        isWhiteMaskShow: true,
        isAndroid: isAndroid()
      }
    },
    mixins: [divideContext, transformAnswer],
    components: {
      DownloadPop,
      TopHeader, ResultList, WxSharePop},
    computed: {
      isConfigLoaded() {
        // 根据题目判断是否加载完配置信息
        return Object.keys(this.configData.questions).length > 0;
      },
      ...mapState([
        'configData',
//        'testResult'
      ])
    },
    methods: {
      ...mapActions([
        'saveResult',
        'setConfigData'
      ]),
      onWxPopClose(){
        this.isWxPopShow = false;
      },
      onDownloadPopClose() {
        this.isDownloadPopShow = false;
      },
      onInviteClick() {
        this.$embed.singleClk(this.$embed.TYPE_10);
        this.isWxPopShow = true;
      },
      showAll(isShow) {
        this.isShowAll = isShow;
      },
      invite() {
        this.$embed.singleClk(this.$embed.TYPE_9);
//        alert('请点击微信左上角菜单进行分享');
        this.isWxPopShow = true;
      },
      download() {
        this.$embed.singleClk(this.$embed.TYPE_6);
        this.isDownloadPopShow = true;
        // 下载地址
//        window.location.href = this.configData.downloadUrl;
      },

      wxShare() {
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
            wx.ready(function () {
              let shareData = {
                title: '绝了！写的真准！ 连测十遍都不过瘾！',
                desc: '快快快，打开快看！专门给你看的！',
//                link: '//' + window.location.host + '/youtui/consumer/share?id=30&type=2&sourceToken=&sessionKey=&pageShareType=3',
                link: _.configData.shareUrl,
                // 必须带上协议，否则微信无法识别
                imgUrl: location.protocol + '//yun.tuisnake.com/h5-mami/webgame/qa/share_pic.png'
              };

              let friendsShareData = Object.assign({}, shareData, {
                success: () => {
                  // 微信好友埋点
                  _.$embed.singleClk(_.$embed.TYPE_1, null, {share_way: 3})
                }
              });
              let circleShareData = Object.assign({}, shareData, {
                success: () => {
                  // 微信朋友圈埋点
                  _.$embed.singleClk(_.$embed.TYPE_1, null, {share_way: 1})
                }
              });
              // 分享给朋友
              wx.onMenuShareAppMessage(friendsShareData);
              // 分享到朋友圈
              wx.onMenuShareTimeline(circleShareData);
              wx.onMenuShareQQ(shareData);
              // wx.hideOptionMenu();/***隐藏分享菜单****/
              wx.error(function (res) {
                alert(JSON.stringify(res));
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
              });
            });
          })
          .catch(err => {
            console.log('transferToAccount error');
          });
      },


      toDownloadUrl(url) {
        setTimeout(()=>{
          window.location.href = url;
        }, 120);
      },

      // TODO mixins复用
      checkConfigLoaded(onloaded) {
        // 获取配置信息
        if (!this.isConfigLoaded) {
          getConfig()
            .then(result => {
              result = result.data;
              const {
                code,
                desc,
                data,
                success
              } = result;
              if (success) {
                this.setConfigData(data);
                this.$embed.update(data.embed);
                onloaded && onloaded();
              } else {
                console.error(desc);
              }
            })
            .catch(err => {
              console.error(err);
            });
        } else {
          onloaded && onloaded();
        }
      }
    },

    mounted() {
      this.checkConfigLoaded(() => {
        // 初始化微信分享
        if (isWeiXin()) {
          this.wxShare();
        }
        this.unlockNum = this.configData.unlockNum;
        // 当前页面在安卓的其他浏览器中 自动发起下载
        if (this.isAndroid && !isWeiXin() && this.unlockNum >= 3) {
          this.$embed.singleClk(this.$embed.TYPE_12);
          console.log(this)
          this.toDownloadUrl(this.configData.downloadUrl);
          return;
        } else {
          this.isWhiteMaskShow = false;
        }
//        console.log(this.configData.hasAnswer);
        this.$embed.singleClk(this.$embed.TYPE_8);
        let rid = this.configData.hasAnswer;
        if (!rid) {
          alert('测试结果已经提交，请重新答题');
          this.$router.push({ path: '/item'})
        } else {
          let answer = this.configData.answers[rid];
          console.log(answer)
          this.overview = this.transformAnswer(answer).overview;
          this.resultList = this.transformAnswer(answer).list;
          // 定时更新解锁状态
          // TODO
          return
          setInterval(() => {
            this.updateLock();
          }, 5000);
        }
      });

    },

    updateLock() {
      getUnlockCount()
        .then(result => {
          result = result.data;
          const {
            code,
            desc,
            data,
            success
          } = result;
          if (success) {
            let answer = data.answers;
            this.overview = this.transformAnswer(answer).overview;
            this.resultList = this.transformAnswer(answer).list;
            this.unlockNum = data.unlockNum;
          } else {
            console.error(desc);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    destroyed() {
      this.unlockTimer && clearInterval(this.unlockTimer);
    }
  }
</script>

<style lang="less">
  .result-page {
    @bottom-box-height: 180px;
    @overview-color: #1e1515;

    .bg(@url) {
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url("../../img/@{url}");
    }

    .analyze-result {
      padding: 0 24px;
    }

    .analyze-result {
      padding-bottom: @bottom-box-height;
    }

    .keywords-wrap {
      font-size: 28px;
      color: @overview-color;
      .keywords1 {
        font-size: 34px;
        color: rgb(30, 21, 21);
        font-weight: 600;
        line-height: 1.7;
        margin-bottom: 18px;
        display: inline-block;
      }

      .keywords2 {
        font-size: 28px;
        color: rgb(30, 21, 21);
        font-weight: 600;
        line-height: 1.7;
        margin-bottom: 18px;
        display: inline-block;

      }
    }
    .overview {
      font-size: 28px;
      color: @overview-color;
      margin-bottom: 30px;
      p {
        line-height: 2.2;
        text-indent: 2em;
        margin-bottom: 10px;
      }
      .btn-expand, .btn-collapse {
        font-size: 28px;
        color: rgb(63, 134, 255);

      }
    }

    .btn {
      width: 509px;
      height: 144px;
      line-height: 124px;
      text-align: center;
      display: inline-block;
      font-size: 34px;
    }

    .bottom-box {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: @bottom-box-height;
      text-align: center;
      padding: 40px 0;
      .bg('bg_bottom.png');
      .btn-test {
        .bg('bg_btn_blue.png');
        margin-bottom: 10px;
        color: #fff;
      }

      .btn-lock {
        width: 458px;
        height: 90px;
        line-height: 90px;
        border: solid 1px #fece22; /* no */
        margin-bottom: 10px;
        border-radius: 144px;
        color: #1e1515;
        background-color: #fff;
      }

      .btn-invite {
        .bg('bg_btn_yellow.png');
        margin-bottom: 10px;
        color: #1e1515;
      }
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
  }
</style> 