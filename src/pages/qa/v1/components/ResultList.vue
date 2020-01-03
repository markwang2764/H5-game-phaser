<template>
    <ul class="result-list">
        <li :class="['result-item', item.open ? 'open' : '']" @click="itemClick(index)"
            v-for="(item, index) in resultList">
            <div class="item-hd">
                <div class="item-title">{{item.title}}</div>
                <div class="item-hd-right">
                    <template v-if="index+1<=unlockNum">
                        <img class="item-hd-arrow" src="../img/arrow_down_grey.png">
                    </template>
                    <template v-else>
                        <span class="invite-text" v-if="page==='result'">邀请好友来帮你解锁答案</span>
                        <div class="to-unlock" v-else>待解锁</div>
                        <img class="item-hd-lock" src="../img/ic_lock.png">

                    </template>
                </div>
            </div>
            <div class="item-bd" v-if="index+1<= unlockNum">
                <div class="item-plist" >
                    <template v-for="(p, j) in divideContext(item.context).expand">
                        <template v-if="(index ===0 && j === 0 || index !== 0 && j === 1) && item.image">
                            <img class="item-image" :src="item.image"/>
                        </template>
                        <p >{{p}}</p>
                    </template>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
  import {divideContext} from './mixins';
  import WxSharePop from './WxSharePop.vue';

  export default {
    name: 'result-list',

    data() {
      return {}
    },
    mounted() {
      console.log('unlockNum = ' + this.unlockNum)
      this.expandAll();
    },
    mixins: [divideContext],
    props: {
      resultList: {
        type: Array,
        default: () => []
      },
      unlockNum: {
        type: Number,
        default: 999 // 默认全部解锁
      },
      page: {
        type: String,
        default: 'result'
      },
      onInviteClick: {
        type: Function,
        default: ()=>{}
      }
    },
    methods: {
      itemClick(index) {
        if (this.page === 'result' && index +1 > this.unlockNum) {
          this.onInviteClick();
        } else {
          this.toggleResultItem(index);
        }
      },
      toggleResultItem(index) {
        if (index+1<= this.unlockNum) {
          let newValue = Object.assign({}, this.resultList[index], {open: !this.resultList[index].open});
          this.$set(this.resultList, index, newValue)
        }
      },
      expandAll() {
        console.log(this.resultList)

        setTimeout(()=>{
          console.log(this.resultList)

        }, 5000 )
        this.resultList.forEach((item, index)=>{
          let newValue = Object.assign({}, this.resultList[index], {open: true});
          console.log(newValue)
          this.$set(this.resultList, index, newValue)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    .result-list {
        .result-item {
            box-shadow: 0 0 46px 8px rgba(71, 171, 255, 0.1);
            border-radius: 11px;
            background-color: #fff;
            padding: 30px 24px;
            margin-bottom: 24px;

            .item-hd {
                display: flex;
                flex-direction: row;
                align-items: center;
                .item-title {
                    flex: 1;
                    font-size: 32px;
                    color: #000;
                    font-weight: 600;

                }
                .item-hd-right {
                    .invite-text {
                        color: #1e1515;
                        font-size: 28px;
                        vertical-align: middle;
                    }
                    .to-unlock {
                        display: inline-block;
                        font-size: 28px;
                        color: #666;
                        border-radius: 50px;
                        height: 50px;
                        line-height: 48px;
                        border: solid 1px #1e1515; /* no */
                        vertical-align: middle;
                        padding: 0 10px;

                    }
                    .item-hd-lock {
                        width: 32px;
                        height: 36px;
                        margin-left: 20px;
                        vertical-align: middle;
                    }
                }
                .item-hd-arrow {
                    width: 36px;
                    transform: rotate(0deg);
                    transition: transform 0.2s;
                }
            }
            .item-bd {
                margin-top: 20px;
                overflow: hidden;
                /*max-height: 0;*/
                /*transition: max-height 0.2s;*/
                display: none;

                .item-image {
                    width: 100%;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                .item-plist {
                    font-size: 28px;
                    color: #1e1515;
                    line-height: 1.7;
                    p{
                        text-indent: 2em;
                    }
                }
            }

            &.open {
                .item-hd-arrow {
                    transform: rotate(180deg);
                }
                .item-bd {
                    /*max-height: 1000px;*/
                    display: block;
                }
            }
        }
    }
</style>
