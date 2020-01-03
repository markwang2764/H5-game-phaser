<template>
  <div class="achieve-rich-num" :style="{marginTop: marginTop ? marginTop/200 + 'rem' : 0.29 + 'rem'}">
        致富指数: 
        <i class="star-white"></i>
        <i class="star-yellow" ref="starYellow"></i>
  </div>
</template>

<script>
import {accDiv,accMul,accAdd} from '../components/utills.js'
  export default {
    name: 'achieve-rich',
    props: {
      num:{
        type: Number
      },
      marginTop:{
        type: Number
      },
      duration:{
        type: Number
      }
    },
    mounted() {
      let num = this.num
      let width = 0
      let stepSize = accMul(10,accDiv(num,600))
      setTimeout(() => {
        var t = setInterval(() => {
          width = accAdd(width, stepSize)
          this.$refs.starYellow.style.width = accDiv(width,200)+'rem'
        }, 10)
        setTimeout(() => {
          clearInterval(t)
        }, 600);
      }, 400);
    }
  }
</script>

<style lang="less" scoped>
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("../img/@{url}");
  }
 .achieve-rich-num{
      position: relative;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: #2E3726;
      font-size: 36px;
      height: 54px;
      width:430px;
      transform: translateX(-215px);
      margin-left: 50%;
      line-height: 54px;
      i{
        width:237px;
        height: 54px;
        position: absolute;
        left: 198px;
        top:0;
        background-size: 237px 54px !important;
      }
      .star-white{
        .bg('star-white.png');
      }
      .star-yellow{
        .bg('star-yellow.png');
        width:0;
      }
    }
</style> 