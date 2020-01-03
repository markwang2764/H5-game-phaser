<template>
  <div class="home-page">
    <img src="../../img/title.png" alt="" class="title">
    <div class="subtitle">
      <span>题目：</span>
      <span class="bold">{{theme}}</span>
      <span class="next" v-if="!hasDone" @click="getTheme">换一题</span>
    </div>
    <div class="canvas">
      <draw ref='draw' v-if="hackReset" :action='globalCompositeOperation' :pause='hasDone'></draw>
      <div class="save-tips" v-if="hasDone&&!urlParams.appPreview">
        可长按作为图片保存
      </div>
    </div>
    <div class="tips" v-if="hasDone">
      <span class="red">前{{paintConfigBean.redpackageNumber}}名</span>猜对的好友将瓜分
      <span class="red">{{paintConfigBean.redpackageMoney/100}}元</span>红包，猜画的好友越多，你的收益越高
    </div>
    <div class="button-group" v-if="!hasDone">
      <div class="eraser" :class="{checked:checked}" @click="eraser"></div>
      <div class="draw-done" @click="drawDone"></div>
    </div>
    <div class="share" v-if="hasDone" @click="share">
    </div>
    <div class="output-html" ref="output-html">
      <div class="t-tips">
        我画了一副灵魂作品，快猜猜看吧
      </div>
      <div class="o-tips">
        <span>关键字：</span>
        <span class="red">{{keywords.join('、')}}</span>
      </div>
      <img :src="png" class="png" alt="">
      <img src="" class="qr" ref="qrcode" alt="">
      <div class="tips ob-tips">
        <div class="s-tips">长按图片识别二维码</div>
        <span class="red">前{{paintConfigBean.redpackageNumber}}名</span>猜对的好友将瓜分
        <span class="red">{{paintConfigBean.redpackageMoney/100}}元</span>红包
      </div>
    </div>
    <img src="" class="output-png" ref="output-png" v-if="hasDone" alt="">
    <component :is="curview" :show.sync="modalShow" :data="data"></component>
  </div>
</template>

<script>
import fetch from '@js/fetch';
import modalMixins from '@components/pop/modalMixins'; // 弹窗系列控制
import shareGuide from './models/shareGuide';
import draw from '@components/draw/index';
import { wxShare } from '@js/wx';
import html2canvas from 'html2canvas';
import canvas2image from '@components/draw/canvas2image.js';
const QRious = require('qrious');
import track from '../../track';
import { parseUrlParams, formatUrl } from '@js/utils';
import bridge from '@components/bridge/index';

export default {
  components: {
    shareGuide,
    draw
  },
  mixins: [modalMixins],
  data() {
    return {
      hasDone: false,
      globalCompositeOperation: 'source-over',
      theme: '超人',
      themeId: 0,
      png: '',
      paintRecordId: 0,
      urlParams: {},
      keywords: [],
      shareData: {},
      imgUrl: '',
      checked: false,
      hackReset: true,
      paintConfigBean: {
        redpackageNumber: 10,
        redpackageMoney: 10000
      }
    };
  },
  created() {
    this.urlParams = parseUrlParams();

    fetch({
      url: '/youtui/share/getPaintGuessShareUrl',
      params: {
        id: 44,
        consumerIdOrder: this.urlParams.consumerIdOrder || 0
      }
    }).then(res => {
      this.shareData = res;
    });
    track(15, {
      enter_source: this.urlParams.f_jump
    });
  },
  mounted() {
    this.getTheme();
  },
  methods: {
    getTheme() {
      fetch({
        url: '/youtui/paintAndGuess/getPaintTheme',
        params: {
          themeId: this.urlParams.themeId || ''
        }
      }).then(res => {
        delete this.urlParams.themeId;
        this.theme = res.theme;
        this.themeId = res.themeId;
        this.keywords = res.prompt;
        this.globalCompositeOperation = 'source-over';
        this.checked = false;
        this.hackReset = false;
        this.paintConfigBean = res.paintConfigBean || {};
        this.$nextTick(() => {
          this.hackReset = true;
        });
      });
    },
    drawDone() {
      track(1501);
      let { zip, lines } = this.$refs['draw'].getLines();
      if (lines.length == 0) {
        this.$toast.center('您还没有做画哦～', {});
        return;
      }
      this.$loading('上传中');
      this.png = this.$refs['draw'].output();
      this.uploadImg({
        picBase64: this.png
      }).then(url => {
        fetch({
          url: '/youtui/paintAndGuess/finishPainting',
          method: 'post',
          data: {
            paintTrail: url,
            themeId: this.themeId
          }
        }).then(res => {
          this.hasDone = true;
          this.paintRecordId = res;
          this.getWxShareConfig();
          this.$nextTick(() => {
            document.getElementsByTagName('html')[0].scrollTop = 200;
            document.getElementsByTagName('body')[0].scrollTop = 200;
            document.getElementsByClassName('home-page')[0].scrollTop = 200;
          });
          setTimeout(() => {
            this.savePNG();
          }, 200);
        });
      });
    },
    eraser() {
      if (this.globalCompositeOperation === 'destination-out') {
        this.globalCompositeOperation = 'source-over';
        this.checked = false;
      } else {
        this.globalCompositeOperation = 'destination-out';
        this.checked = true;
      }
    },

    share() {
      if (!this.imgUrl) {
        setTimeout(() => {
          this.share();
        }, 300);
        return;
      }
      if (this.urlParams.appPreview == 1) {
        let { themeId, paintRecordId } = this;
        bridge.h5Share({
          imgUrl: this.imgUrl,
          id: 44,
          urlParams: {
            themeId,
            paintRecordId,
            page_share_type: 1
          }
        });
      } else {
        this.showModel({
          modalId: 'shareGuide'
        });
      }
    },
    savePNG() {
      const qr = new QRious({
        value: formatUrl(this.shareData.clickUrl, {
          enter_type: 1,
          themeId: this.themeId,
          paintRecordId: this.paintRecordId,
          page_share_type: 1,
          share_way: 2
        }),
        level: 'H',
        size: 300,
        element: this.$refs['qrcode']
      });
      html2canvas(this.$refs['output-html'], { useCORS: true, scale: 4 }).then(canvas => {
        let picBase64 = canvas.toDataURL('image/jpeg', 0.8);
        this.$refs['output-png'].src = picBase64;
        console.log(picBase64.length / 1024, 'size');
        this.uploadImg({
          picBase64
        }).then(url => {
          this.imgUrl = url;
          this.$loading.close();
        });
      });
    },
    uploadImg(data) {
      return fetch({
        url: '/upload/uploadPicByBase64',
        method: 'post',
        data: data
      }).then(res => {
        return res.url;
      });
    },
    getWxShareConfig() {
      let res = this.shareData;
      wxShare({
        url: window.location.href.split('#')[0],
        wxShareTitle: res.title,
        wxShareSubTitle: res.desc,
        shareUrl: {
          circle: res.clickUrl + `&share_way=1&themeId=${this.themeId}&paintRecordId=${this.paintRecordId}&page_share_type=2`,
          friends: res.clickUrl + `&share_way=2&themeId=${this.themeId}&paintRecordId=${this.paintRecordId}&page_share_type=2`
        },
        wxShareImg: res.picUrl,
        success: function(res) {
          track(801, {
            share_source: 2,
            shareContentIndex: res.shareContentIndex
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
@import '~@css/util.less';
@import '~@css/common.less';
html {
  .bgi('~@pages/activity/drawGuess/img/bg.jpg');
  background-repeat: repeat;
  min-height: 100vh;
  body {
    background-color: transparent;
  }
}
img {
  pointer-events: none;
}
.red {
  color: rgb(229, 63, 56);
}
.home-page {
  position: relative;
  .output-html {
    .bgi('~@pages/activity/drawGuess/img/output.png');
    .size(750,1206);
    position: absolute;
    left: -10000px;
    top: -10000px;
    .t-tips {
      .text(28,30);
      .pos(0,66);
      text-align: center;
      width: 100%;
    }
    .png {
      .size(452,393);
      .pos(140,370);
    }
    .qr {
      .size(140,140);
      .posr(74,802);
      display: block;
    }
    .o-tips {
      width: 100%;
      .text(28,30);
      text-align: center;
      .pos(0,324px);
    }
    .ob-tips.tips {
      .posr(186,800);
      text-align: right;
      background-color: transparent;
      .s-tips {
        margin-bottom: 10px;
      }
    }
  }
  .output-png {
    .size(650,565);
    .middle;
    opacity: 0.01;
    pointer-events: all;
    z-index: 11;
  }
  .title {
    .size(716,284);
    margin: 30px auto 0 auto;
    display: block;
  }
  .subtitle {
    font-size: 40px;
    color: #2e2e2d;
    text-align: center;
    margin-top: 20px;
    span {
      vertical-align: text-bottom;
    }
    .bold {
      font-weight: 600;
    }
    .next {
      font-size: 26px;
      color: #4d7ac8;
      vertical-align: text-bottom;
      text-decoration: underline;
    }
  }
  .canvas {
    .size(650,565);
    position: relative;
    margin: 20px auto 0 auto;
    .bgi('~@pages/activity/drawGuess/img/ca.png');
    padding: 36px 40px;
    canvas {
      background-color: #fff;
      border-radius: 26px;
    }
    .save-tips {
      background-color: #999;
      color: #fff;
      .text(30,70);
      text-align: center;
      position: absolute;
      bottom: 26px;
      left: 5%;
      width: 90%;
    }
  }
  .tips {
    background-color: #ffae28;
    .size(649,106);
    border-radius: 20px;
    line-height: 1.3;
    padding: 12px 40px;
    color: rgb(46, 46, 45);
    margin: auto;
    font-size: 28px;
    .red {
      color: rgb(229, 63, 56);
      font-size: 34px;
    }
    margin-top: 15px;
  }
  .button-group {
    text-align: center;
    margin-top: 90px;
    > div {
      display: inline-block;
      vertical-align: middle;
    }
    .eraser {
      .bgi('~@pages/activity/drawGuess/img/eraser.png');
      .size(92,102);
      margin-right: 85px;
      &.checked {
        animation: bre 1s linear infinite;
        @keyframes bre {
          25% {
            transform: scale(1.2);
          }
          25% {
            transform: scale(0.8);
          }
          100% {
            transform: scale(1);
          }
        }
      }
    }
    .draw-done {
      .bgi('~@pages/activity/drawGuess/img/draw-done.png');
      .size(377,124);
    }
  }
  .share {
    .bgi('~@pages/activity/drawGuess/img/share.png');
    .size(648,124);
    margin: 20px auto 0 auto;
  }
}
</style> 