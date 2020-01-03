<template>
     <div class="share-page">
        <top-header ></top-header>
        <div class="main-content">
            <div class="questions-container">
                <div class="question-box">
                    <div class="title">
                        好友已复活
                    </div>
                    <div class="body-text">
                        多亏你的帮助，好友共获得<span class="bonus">{{bonus}}</span>元
                    </div>
                    <img class="bg-pic" src="../../img/bg_zan.png">
                </div>

                <div class="btn-yellow" @click="start">我也要答题赢奖金</div>

            </div>

        </div>
     </div>
</template>

<script>
import TopHeader from '../../components/TopHeader';
import {getUrlParameter} from '@js/utils';

export default {
  name: 'share',
  components: { TopHeader },
  
  data() {
    return {
      bonus: 0
    };
  },
  methods: {
    start() {
      console.log('start');
      this.$embed.singleClk(this.$embed.TYPE_2, null , {
                page_share_source: 2
            });

      this.$embed.singleClk(this.$embed.TYPE_3, null, {
          answer_source: '2' 
        });
      this.$bus.$emit('changeState', {state: 'item', bonusNow: this.bonus});
    }
  },
  mounted() {
    this.bonus = getUrlParameter('bonus') || 0;
    this.$embed.singleClk(this.$embed.TYPE_1 , null , {
      source_user_id: getUrlParameter('sourceUserId'),
      page_share_source: 2
    });
    console.log('share init');
  }
};
</script>
<style lang="less" scoped>
.bg-fill(@url) {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('../../img/@{url}');
}
.share-page {
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
        width: 345px;
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

