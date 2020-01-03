<template>
    <div class="home-page">
        <top-header :title="configData.theme"></top-header>
        <div class="user-info">
            <img class="avatar" :src="configData.userImg"/>
            <span class="name">{{configData.nickName}}</span>
        </div>
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
            <result-list :result-list="this.resultList"></result-list>
        </div>

        <div class="bottom-box">
            <div class="btn-test btn" @click="startTest">我也要测</div>
        </div>
    </div>

</template>

<script>
  import TopHeader from '../../components/TopHeader.vue';
  import ResultList from '../../components/ResultList.vue';
  import {getConfig} from '../../service/getData';
  import {getUrlParameter} from '../../components/utils';
  import {divideContext, transformAnswer} from '../../components/mixins';
  import {mapState, mapActions} from 'vuex';

  export default {
    name: 'home',
    components: {TopHeader, ResultList},
    data() {
      return {
        isShowAll: false,
        defaultResult: [
          {
            "id": 1,
            "title": "性格特征",
            "context": "*你认真专心，下决心做某事就会稳定下来，而不会抗议或分心，你对待事情也很认真负责的，不会去推卸责任，因此在你身边是很舒服的，你就会按班就部把事情做好，并且保证按时完成。同时，你有着很强的逻辑能力，面对生活中的问题，你总是能理智的运用客观的，合乎逻辑的手段来做决定，而较少涉及情感，更重要的是，你不仅有着强烈的责任感，而且对于生活中的组织，家庭和人际关系你也非常重视。",
            "image": null,
            "keyWord": "专注，理智，坚毅",
            "name": "A 责任感强的上进型"
          },
          {
            "id": 2,
            "title": "性格维度",
            "context": "情感性：\n\n你的结果：偏分析型\n你做决定时更看重合理性和逻辑性，不是太关心别人对于决定的感受。\n直觉性：\n你的结果：感觉型\n你的一个典型的感觉型人，相信自己亲眼所见的和所听，对于理论和思想没有太大的兴趣。",
            "image": "http://yun.tuisnake.com/h5-mami/webgame/qa/qa_pic3.png",
            "keyWord": null
          },
          {
            "id": 3,
            "title": "恋爱风格",
            "context": "你认真负责的态度，尊崇纪律的风格注定让你做的每一件事都是一丝不苟的，企业，组织，或者是某一团体都因为你的认真而更加团结，同时，你是非常务实的，你可能会计算在一段关系中的彼此所付出的时间成本和情感成本。",
            "image": "http://yun.tuisnake.com/h5-mami/webgame/qa/qa_pic1.png",
            "keyWord": null
          },
          {
            "id": 4,
            "title": "查看谁暗恋我",
            "context": "TA会尽其所有的带给你最多的爱，欢笑和热情，同时享受着和你们的欢乐圈子里 的所有人往来，打交道，让他独处，对TA来说是最残忍的事情，TA憎恶冲突，渴望与你维持一段和谐的恋爱关系，但请注意，TA对爱情的表达方式和性关系的亲密度是没有底线的，和TA在一起，可以轻易的变成24小时不停歇的沉醉于美食，饮酒和刺激的玩乐中。",
            "image": "http://yun.tuisnake.com/h5-mami/webgame/qa/qa_pic2.png",
            "keyWord": null
          }
        ],
        overview: {},
        resultList: []
      }
    },
    mounted() {
      console.log('index mounted')
      if (getUrlParameter('pageShareType') === '3') {
        this.$router.push({ path: '/item'})
      } else {
        this.initDefaultResult();
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
              if (this.configData.hasAnswer) {
                this.$router.push({ path: '/result'})
              }
            } else {
              console.error(desc);
            }
          })
          .catch(err => {
            console.error(err);
          });
      }

    },
    mixins:[divideContext, transformAnswer],
    computed: mapState([
      'configData',
    ]),
    methods: {
      ...mapActions([
        'setConfigData'
      ]),
      initDefaultResult() {
        let answer = this.defaultResult;
        this.overview = this.transformAnswer(answer).overview;
        let resultList = this.transformAnswer(answer).list;
        this.resultList = this.transformResultListData(resultList);
      },
      showAll(isShow) {
        this.isShowAll = isShow;
      },
      startTest() {
//        this.$router.push({ path: '/item', query: {
//          sessionKey: getUrlParameter('sessionKey'),
//          sourceToken: getUrlParameter('sourceToken'),
//        }})
        this.$router.push({ path: '/item'})
        this.$embed.singleClk(this.$embed.TYPE_2);
      },

      transformResultListData(resultList) {
        return resultList.map((item, index) => {
          item.open = true;
          return item;
        });
      }
    }
  }
</script>

<style lang="less" scoped>
    .home-page {
        @bottom-box-height: 180px;
        @overview-color: #1e1515;
        .bg(@url) {
            background-repeat: no-repeat;
            background-size: cover;
            background-image: url("../../img/@{url}");
        }

        .user-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0 24px;
            margin-bottom: 32px;

            .avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin-right: 12px;
            }
            .name {
                font-size: 28px;
                color: rgb(153,153,153);
            }
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