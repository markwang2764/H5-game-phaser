<template>
  <div class="home-page">
    <template v-if="!finnal">
      <img src="../../img/title2.png" alt="" class="title self">
      <div class="tips self">
        <template v-if="self">
          <span>参与猜画的</span>
          <span class="red">好友越多，收益越高</span>
        </template>
        <!-- <template v-else-if="done">
          <span class="red">前10名</span>
          <span>答对的好友将瓜分</span>
          <span class="red">100元</span>
          <span>红包</span>
        </template> -->
        <template v-else>
          <span>关键字：</span>
          <span class="red">{{keywords.join('、')}}</span>
        </template>
      </div>
      <div class="canvas" :class="{self:self}">
        <img :src="img" alt="">
      </div>
      <div class="button-group2" v-if="self">
        <img src="../../img/again.png" alt="" @click="gotoDraw(0)" class="again">
        <img src="../../img/post.png" alt="" @click='openShareGuide' class="post">
      </div>
    </template>
    <template v-if="finnal">
      <div class="red-packet-wrap" :class="{noRed:!hasRed}">
        <template v-if="hasRed">
          <div class="s-title">
            猜对啦!
          </div>
          <div class="s-subtitle">
            成功瓜分红包
          </div>
          <div class="s-reward">
            <span class="s-word">{{red}}</span>元
          </div>
        </template>
        <template v-if="!hasRed">
          <div class="s-title">
            {{redTitle}}
          </div>
          <div class="s-subtitle">
            获得猜画鼓励金
          </div>
          <div class="s-reward">
            <span class="s-word">{{red}}</span>元
          </div>
        </template>
      </div>
      <div class="button-group4">
        <img src="../../img/m2.png" @click="gotoDraw(1)" alt="">
        <img src="../../img/pm.png" @click="withdraw" alt="">
      </div>
    </template>
    <div class="list" v-if="self||finnal">
      <div class="list-title">好友的回答
        <span class="right">时长</span>
      </div>
      <div class="list-body">
        <ul>
          <li v-for="item in list">
            <div>
              <span class="nickname">{{item.nickName}}</span>
              <span class="red">获得
                <span class="reward">{{item.bonus}}</span>
                元
              </span>
              <span class="right time">{{item.time}}秒</span>
            </div>
            <div class="answers">
              <template v-for="(a,index) in item.answerList">
                {{a}}
              </template>
              <span class="red">{{item.answer}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!self&&!finnal" class="replay">
      <div class="timeout">
        <div class="times">
          <div class="times-body">{{Math.floor(restTime)+1}}</div>
        </div>
      </div>
      <div class="progress">
        <div class="progress-fill" :style="{width:restProgress+'%'}"></div>
      </div>
    </div>
    <div class="button-group3" v-if="!self&&!finnal">
      <img src="../../img/tips-btn.png" alt="" class="get-tips" @click="getTips">
      <input v-model="answer" type="text" class="answer" placeholder="请输入你的回答" maxlength="5">
      <img src="../../img/answer.png" alt="" @click="confirmAnswer" class="answer-btn">
    </div>

    <component :is="curview" :show.sync="modalShow" :data="data"></component>
  </div>
</template>

<script>
import fetch from '@js/fetch';
import modalMixins from '@components/pop/modalMixins'; // 弹窗系列控制
import draw from '@components/draw/index';
import tips from './models/tips';
import redPacket from './models/redPacket';
import download from './models/download';
import { parseUrlParams, isAndroid, isWeiXin, deleteInvalidKey } from '@js/utils';
import track from '../../track';
import { wxShare } from '@js/wx';
import { formatUrl } from '@js/utils';
import Landingtest from '@components/landingtest';
import shareGuide from './models/shareGuide';

export default {
  components: {
    draw,
    tips,
    redPacket,
    download,
    shareGuide
  },
  mixins: [modalMixins],
  data() {
    return {
      replayData: '',
      self: false, //是否是画图者打开
      done: false, //是否答完题
      finnal: false, //完成全部流程
      restProgress: 100,
      timeOut: 30,
      restTime: 30,
      pause: false,
      keywords: [],
      answer: '',
      answerHistory: [],
      hasRed: false,
      urlParams: {},
      theme: '',
      themeId: 0,
      redTitle: '猜对啦，可惜红包被瓜分完了～',
      time: 0,
      list: [],
      red: 0,
      unlockCount: 1,
      img: '',

      //埋点
      Q_answer: 0,
      hasTips: false
    };
  },
  created() {
    this.urlParams = parseUrlParams();
    this.checkAnswered();
    this.getList();

    if (isAndroid() && !isWeiXin()) {
      fetch({
        url: '/youtui/system/getDownloadUrl',
        params: {
          channelString: 'yysc-cc-drawb'
        }
      }).then(res => {
        window.location.href = res;
      });
      return;
    }

    if (!isAndroid() && !isWeiXin() && this.urlParams.appPreview != 1) {
      window.location.href = '/youtui/ab/getIosDownload';
    }
  },
  mounted() {
    this.$bus.$on('finnal', res => {
      this.finnal = true;
      this.hasRed = res.hasRed;
      this.getList();
      if (res.timeOut) {
        this.Q_answer = 2;
        track(4, {
          Q_answer: 2,
          bonus: this.red,
          content_id: 43
        });
      } else {
        this.Q_answer = res.hasRed ? 1 : 3;
        track(4, {
          Q_answer: this.Q_answer,
          bonus: this.red,
          content_id: 43
        });
      }
    });
    this.$bus.$on('getList', () => {
      this.getList();
    });
    this.$bus.$on('close', () => {
      this.pause = false;
      this.startTimeOut();
    });
  },
  methods: {
    checkAnswered() {
      fetch({
        url: '/youtui/paintAndGuess/selectBonus',
        params: {
          paintRecordId: this.urlParams.paintRecordId
        }
      }).then(res => {
        if (res.answered) {
          // 回答过，渲染结果
          let Q_answer = 0;
          if (res.bonusType == 2) {
            Q_answer = 3;
          } else if (res.bonusType == 1) {
            Q_answer = 1;
          } else {
            Q_answer = 2;
          }
          track(4, {
            Q_answer,
            bonus: res.bonus,
            content_id: 43
          });
          this.Q_answer = Q_answer;
          this.finnal = true;
          this.done = true;
          if (res.bonusType == 1) {
            this.hasRed = true;
            this.time = res.time;
          }
          if (res.bonusType == 3) {
            this.redTitle = '时间到了！';
          }
          this.red = res.bonus;
        } else {
          // 未回答 执行答题
          track(1, {
            enter_type: this.urlParams.enter_type == 1 ? 1 : 0,
            page_share_type: this.urlParams.page_share_type,
            content_id: 43
          });
          if (res.sameUser) {
            this.self = true;
            this.getWxShareConfig(2);
          } else {
            this.startTimeOut();
            this.getWxShareConfig(3);
          }
          this.getTheme();
          this.getPaint();
          // this.mapRole();
        }
      });
    },
    openShareGuide() {
      this.showModel({
        modalId: 'shareGuide'
      });
    },
    startTimeOut() {
      if (this.done) {
        return;
      }
      if (this.pause) {
        return;
      }
      if (this.restTime <= 0) {
        fetch({
          url: '/youtui/paintAndGuess/calculateBonus',
          params: {
            outOfTime: true,
            themeId: this.urlParams.themeId,
            paintRecordId: this.urlParams.paintRecordId
          }
        }).then(res => {
          this.done = true;
          this.redTitle = '时间到了！';
          this.red = res.bonus;
          track(3, {
            Q_answer: 2,
            bonus: res.bonus,
            content_id: 43
          });
          this.showModel({
            modalId: 'tips',
            data: {
              tipsKey: this.theme,
              isTips: false,
              title: '时间到了'
            }
          });
        });
        this.getList();
        return;
      }
      this.restTime -= 0.1;
      this.restProgress = this.restTime / this.timeOut * 100;
      setTimeout(() => {
        this.startTimeOut();
      }, 100);
    },
    getWxShareConfig(page_share_type) {
      fetch({
        url: '/youtui/share/getPaintGuessShareUrl',
        params: {
          id: 44
        }
      }).then(res => {
        let shareUrl = res.clickUrl;
        wxShare({
          url: window.location.href,
          wxShareTitle: res.title,
          wxShareSubTitle: res.desc,
          shareUrl: {
            circle: shareUrl + `&themeId=${this.urlParams.themeId}&paintRecordId=${this.urlParams.paintRecordId}&page_share_type=${page_share_type}`,
            friends: shareUrl + `&themeId=${this.urlParams.themeId}&paintRecordId=${this.urlParams.paintRecordId}&page_share_type=${page_share_type}`
          },
          wxShareImg: res.picUrl,
          success: res => {
            let share_way = 0;
            this.unlockCount++;
            this.$bus.$emit('shareSuccess');
            if (res.type == 1) {
              //好友分享
              share_way = 2;
            } else {
              share_way = 1;
            }
            if (this.hasTips) {
              track(801, {
                share_source: 3,
                shareContentIndex: res.shareContentIndex,
                enter_type: this.urlParams.enter_type,
                share_way,
                content_id: 43
              });
            } else {
              track(801, {
                share_source: 1,
                shareContentIndex: res.shareContentIndex,
                enter_type: this.urlParams.enter_type,
                share_way,
                content_id: 43
              });
            }
          }
        });
      });
    },
    confirmAnswer() {
      track(2, {
        share_way: this.urlParams.share_way,
        content_id: 43
      });
      if (!this.answer) {
        this.$toast.center('请填写你的答案', {});

        return;
      }
      if (this.answer !== this.theme) {
        this.answerHistory.push(this.answer);
        this.$toast.center('猜错了，再想想', {});

        return;
      }
      this.answerHistory.push(this.answer);
      let time = Math.floor(this.timeOut - this.restTime);
      this.time = time;

      fetch({
        url: '/youtui/paintAndGuess/calculateBonus',
        params: {
          time,
          outOfTime: false,
          themeId: this.themeId,
          userAnswer: this.answerHistory.join('、'),
          paintRecordId: this.urlParams.paintRecordId
        }
      }).then(res => {
        this.done = true;
        this.red = res.bonus;
        track(3, {
          Q_answer: res.bonusType == 1 ? 1 : 3,
          Bonus: res.bonus,
          content_id: 43
        });
        this.showModel({
          modalId: 'redPacket',
          data: {
            time,
            redPacket: res.bonus,
            hasRed: res.bonusType == 1 ? true : false,
            answerRecordId: res.answerRecordId,
            paintRecordId: this.urlParams.paintRecordId
          }
        });
      });
    },
    getTheme() {
      fetch({
        url: '/youtui/paintAndGuess/getPaintTheme',
        params: {
          recordId: this.urlParams.recordId,
          themeId: this.urlParams.themeId
        }
      }).then(res => {
        this.theme = res.theme;
        this.themeId = res.themeId;
        this.keywords = res.prompt;
      });
    },
    getTips() {
      track(101, { content_id: 43 });
      this.hasTips = true;
      this.pause = true;
      this.showModel({
        modalId: 'tips',
        data: {
          tipsKey: this.theme.substr(0, this.unlockCount),
          isTips: true,
          title: '提示',
          restCount: this.theme.length - this.unlockCount
        }
      });
    },
    getPaint() {
      fetch({
        url: '/youtui/paintAndGuess/getPainting',
        params: {
          themeId: 2,
          paintRecordId: this.urlParams.paintRecordId
        }
      }).then(res => {
        this.img = res.paintTrail;
      });
    },
    withdraw() {
      track(9, {
        page_source: this.Q_answer,
        bonus: this.red,
        content_id: 43
      });
      let { sourceToken, sessionKey, sourceUserId, id, consumerIdOrder, appPreview, share_way } = this.urlParams;
      Promise.all([
        fetch({
          url: '/youtui/paintAndGuess/getEmbed',
          params: {
            sourceToken,
            sessionKey,
            sourceUserId,
            ...deleteInvalidKey({ id: 43, appPreview, consumerIdOrder, share_way })
          }
        }),
        fetch({
          url: '/youtui/paintAndGuess/getCDK',
          params: {
            contentId: id
          }
        })
      ]).then(res => {
        let params = res[0].st_info_1_click;
        new Landingtest({ baseEmbed: params, bonus: this.red, code: res[1], channel: 'yysc-cc-draw', pageSource: this.Q_answer });
      });
    },
    gotoDraw(jump) {
      track(401, {
        Q_answer: this.Q_answer,
        bonus: this.red,
        content_id: 43
      });
      let url = formatUrl(window.location.href.split('?')[0], Object.assign({}, this.urlParams, { id: 43, f_jump: jump, themeId: this.themeId }));
      window.location.href = url;
    },
    getList() {
      fetch({
        url: '/youtui/paintAndGuess/getAnswerList',
        params: {
          paintRecordId: this.urlParams.paintRecordId
        }
      }).then(res => {
        if (!res.record) {
          return;
        }
        let u = [];
        res.record.forEach(v => {
          let t = v.answerList.split('、');
          if (t.length == 0) {
            v.answer = v.answerList;
            v.answerList = [];
          }
          v.answer = t.pop();
          v.answerList = t;
          u.push(v);
        });
        this.list = u;
      });
    }
  }
};
</script>

<style lang="less">
@import '~@css/util.less';
@import '~@css/common.less';
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #999;
  font-size: 28px;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #999;
  font-size: 28px;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #999;
  font-size: 28px;
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #999;
  font-size: 28px;
}
html {
  .bgi('~@pages/activity/drawGuess/img/bg.jpg');
  background-repeat: repeat;
  min-height: 100vh;
  body {
    background-color: transparent;
  }
}
.red {
  color: rgb(229, 63, 56);
}
.home-page {
  position: relative;
  max-height: 100vh;
  .title {
    .size(716,284);
    margin: 30px auto 0 auto;
    display: block;
    &.self {
      .size(397,138);
    }
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
    .size(650,508);
    margin: 20px auto 0 auto;
    padding: 28px;
    background-color: #fff;
    .bgi('~@pages/activity/drawGuess/img/ca3.png');
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    &.self {
      .size(650,439);
      .bgi('~@pages/activity/drawGuess/img/ca2.png');
      padding: 28px 100px;
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
    &.self {
      height: 64px;
      text-align: center;
      .red {
        font-size: 28px;
      }
    }
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
    }
    .draw-done {
      .bgi('~@pages/activity/drawGuess/img/draw-done.png');
      .size(377,124);
    }
  }
  .button-group2,
  .button-group4 {
    text-align: center;
    margin-top: 30px;
    img {
      .size(313,120);
    }
  }
  .button-group3 {
    margin: 95px 0 0 50px;
    .answer {
      .size(310,73);
      border-radius: 13px;
      padding-left: 16px;
    }
    img {
      .size(164,77);
    }
  }
  .share {
    .bgi('~@pages/activity/drawGuess/img/share.png');
    .size(648,124);
    margin: 20px auto 0 auto;
  }
  .list {
    background-color: #fff;
    border-radius: 20px;
    width: 650px;
    margin: 45px auto;
    padding: 33px 24px;
    font-size: 24px;
    .right {
      float: right;
    }
    .list-title {
      color: rgba(153, 153, 153, 1);
      .text(26,36);
    }
    .list-body {
      .nickname {
        color: #666666;
      }
      .reward {
        font-size: 34px;
      }
      .answers {
        margin-top: 18px;
      }
      .time {
        color: #999999;
        .text(24,30);
      }
      ul {
        position: relative;
      }
      li + li {
        border-top: #e3e3e3 solid 1px;
      }
      li {
        padding: 26px 0;
      }
    }
  }
  .replay {
    margin: 36px 0 0 50px;
    font-size: 0;
    > div {
      display: inline-block;
      vertical-align: middle;
    }
    .timeout {
      .size(77,77);
      position: relative;
      background-color: #ffae28;
      text-align: center;
      border-radius: 50%;
      .times-body {
        .middle;
        background-color: #ffd002;
        border-radius: 50%;
        .size(62,62);
        .text(30,62);
      }
    }
    .progress {
      background-color: #ffae28;
      overflow: hidden;
      position: relative;
      .size(570,19);
      margin-left: -4px;
      border-radius: 7px;
      .progress-fill {
        background-color: #03a9ff;
        .size(0,13);
        .pos(4,4);
        // transition: width 1.3s;
        // &.intimeout {
        //   animation: timeout 1s ;
        // }
        // @keyframes timeout {
        //   from {
        //     width: 100%;
        //   }
        //   to {
        //     width: 0;
        //   }
        // }
      }
    }
  }
  .red-packet-wrap {
    .bgi('~@pages/activity/drawGuess/img/red-bg.png');
    .size(685,593);
    margin: 67px auto 0 auto;
    overflow: hidden;
    text-align: center;
    .s-title {
      font-size: 30px;
      color: #fff;
      margin-top: 193px;
    }
    .s-reward {
      color: #fff06d;
      font-size: 40px;
      margin-top: 40px;
      .s-word {
        font-size: 80px;
      }
    }
    &.noRed {
      .s-title {
        margin-top: 166px;
      }
      .s-reward {
        margin-top: 22px;
      }
    }
    .s-subtitle {
      margin-top: 48px;
      font-size: 40px;
      color: #ffd339;
    }
    // .pos(50,67);
  }
}
</style> 