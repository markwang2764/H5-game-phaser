<template>
     <div class="allright-page">
        <top-header ></top-header>
        <div class="main-content">
            <div class="questions-container">
                <div class="question-box">
                    <div class="body-text">
                        全部答对，获得<span class="text-yellow">答题王者</span>称号！
                    </div>
                    <div class="body-text">
                        获得答题奖金
                    </div>
                    <div class="bonus">{{bonus}}<span class="unit">元</span></div>
                    <img class="bg-pic" src="../../img/bg_redpacket.png">
                </div>

                <countdown-btn :deadline="deadline" :onBtnClick="wihdraw" :onTimeEnd="onTimeEnd" :text="'立即提现'"></countdown-btn>
            </div>

        </div>
     </div>
</template>

<script>
import TopHeader from '../../components/TopHeader';
import CountdownBtn from '../../components/CountdownBtn';

export default {
  name: 'allright',
  components: { TopHeader, CountdownBtn },
  props: {
    bonus: {
      type: Number,
      default: 0
    },
    deadline: {
        type: Number,
        default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      startQuestion: 0,
      page: 0,
      revive: 0
    };
  },
  methods: {
    initData() {
      let data = JSON.parse(JSON.stringify(this.data));
      this.startQuestion = data.startQuestion;
      this.page = data.page;
      this.revive = data.revive;
    },
    wihdraw() {
      console.log('withdraw');
      console.log('bonus=' + this.bonus)
      this.$embed.singleClk(this.$embed.TYPE_9,null, {
          page_source: 1,
          bonus:this.bonus
      });
      this.$bus.$emit('showDownloadPop', {from: 'allright', bonus: this.bonus});
    },
    onTimeEnd() {
      console.log('timeend');
      this.$bus.$emit('changeState', {state: 'timeout', bonusNow: this.bonus} );
    }
  },
  mounted() {
    
    console.log('home init');
    this.initData();
    if (this.page === 2) {
      this.$embed.singleClk(this.$embed.TYPE_4, null, {
        question_no: this.startQuestion, 
        answer_result_source: this.revive === 0 ? 0 : 1, // 0-正常答题进入 1-复活进入
        answer_result_type: 1 // （1-成功  0-失败）
      });
    }
    
  }
};
</script>
<style lang="less" scoped>
.bg-fill(@url) {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('../../img/@{url}');
}
.allright-page {
  .questions-container {
    padding: 0 53px;
    text-align: center;

    .question-box {
      //   padding: 56px 36px 10px 36px;
      margin-top: 70px;
      background: rgba(53, 28, 125, 1);
      border-radius: 14px;
      min-height: 509px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 90px;

      .title {
        font-size: 48px;
        color: #fff;
        margin-bottom: 30px;
      }
      .body-text {
        font-size: 34px;
        color: #fff;
        margin-bottom: 15px;
        
        &:nth-of-type(1){
            margin-top: -150px;
            margin-bottom: 40px;

        }
      }
      .bonus {
        color: #ffe316;
        font-size: 104px;
      }
      .unit {
        font-size: 60px;
      }

      .text-yellow {
        color: #ffe316;
      }

      .bg-pic {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 530px;
      }
    }

  
  }
}
</style>

