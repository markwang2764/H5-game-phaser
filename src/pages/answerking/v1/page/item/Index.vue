<template>
    <div class="item-page" :class="{'shake': isShake}">
        <top-header ></top-header>
        <div class="main-content">
        <div class="questions-container">
            <div class="ui">
            <div class="countdown">
                <span class="label">倒计时</span>
                
                <div class="countdown-circile" ref="countdownCircle">
                  <svg class="svg-circle" ref="svgCircle" :width="circleSize" :height="circleSize" :viewbox="`0 0 ${circleSize} ${circleSize}`">
                    <circle :cx="circleRadius" :cy="circleRadius" :r="innerCircleSize" :stroke-width="ringSize" :stroke="color" fill="none" ></circle>
                    <circle :cx="circleRadius" :cy="circleRadius" :r="innerCircleSize" :stroke-width="ringSize" :stroke="'#3d3989'" fill="none" :transform="`matrix(0,-1,1,0,0,${circleSize})`"  :stroke-dasharray="`${progress} ${perimeter}`"></circle>
                  </svg>
                  <div class="circle-center"><span :class="{'text-accent': isTextAccent,'time': true, 'zoom-up2': isZoomUp}">{{time}}</span></div>
                </div>
            </div>
            <div class="coin-get">
                <span class="label">已获得现金：</span>
                <span class="amount">{{bonus+ '元'}}</span>
            </div>
            </div>
            <template v-if="questionLists && questionLists.length > 0 ">
              <div class="question-box">
                  <div class="title">
                      {{QNumber + questionLists[currentNum].question}}
                  </div>
                  <ul class="option-list">
                      <li :class="['option', getOptionStatus(item), canChoosed ? '' : 'disabled', choosedId===item.optionId?'choosed': '']" :key="item.optionId" v-for="(item, index) in questionLists[currentNum].options" @click="choosed(index)" >
                          <span >{{item.desc}}</span>
                          <i v-if="choosedId===item.optionId && item.optionId !== rightOptionId" class="ic-error"></i>
                          <i v-if="choosedId===item.optionId && item.optionId === rightOptionId" class="ic-correct"></i>
                          <i v-if="rightOptionId===item.optionId && choosedId !== item.optionId" class="ic-sys-correct"></i>
                          <div v-if="choosedId===item.optionId" :class="['white-mask']"></div>
                          <div v-if="rightOptionId===item.optionId && choosedId !== item.optionId" :class="['white-mask-sm']"></div>
                      </li>
                  </ul>
                  <template v-if="answerWrong">
                    <template v-if="reviveCount === 1 && !isLast">
                      <div class="tip" v-if="iAnswerTimeout">答题超时，分享给好友可复活继续答题赢奖金</div>
                      <div class="tip" v-else>答错了，分享好友可复活继续答题赢奖金</div>
                    </template>
                    <template v-else-if="hasUpdateTime">
                      <div class="bonus-get">本次共获得答题奖金<span class="amount">{{this.bonus}}</span><span class="unit">元</span></div>
                    </template>
                  </template>
              </div>
            </template>
            <template v-if="answerWrong">
              <template v-if="reviveCount === 1 && !isLast">
                  <div class="btn-group">
                  <div class="btn-revive" @click="revive"></div>
                  <div class="btn-withdraw" @click="showWithdrawPop"></div>
                </div>
              </template>
              <template v-else-if="hasUpdateTime">
                <countdown-btn :deadline="completeTime" :onBtnClick="wihdraw" :onTimeEnd="onTimeEnd" :text="'立即提现'"></countdown-btn>
              </template>
            </template>
            
            </div>
        </div>
        <div :class="{'fade': isShake, 'hide': true}" :style="{height: screenHeight}"></div>
    </div>
</template>

<script>
import TopHeader from '../../components/TopHeader';
import CountdownBtn from '../../components/CountdownBtn';
import { checkAnswer, getConfig } from '../../service/getData';
import toast from '@components/toast/2.0.0/index.js';
import {getUrlParameter} from '@js/utils';

const initTime = 10; 
const colors = ['#94c105', '#ffdb1a', '#e54021'];
export default {
  name: 'item',
  components: { TopHeader, CountdownBtn },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      questionLists: [],
      startQuestion: 0,
      answer: 0,
      choose: 0,
      completeTime: 0,
      bonus: 0,
      time: initTime,
      timer: null,
      choosedNum: null, // 选项下标
      choosedId: null, // 选项id
      currentNum: 0, // 当前题号
      reviveCount: 1, //剩余复活次数
      rightOptionId: null, // 正确的选项id,
      correctNum: 0, // 已答对题数
      answerWrong: false, //  答错
      color: colors[0],
      circleSize: 72,
      ringSize: 6,
      nextBonus: 0,
      canChoosed: true,
      isShake: false,
      screenHeight: window.innerHeight + 'px',
      type: 1, // 页面标识，用户再次访问页面时，保留上次的状态
      isZoomUp: false,
      isTextAccent: false,
      iAnswerTimeout: false,// 是否答题超时
      testOver: false,
      hasUpdateTime: false // 在completeTime时间更新后再去显示countdown组件，避免completeTme延后更新造成countdown使用之前的数据，直接进入超时页
    };
  },
  computed: {
    QNumber: function() {
      return `Q${this.currentNum + 1}：`;
    },
    perimeter: function() {
      return Math.ceil(Math.PI * 2 * (this.circleRadius - this.ringSize));
    },
   
    innerCircleSize: function() {
      return Math.floor(this.circleSize / 2 - this.ringSize);
    },
    circleRadius: function() {
      return Math.floor(this.circleSize / 2);
    },
    progress: function() {
      return this.perimeter * (initTime - this.time) / initTime;
    },
    isShowRevive: function() {
      return this.answerWrong && this.reviveCount === 1;
    },
    isLast: function() {
      return this.currentNum >= this.questionLists.length - 1;
    },
    questionNo : function() {
      return this.currentNum +1;
    }
  },
  methods: {
    revive(layer_source) {
      this.$embed.singleClk(this.$embed.TYPE_5, null, {
        button_type: 1
      });
      this.$bus.$emit('revive', {layer_source: 1, bonus: this.bonus}); // 蒙层来源layer_source(1-立即复活  2-继续答题)
    },

    initData() {
      let data = JSON.parse(JSON.stringify(this.data));
      this.questionLists = data.questionLists;
      this.startQuestion = data.startQuestion;
      this.answer = data.answer;
      this.choose = data.choose;
      this.completeTime = data.completeTime;
      this.bonus = data.bonus;
      this.type = data.page;
    },
    choosed(index, auto) {
      this.canChoosed = false;
      this.stopTimer();
      console.log('index=' + index);
      console.log('currentNum = ' + this.currentNum);
      if (auto) {
        this.choosedNum = -1;
        this.choosedId = -1;
      } else {
        let OptionItem = this.questionLists[this.currentNum].options[index];
        this.choosedNum = index;
        this.choosedId = OptionItem.optionId;
      }

      if (this.choosedNum === null) {
        alert('请选择答案');
        return;
      }
      this.commitAnswer(
        this.questionLists[this.currentNum].questionId,
        this.choosedId
      );
    },

    /**
     * @param item 选项
     */
    getOptionStatus(item) {
      // 未选择之前以及正确答案未返回时样式不变
      if (this.choosedNum === null || this.rightOptionId === null) {
        return '';
      }
      // 选中项
      if (item.optionId === this.choosedId) {
        // 错误
        if (item.optionId !== this.rightOptionId) {
          return 'error';
        } else {
          return 'correct';
        }
      } else {
        // 未选中项, 告知正确答案
        if (item.optionId === this.rightOptionId) {
          // 通过左右图标来区别
          return 'correct';
        } else {
          return '';
        }
      }
    },

    showWithdrawPop() {
      this.$embed.singleClk(this.$embed.TYPE_5, null, {
        button_type: 2
      });
      this.$bus.$emit('showWithdrawPop', {
        bonusNow: this.bonus,
        totalBonus: this.nextBonus
      });
    },

    updateServerTime(callback) {
      getConfig()
        .then(result => {
          console.log('update time success');
          result = result.data;
            const {
            code,
                desc,
                data,
                success
            } = result;
            if (success && data) {
              this.completeTime = data.completeTime;
              this.$bus.$emit('updateTime', data.completeTime);
              this.hasUpdateTime = true;
              callback && callback();
            }
        })

    },
    timeRun() {
      this.time--;
      if (this.time < 0) {
        // 时间到
        this.time = 0;
        this.onTimeout();
        return;
      }
      this.isTextAccent = false;

      if (this.time <= 3) {
        this.isTextAccent = true;
        this.color = colors[2];
        this.isZoomUp = false;
        setTimeout(() => {
          this.isZoomUp = true;
        }, 30);
      } else if (this.time <= 6) {
        this.color = colors[1];
      } else {
        this.color = colors[0];
      }
      
    },

    countdown() {
      this.timer = setInterval(() => {
        this.timeRun();
      }, 1000);
    },

    onTimeout() {
      this.stopTimer();
      this.iAnswerTimeout = true;
      console.log('timeout');
     
      // 时间到自动触发一个错误的选项
      this.choosed(-1, true);
      console.log('isLast=' + this.isLast);
      
    },

    /**
     * 进入下一题
     * @param status 当前题目的答题情况
     */
    checkResult(status) {
      console.log('checkResult');
      if (status) {
        if (this.isLast) {
          // 已经答完最后一题，结束
          console.log('answer over');
          // 只要最后一道题答对，就进入全部答对结果页
          this.$bus.$emit('changeState', {state: 'allright', bonusNow: this.bonus});
        } else {
          this.nextItem();
        }
      } else {
        // 答错
        if (this.reviveCount === 0) {
          debugger
          this.$bus.$emit('changeState', {state: 'die', bonusNow: this.bonus});
        }
      }
    },

    stopTimer() {
      console.log(this.timer);
      this.timer && clearInterval(this.timer);
    },
    nextItem() {
      this.currentNum++;
      this.resetChoosed();
      this.countdown();
    },

    resetChoosed() {
      this.choosedNum = null;
      this.choosedId = null;
      this.rightOptionId = null;
      this.color = colors[0];
      this.time = initTime;
      this.canChoosed = true;
      this.answerWrong = false;
      this.iAnswerTimeout = false;
    },

    /**
     * 提交结果
     * @param questionId 问题id
     * @param userAnswerId 用户选择的id
     */
    commitAnswer(questionId, userAnswerId) {
      checkAnswer(questionId, userAnswerId)
        .then(result => {
          // this.canChoosed = true;

          result = result.data;
          const { code, desc, data, success } = result;
          if (success && data) {
            this.bonus = data.bonus;
            this.rightOptionId = data.rightOptionId;
            this.nextBonus = data.nextBonus;

            let checkCurrentQuestion = this.choosedId === this.rightOptionId;
            if (checkCurrentQuestion) {
              this.correctNum++;
              this.answerWrong = false;
            } else {
              this.answerWrong = true;
              this.isShake = false;
              setTimeout(() => {
                this.isShake = true;
              }, 30);
            }
            this.$embed.singleClk(this.$embed.TYPE_301, null, {
              question_no: this.questionNo,
              question_result: checkCurrentQuestion ? 1 : 0
            });

            if (this.answerWrong) {
              // 出现复活按钮, 算作复活页
              if (!this.isLast && this.reviveCount === 1) {
                this.$embed.singleClk(this.$embed.TYPE_4, null, {
                  question_no: this.questionNo, 
                  answer_result_source: this.reviveCount === 0 ? 1 : 0, // 0-正常答题进入 1-复活进入
                  answer_result_type: 0  // （1-成功  0-失败）
                });
              } else{
                // 失败
                this.$embed.singleClk(this.$embed.TYPE_4, null, {
                  question_no: this.questionNo, 
                  answer_result_source: this.reviveCount === 0 ? 1 : 0, // 0-正常答题进入 1-复活进入
                  answer_result_type: 0  // （1-成功  0-失败）
                });
                this.testOver = true;
              }
            } else {
              // 最后一题回答成功
              if (this.isLast) {
                this.$embed.singleClk(this.$embed.TYPE_4, null, {
                  question_no: this.questionNo, 
                  answer_result_source: this.reviveCount === 0 ? 1 : 0, // 0-正常答题进入 1-复活进入
                  answer_result_type: 1 // （1-成功  0-失败）
                });
                this.testOver = true;
                 
              }
            }
           if (this.testOver) {
             // 答完题通知服务器更新completeTime
              this.updateServerTime(()=>{
                // 为了显示答题动画做短暂停留
                setTimeout(() => {
                  this.checkResult(checkCurrentQuestion);
                }, 500);
              });
           } else {
              // 为了显示答题动画做短暂停留
              setTimeout(() => {
                this.checkResult(checkCurrentQuestion);
              }, 500);
           }
           
          } else {
            console.error(desc);
          }
        })
        .catch(err => {
          // this.canChoosed = true;

          console.error(err);
        });
    },
    doResize() {
      this.$refs.svgCircle.style.transform = `rotate(-0.05deg) scale(${document
        .documentElement.clientWidth / 750})`;
    },
    wihdraw() {
      console.log('withdraw');
      this.$embed.singleClk(this.$embed.TYPE_9, null, {
        page_type: 2,
        bonus: this.bonus
      });
      this.$bus.$emit('showDownloadPop', {from: 'die', bonus: this.bonus});
    },
    onTimeEnd() {
      console.log('timeend');
     
      this.$bus.$emit('changeState', {state: 'timeout',bonusNow: this.bonus});
    }
  },

  mounted() {
    // 动态修改svg大小
    this.doResize();
    window.onresize = this.doResize;
    // 答题页 埋点3

    this.initData();
    this.countdown();

    this.$bus.$on('reviveSuccess', () => {
      // 提示分享可复活
      this.reviveCount > 0 && this.reviveCount--;
      toast.make('复活成功，进入下一题');
      this.nextItem();
      this.$embed.singleClk(this.$embed.TYPE_3, null, {
          answer_source: '3' 
        });
      console.log('reviveCount = ' + this.reviveCount);
    });

    // 再次进入页面
    switch (this.type) {
      case 1:
        this.currentNum = this.startQuestion;
        break;

      case 3:
        this.rightOptionId = this.answer;
        this.choosedId = this.choose;
        this.choosedNum = -1; // 避免null
        this.currentNum = this.startQuestion;
        this.answerWrong = true;
        this.canChoosed = false;
        this.stopTimer();
        break;

      case 4:
        this.rightOptionId = this.answer;
        this.choosedId = this.choose;
        this.choosedNum = -1; // 避免null
        this.currentNum = this.startQuestion;
        this.answerWrong = true;
        this.canChoosed = false; //直接到结果页，按钮不可点击

        this.reviveCount = 0;
        // fix 页面进来直接是4时应当为失败结果页
        this.hasUpdateTime = true;

        this.stopTimer();
        break;
      default:
        break;
    }

    // 根据服务端字段直接进入答题页时，需要进入页面埋点
    if (this.type === 1 ) {
      this.$embed.singleClk(this.$embed.TYPE_3, null, {
        answer_source: '1' 
      });
    }
    if (this.type === 3 ) {
      this.$embed.singleClk(this.$embed.TYPE_3, null, {
        answer_source: '3', 
      });
    }

    if (this.type === 4) {
      this.$embed.singleClk(this.$embed.TYPE_4, null, {
        question_no: this.startQuestion, 
        answer_result_source: 1, // 0-正常答题进入 1-复活进入
        answer_result_type: 0  // （1-成功  0-失败）
      });
    }
    console.log(this.questionLists[this.currentNum].question);
  }
};
</script>
<style lang="less" scoped>
.main-content {
  position: relative;
  z-index: 1;
}

div.fade {
  position: fixed;
  display: block;
  width: 100%;
  background: #ff1e00;
  left: 0;
  top: 0;
  z-index: 5;
  opacity: 0;
  pointer-events: none;
  animation: fade 300ms;
}
.hide {
  display: none;
}
.shake {
  animation: shake 300ms;
}
.zoom-up {
  animation: zoomUp 1s;
}
.zoom-up2{
  animation: zoomUp2 1s;
}
.text-accent {
  color: #e54021;
}
@keyframes fade {
  50% {
    opacity: 0.4;
  }
}
@keyframes shake {
  10% {
    transform: translate(3px, 4px);
  }
  20% {
    transform: translate(-5px, -7px);
  }
  30% {
    transform: translate(2px, 3px);
  }
  50% {
    transform: translate(-4px, -4px);
  }
  72% {
    transform: translate(3px, 7px);
  }
  80% {
    transform: translate(-1px, -3px);
  }
  80% {
    transform: translate(2px, 2px);
  }
}
@keyframes zoomUp {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1);
  }
}

@keyframes zoomUp2 {
  0% {
    font-size: 32px;
  }
  25% {
    font-size: 48px;
  }
  50% {
     font-size: 32px;
  }
}

.clearfix {
  zoom: 1;
  &:before,
  &:after {
    content: '';
    display: table;
  }
  &:after {
    clear: both;
    overflow: hidden;
  }
}
.bg(@url) {
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('../../img/@{url}');
}
.bg-fill(@url) {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../img/@{url}');
}
.questions-container {
  padding: 0 53px;
  .ui {
    position: relative;
    top: -24px;
    margin-bottom: 5px;
    height: 72px;
    line-height: 72px;
    font-weight: 600;

    .clearfix;
    .label {
      font-size: 32px;
      color: #fff;
      vertical-align: middle;
    }

    .countdown {
      float: left;
      svg {
        transform-origin: left top;
        transform: rotate(-0.05deg);
      }
      .countdown-circile {
        display: inline-block;
        position: relative;
        left: 0;
        top: 0;
        width: 72px;
        height: 72px;
        z-index: 1;
        vertical-align: middle;
      }
      .svg-circle{
        position: absolute;
        z-index: 4;
      }
      circle {
        transition: stroke-dasharray 1s linear;
      }

      .circle-center {
        position: absolute;
        left: 6px;
        top: 6px;
        width: 60px;
        height: 60px;
        font-size: 32px;
        color: #fff;
        border-radius: 50%;
        background-color: #3d3989;
        z-index: 3;
        line-height: 60px;
        text-align: center;
        .time {
          display: inline-block;
          font-weight: 600;
          transform-origin: center;
        }
      }
    }
    .coin-get {
      float: right;
      .amount {
        vertical-align: middle;
        color: #ffe316;
        font-size: 32px;
      }
    }
  }
  .question-box {
    padding: 56px 36px 10px 36px;
    background: rgba(53, 28, 125, 1);
    border-radius: 14px;
    min-height: 509px;
    margin-bottom: 40px;

    .title {
      font-size: 34px;
      color: #fff;
      line-height: 1.7;
      margin-bottom: 30px;
    }
    .option-list {
      .clearfix();
      .option {
        float: left;
        width: 267px;
        height: 98px;
        line-height: 98px;
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        color: #3f39c9;
        font-size: 40px;
        text-align: center;
        margin-right: 29px;
        margin-bottom: 29px;
        // overflow: hidden;
        position: relative;
        &.disabled {
          pointer-events: none;
        }

        @keyframes whiteMaskAnim {
          0%{
            opacity: 0.7;
          }
       
          100%{
            opacity: 0;
            transform: scale(1.3);
          }
        }

         @keyframes whiteMaskSmAnim {
          0%{
            opacity: 0.7;
          }
       
          100%{
            opacity: 0;
          }
        }
          .white-mask{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: #fff;
        border-radius: 16px;
                        // transform: scale(1.3);

            animation: whiteMaskAnim 0.6s linear  forwards;
          }
          .white-mask-sm{
             position: absolute;
            left: 0;
            top: 0;
           border-radius: 16px;

            width: 100%;
            height: 100%;
            background-color: #fff;
            animation: whiteMaskSmAnim 0.6s linear forwards ;
          }
        &.correct {
          color: #fff;
          background-color: #00e1bd;
          
        }
        &.error {
          color: #fff;
          background-color: #f03763;

         
        }

        .ic-error {
            position: absolute;
            display: inline-block;

            left: 24px;
            top: 34px;
            width: 28px;
            height: 29px;
            .bg('ic_error.png');
          }
        .ic-correct {
            position: absolute;
            display: inline-block;
            left: 20px;
            top: 32px;
            width: 32px;
            height: 32px;
            .bg('ic_correct.png');
          }
          .ic-sys-correct{
            position: absolute;
            display: inline-block;
            right: 20px;
            top: 32px;
            width: 32px;
            height: 32px;
            .bg('ic_correct.png');
          }

        &:nth-of-type(even) {
          margin-right: 0;
        }
      }
    }
  }
  .tip {
    font-size: 32px;
    margin-bottom: 22px;
    line-height: 1.7;
    text-align: left;
    color: #fff;
  }
  .btn-group {
    font-size: 0;
    width: 100%;
    @base-color : #000;
    @keyframes btnZoomIn {
      0%{
        transform: scale(0);
      }
      100%{
        transform:scale(1);
      }
    }
    .btn-revive {
      display: inline-block;
      width: 48%;
      height: 109px;
      line-height: 80px;
      font-size: 40px;
      text-align: center;
      color: rgb(22, 21, 27);
      margin-right: 4%;
      .bg-fill('btn_revive.png');
      animation: btnZoomIn 0.2s linear;
    }
    .btn-withdraw {
      display: inline-block;
      width: 48%;
      height: 109px;
      line-height: 80px;
      color: #fff;
      font-size: 40px;
      text-align: center;
      .bg-fill('btn_withdraw.png');
      animation: btnZoomIn 0.2s linear 0.05s;

    }
  }
  .bonus-get {
    font-size: 32px;
    color: #fff;
    margin-top: 20px;
    margin-bottom: 29px;
    text-align: center;
    .amount {
      color: #ffe316;
      font-size: 50px;
    }
    .unit {
      color: #ffe316;
      font-size: 32px;
    }
  }
}
</style>

