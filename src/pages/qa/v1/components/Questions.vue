<template>
    <div class="questions-container">
        <div class="question-box">
            <div class="number-wrap">
                {{currentNum + '/' + Object.keys(configData.questions).length}}
            </div>
            <div class="title">
                {{configData.questions[currentNum].title}}
            </div>
            <ul class="option-list">
                <li :class="['option', (lastRecord.qid === currentNum && lastRecord.aid === item.id ) ?'selected' : '']" v-for="(item, index) in configData.questions[currentNum].items"
                    @click="choosed(index)" >
                    {{chooseType(index) + item.title}}
                </li>

            </ul>
            <div class="prev" v-if="currentNum!==1" @click="prevItem">上一题</div>
        </div>
    </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import {setAnswer} from '../service/getData';
  import {getUrlParameter} from '../components/utils';
  export default {
    name: 'questions',
    data() {
      return {
        choosedNum: null,
        choosedId: null
      }
    },
    computed: mapState([
      'configData',
      'itemNum',
      'currentNum',
      'lastRecord'
    ]),
    methods: {
      ...mapActions([
        'addNum',
        'subNum',
        'initializeData',
         'saveResult'
      ]),
      chooseType(type) {
        switch (type) {
          case 0 :
            return 'A.';
          case 1 :
            return 'B.';
        }
        return '';
      },
      choosed(index) {
        let OptionItem = this.configData.questions[this.currentNum].items[index];
        this.choosedNum = index;
        this.choosedId = OptionItem.id; // 转字符串作对象key值

        this.$embed.singleClk(this.$embed.TYPE_4, null, {q_no: this.currentNum});

        let {forwardType, forwardId} = OptionItem;
        this.nextItem(forwardType, forwardId);
      },
      /**
       * 进入下一题
       * @param type 跳转类型 0 下一题 1 结束显示结果
       * @param id type为0时为下一题id type为1时为结果id
       */
      nextItem(type, id) {
        console.log('nextItem');
        if (this.choosedNum === null) {
          alert('请选择答案');
          return;
        }
        if (type === 0) {
          // 进入下一题
          console.log('aid=' + this.choosedId);
          this.addNum({
            qid: this.currentNum,
            aid: this.choosedId,
            nextNum: id
          });
        } else if (type === 1) {
          // 出结果
          this.commitAnswer(id);
        }
        this.resetChoosed();
      },
      resetChoosed() {
        this.choosedNum = null;
        this.choosedId = null;
      },
      prevItem() {
        this.subNum();
      },
      /**
       * 提交结果
       * @param rid 结果id
       */
      commitAnswer(rid) {
        setAnswer(rid)
          .then(result => {
            result  = result.data;
            const {
              code,
              desc,
              data,
              success
            } = result;
            if (success && data) {
              this.saveResult(rid);
              this.initializeData();

              this.$router.push({ path: '/result'})
            } else {
              console.error(desc);
            }
          })
          .catch(err => {
            console.error(err);
          });
      }

    },

    created() {
      this.$store.commit('REMEMBER_TIME')
    },
    mounted() {
      console.log(this.configData.questions);
      this.initializeData();
    }
  }
</script>

<style lang="less" scoped>
    .questions-container {
        padding: 50px;

        .question-box {
            position: relative;
            box-shadow: 0 0 46px 8px rgba(71, 171, 255, 0.1);
            border-radius: 11px;
            background-color: #fff;
            margin-bottom: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 65px 24px;
            min-height: 400px;

            .number-wrap {
                position: absolute;
                left: 28px;
                top: -42px;
                width: 84px;
                height: 84px;
                background-color: #ed6661;
                font-size: 28px;
                color: #fff;
                border-radius: 50%;
                text-align: center;
                overflow: hidden;
                line-height: 84px;
            }

            .title {
                font-size: 32px;
                font-weight: 600;
                color: rgb(30, 21, 21);
                margin-bottom: 32px;
                line-height: 1.4;
            }

            .option {
                width: 400px;
                height: 90px;
                line-height: 88px;
                border: solid 1px #fece22; /* no */
                border-radius: 144px;
                color: rgb(30, 21, 21);
                margin-bottom: 24px;
                font-size: 28px;
                padding: 0 40px;
                overflow: hidden;

                &.selected {
                    background-color: #ffcd00;
                }
            }

            .prev {
                position: absolute;
                left: 28px;
                bottom: 32px;
                color: rgb(63, 134, 255);
                font-size: 28px;
                text-decoration: underline;
            }

        }
    }
</style>