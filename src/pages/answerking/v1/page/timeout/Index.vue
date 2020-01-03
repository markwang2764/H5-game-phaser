<template>
     <div class="timeout-page">
        <top-header ></top-header>
        <div class="main-content">
            <div class="questions-container">
                <div class="question-box">
                    <div class="title">
                        限时提现时间已到
                    </div>
                    <div class="title">
                        重新答题也可以领取
                    </div>
                    <img class="bg-pic" src="../../img/bg_clock.png">
                </div>

                <div class="btn-yellow" @click="start">重新答题</div>

            </div>

        </div>
     </div>
</template>

<script>
import TopHeader from '../../components/TopHeader';
import {getUrlParameter} from '@js/utils';

export default {
  name: 'timeout',
  components: { TopHeader },
  
  data() {
    return {};
  },
  methods: {
    start() {
      console.log('restart');
       this.$embed.singleClk(this.$embed.TYPE_2,null, {
              page_share_source: 3
            });
      this.$bus.$emit('restart');
    }
  },
  mounted() {
    this.$embed.singleClk(this.$embed.TYPE_1, null , {
      source_user_id: getUrlParameter('sourceUserId'),
      page_share_source: 3
    });
    console.log('home init');
  }
};
</script>
<style lang="less" scoped>
.bg-fill(@url) {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('../../img/@{url}');
}
.timeout-page {
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
        font-size: 36px;
        color: #fff;
        margin-bottom: 30px;
      }
      .bonus {
        color: #ffe316;
      }

      .bg-pic {
        margin-top: 20px;
        width: 240px;
      }
    }

    .btn-yellow {
      display: inline-block;
      width: 644px;
      height: 120px;
      color: #16151a;
      font-size: 40px;
      font-weight: 600;
      text-align: center;
      line-height: 100px;
      .bg-fill('btn_yellow.png');
    }
  }
}
</style>

