<template>
  <div class="home-page">
    <img src="../../img/bg.png" alt="" class="bg-img">
    <img class="title-img" src="../../img/title.png"></img>
    <div class="title">{{ dataList.context }}</div>
    <div class="people-content">
      <img class="people-img" :src="item" v-for="item in dataList.imgs"></img>
    </div>
    <div class="btn1" v-if="dataList.finish" @click="handleClickGet"></div>
    <div class="btn2" v-else @click="handleClickShare"></div>
    <div class="rules">
      活动规则：3小时内拉5位好友帮助拆红包 即有机会获得最高100元奖励
    </div>

    <component :is="curview" :show.sync="modalShow" :data="data"></component>
  </div>
</template>

<script>
import TopTitle from '../../components/TopTitle.vue';
import axios from 'axios';
import modalMixins from '../../../../../components/pop/modalMixins'; // 弹窗系列控制
import { getUrlParameter, getWxConfig, getOpenid, setLocalStorage, getLocalStorage } from '../../components/utils';
import toast from '../../components/toast/index';
// import {getWxConfig} from "../../service/getData";
export default {
  name: 'home',
  components: {
    TopTitle,
    FriendShare: resolve => {
      require(['../modals/FriendShare.vue'], resolve);
    },
    FriendGet: resolve => {
      require(['../modals/FriendGet.vue'], resolve);
    },
    redEnvelope: resolve => {
      require(['../modals/redEnvelope.vue'], resolve);
    },
    redBag: resolve => {
      require(['../modals/redBag.vue'], resolve);
    },
    userShare: resolve => {
      require(['../modals/userShare.vue'], resolve);
    }
  },
  mixins: [modalMixins],
  data() {
    return {
      dataList: {}
    };
  },
  methods: {
    handleClickShare() {
      axios
        .get('/youtui/temporary/redPacket/share', {
          params: {
            img: this.dataList.img,
            pop: this.dataList.pop,
            sourceUserId: getUrlParameter('sourceUserId') || '',
            userId: this.dataList.userId,
            version: getUrlParameter('version') || ''
          }
        })
        .then(res => {
          this.$bus.$emit('showModal', {
            modalId: 'userShare'
          });
        })
        .catch(err => {
          console.log('transferToAccount error');
        });
    },

    handleClickGet() {
      axios
        .get('/youtui/temporary/redPacket/finish', {
          params: {
            img: this.dataList.img,
            pop: this.dataList.pop,
            sourceUserId: getUrlParameter('sourceUserId') || '',
            userId: this.dataList.userId,
            version: getUrlParameter('version') || ''
          }
        })
        .then(res => {
          this.$bus.$emit('showModal', {
            modalId: 'FriendShare',
            data: {
              money: res.data.data.money,
              userId: this.dataList.userId,
              img: this.dataList.img,
              pop: this.dataList.pop
            }
          });
        })
        .catch(err => {
          console.log('transferToAccount error');
        });
    },

    wxShare(opts) {
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
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ']
          });
          wx.ready(function() {
            let shareData = {
              title: opts.wxShareTitle,
              desc: opts.wxShareSubTitle,
              //                link: '//' + window.location.host + '/youtui/consumer/share?id=30&type=2&sourceToken=&sessionKey=&pageShareType=3',
              link: opts.shareUrl,
              // 必须带上协议，否则微信无法识别
              imgUrl: opts.wxShareImg
            };

            let friendsShareData = Object.assign({}, shareData);
            let circleShareData = Object.assign({}, shareData);
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
    }
  },
  computed: {},
  mounted() {
    if (window.CFG) {
      this.dataList = window.CFG;
      //生成签名
      this.wxShare({
        wxShareTitle: this.dataList.wxShareTitle,
        wxShareSubTitle: this.dataList.wxShareSubTitle,
        shareUrl: this.dataList.shareUrl,
        wxShareImg: this.dataList.wxShareImg
      });
      //是否需要微信授权
      if (!window.CFG.authed) {
        document.body.innerHTML = '';
        getOpenid(window.CFG);
      } else {
        setLocalStorage('userId', this.dataList.userId);
        if (this.dataList.pop === true) {
          if (this.dataList.popValue === 1) {
            this.$bus.$emit('showModal', {
              modalId: 'redBag',
              data: {
                money: this.dataList.money,
                userId: this.dataList.userId,
                img: this.dataList.img
              }
            });
          } else if (this.dataList.popValue === 2) {
            this.$bus.$emit('showModal', {
              modalId: 'FriendShare',
              data: {
                userId: this.dataList.userId,
                money: this.dataList.popMoney,
                img: this.dataList.img,
                pop: this.dataList.pop
              }
            });
          } else if (this.dataList.popValue === 3) {
            this.$bus.$emit('showModal', {
              modalId: 'FriendGet',
              data: {
                img: this.dataList.downloadCode,
                money: this.dataList.popMoney
              }
            });
          }
        }
      }
    } else {
      console.log(window.CFG, '------CFG');
    }
  }
};
</script>

<style lang="less" scoped>
.bg(@url) {
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('../../img/@{url}');
}
.home-page {
  position: relative;
  height: 100vh;
  width: 100%;
  background-color: #ffefd2;
  .bg-img {
    width: 100%;
  }
  .title-img {
    height: 160px;
    width: 424px;
    position: absolute;
    top: 64px;
    right: 162px;
  }
  .title {
    position: relative;
    width: 500px;
    margin-left: 132px;
    font-size: 48px;
    color: #e33a2d;
    letter-spacing: 0.09px;
    text-align: center;
    margin-top: 46px;
    &:after {
      background: #e2392c;
      content: '';
      height: 2px;
      position: absolute;
      top: 50%;
      right: -40px;
      width: 68px;
    }
    &:before {
      background: #e2392c;
      content: '';
      height: 2px;
      position: absolute;
      top: 50%;
      left: -40px;
      width: 68px;
    }
  }
  .people-content {
    padding: 38px 76px 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .people-img {
      height: 104px;
      width: 104px;
      border-radius: 50%;
    }
  }
  .btn1,
  .btn2 {
    height: 108px;
    width: 388px;
    margin-left: 182px;
    margin: 60px 180px 86px;
  }
  .btn1 {
    .bg('bg-btn2.png');
  }
  .btn2 {
    .bg('bg-btn1.png');
  }
  .rules {
    font-size: 32px;
    color: #9b9b9b;
    text-align: center;
    line-height: 48px;
    width: 590px;
    margin-left: 80px;
  }
}
</style> 