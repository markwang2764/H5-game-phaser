<template>
    <div class="page-1006">
      <top-title topWidth="top-512">
        <div slot="title" class="top-title-text">
          <span class="title-bigger">我</span>
          <span class="title-smaller">的朋友圈价值</span>
        </div>
      </top-title>
      <div class="max-worth" v-if="false">
        <span>最大估值10.88元</span>
      </div>
      <div ref="meter" class="meter" v-else>
        <div class="block" v-for="(v,i) in [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]"
          :style="{transform: `rotateY(180deg) rotateZ(${i*15+75}deg) translateY(102px)`}"
        ><div class="block-yellow"></div></div>
        <div class="price">
          <i class="yuan" ref="yuan"></i>
          <i class="dian"></i>
          <i class="mao" ref="mao"></i>
          <i class="fen" ref="fen"></i>
          <i class="unit"></i>
        </div>
      </div>
      <achieve-rich :duration="duration" :num="200" :marginTop="30" />
      <Bulletin :duration="duration">
        <template slot="desc">
          <div class="desc desc-first">目前还没有好友替你增值哦</div>
          <div class="desc desc-second">快来邀请好友吧~</div>
        </template>
      </Bulletin>
      <div class="tip">参与用户越多, 收益更高哦！</div>
      <!-- <div class="normal-btn">邀请好友为我增值</div> -->
      <div class="small-btn" ref="button">为他助力</div>
    </div>
</template>

<script>
  import TopTitle from '../../components/TopTitle.vue';
  import AchieveRich from '../../components/AchieveRich.vue';
  import Bulletin from '../../components/Bulletin.vue';
  import {accDiv,accAdd} from '../../components/utills';
  export default {
    name: 'result',
    components: {TopTitle,AchieveRich,Bulletin},
    data() {
      return {
        duration: 0,
        price: 0,
      }
    },
    mounted() {
       /*
       * 仪表计算价值动画加载
       */
      const result = 9.88 //改成后端给的值
      this.duration = 6 * 100
      let stepSize = parseFloat(accDiv(result,6*10))
      let t = setInterval(() => {
          this.price = accAdd(stepSize,this.price)
          this.$nextTick(() => {
            this.handleBgPosition(this.price)
          })
      },10)
      
      this.$refs.button.style.animation = `button-an 500ms linear ${this.duration+200}ms forwards`
      setTimeout(() => {
        this.$refs.button.style.opacity = 1
      }, this.duration+210);
      setTimeout(() => {
        clearInterval(t)
        this.price = result
        this.$nextTick(() => {
          this.handleBgPosition(this.price)
        })
      }, this.duration);
      this.$refs.meter.querySelectorAll('.block').forEach((item, i) => {
        if((15-i)<=6){
          item.childNodes[0].style.animation = `meter-an 100ms linear ${(15-i)*100}ms`
          setTimeout(() => {
            item.childNodes[0].style.backgroundColor = `#F5C82B`
          }, (15-i)*100);
        }
      }) 
    },
    beforeDestroy() {
    },
    methods: {
      handleBgPosition(thisPrice) {
        let price = thisPrice.toString().split('')
        this.$refs.yuan.style.backgroundPosition=`${-0.29*price[0]}rem 0`
        this.$refs.mao.style.backgroundPosition=`${-0.29*(price[2]||0)}rem 0`
        this.$refs.fen.style.backgroundPosition=`${-0.29*(price[3]||0)}rem 0`
      }
    },
    computed: {}
  }
</script>

<style lang="less" scoped>
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("../../img/@{url}");
  }
  .page-1006{
    .max-worth{
      position: relative;
      width: 482px;
      height: 318px;
      margin-top: 35px;
      margin-left: 50%;
      transform: translate(-241px,0);
      .bg('value_header.png');
      span{
        font-family: PingFang-SC-Heavy;
        font-weight: bold;
        font-size: 40px;
        color:#fff;
        position: absolute;
        top: 16px;
        left: 150px;
        // webkit-text-fill-color: #fff;/*文字的填充色*/
        -webkit-text-stroke: 2px black;/*描边的像素，也就是粗细，这里指定是2像素的黑色边框*/
      }
    }
    .meter{
      position: relative;
      width: 430px;
      height: 279px;
      margin-top: 57px;
      margin-left: 50%;
      transform: translate(-215px,0);
      .block{
        box-sizing: content-box;
        position: absolute;
        display:block;
        width: 22px;
        height: 51px;
        border: 2px solid #000;
        border-radius: 22px;
        background-color: #fff; 
        top:187px;
        left:50%;
        margin-left: -11.5px;
      }
      .block-yellow{
        width: 100%;
        height: 100%;
        border-radius: 22px;
        background-color: #FFF;
      }
      .price{
        width: 252px;
        height: 76px;
        position: absolute;
        bottom: 10px;
        left: 50%;
        margin-left: -123px;
        font-size: 0;
        .yuan,.mao,.fen,.dian{
          .bg('num.png');
        }
        .dian{
          width: 14px;
          height:42px;
          background-position: -328px 0;
        }
        .yuan,.mao,.fen{
          width: 58px;
          height: 76px;
        }
        .unit{
          .bg('yuan.png');
          width: 45px;
          height:42px;
          margin-left: 11px;
        }
      }
    }
    .tip{
      margin-top: 39px;
    }
    .normal-btn,.small-btn{
      margin-top: 19px;
    }
  }
 
</style> 