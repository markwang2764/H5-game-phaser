<template>
    <div :class="['share-page', hasUnlock ? 'has-unlock': '']" v-if="configLoaded">
        <top-header :title="'你的好友正在做恋爱测试，邀请您为TA解锁更多分析报告'" :align="'left'"></top-header>
        <div class="sub-title">你知道自己适合什么类型的人吗</div>

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
            <result-list :result-list="this.resultList" :page="'share'" :unlock-num="unlockNum"></result-list>
        </div>

        <div class="bottom-box">
            <div class="btn-lock btn" @click="doUnlock" v-if="!hasUnlock && unlockNum < 3">帮TA解锁</div>
            <div class="btn-test btn" @click="startTest">我也要测</div>
        </div>
    </div>

</template>

<script>
  import TopHeader from '../../components/TopHeader.vue';
  import ResultList from '../../components/ResultList.vue';
  import toast from '../../components/toast/index';
  import {unlock, getUnlockCount, getConfig2} from '../../service/getData';
  import {divideContext, transformAnswer} from '../../components/mixins';
  import {mapState, mapActions} from 'vuex';

  export default {
    name: 'home',
    components: {TopHeader, ResultList},
    data() {
      return {
        isShowAll: false,
        overview: {},
        resultList: [],
        unlockNum: null,
        configLoaded: false,
        shareUrl: '#',
        hasUnlock: true
      }
    },
    mounted() {
      console.log('share mounted')

      getConfig2()
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
            this.shareUrl = data.shareUrl;
            this.configLoaded = true;
            this.hasUnlock = data.hasUnlock;

            this.$embed.update(data.embed);
          } else {
            console.error(desc);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    mixins:[divideContext, transformAnswer],
    computed: mapState([
      'configData',
    ]),
    methods: {
      ...mapActions([
        'setConfigData'
      ]),
      showAll(isShow) {
        this.isShowAll = isShow;
      },
      startTest() {
        // 基本配置信息获取
        this.$embed.singleClk(this.$embed.TYPE_2);

        window.location.href = this.shareUrl;
//        this.$router.push('/item')
      },

      transformResultListData(resultList) {
        return resultList.map((item, index) => {
          item.open = true;
          return item;
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
              // 自动展开所有
              this.resultList = this.transformResultListData(this.transformAnswer(answer).list);
              this.unlockNum = data.unlockNum;
            } else {
              console.error(desc);
            }
          })
          .catch(err => {
            console.error(err);
          });
      },

      doUnlock() {
        unlock()
          .then(result => {
            result = result.data;
            const {
              code,
              desc,
              data,
              success
            } = result;
            if (success) {
//              alert('解锁成功');
              toast.make({
                content: '解锁成功'
              });
              this.hasUnlock = true;
              // 刷新解锁状态
              this.updateLock();
            } else {
              console.error(desc);
            }
          })
          .catch(err => {
            console.error(err);
          });
      },
    }
  }
</script>

<style lang="less" scoped>
    .share-page {
        @bottom-box-height: 329px;
        @overview-color: #1e1515;

        @bottom-box-height2: 180px;

        &.has-unlock {
            .analyze-result {
                padding-bottom: @bottom-box-height2;
            }

            .bottom-box{
                height: @bottom-box-height2;
            }
        }
        .bg(@url) {
            background-repeat: no-repeat;
            background-size: cover;
            background-image: url("../../img/@{url}");
        }

        .sub-title{
            font-size: 28px;
            font-weight: 600;
            color: #1e1515;
            padding: 0 24px;
            margin-bottom: 20px;
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
                text-indent: 2em;
                margin-bottom: 10px;
                line-height: 2.2;
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
    }

</style> 