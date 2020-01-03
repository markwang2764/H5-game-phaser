<template>
    <div class="home-page">
      <top-title topWidth="top-512">
          <div slot="title" class="top-title-text">
            <span class="title-bigger">我</span>
            <span class="title-smaller">当前的朋友圈价值</span>
          </div>
      </top-title>
      <div class="scan-worth">
        <span class="scan"></span>
        <i class="portrait1"></i>
        <i :class="['portrait2', 'portrait2-' + index]" ref="portrait" v-for="(item,index) in [1,1,1,1,1]"></i>
        <span class="scan-text">{{scanText}}</span>
      </div>
      <div class="tip">朋友越多, 价值越高喔</div>
      <div class="tip-grey">现金大放送：已有xx名人领取红包</div>
    </div>
</template>

<script>
  const PORTRAITTIME = [100, 200, 600, 1100, 1700];
  import TopTitle from '../../components/TopTitle.vue';
  export default {
    name: 'home',
    components: {TopTitle},
    data() {
      return {
        scanText: '价值计算中.',
      }
    },
    mounted() {
      let t = setInterval(() => {
        if(this.scanText.length<8){
          this.scanText = this.scanText + '.'
        }else{
          this.scanText = '价值计算中.'
        }
      },300)
      setTimeout(() => {
        clearInterval(t)
        this.$router.push('result')
      }, 2000);
      this.$refs.portrait.forEach((item, i) => {
        item.style.animation = `portrait-an 200ms linear ${PORTRAITTIME[i]}ms`
        setTimeout(() => {
          item.style.width = '.525rem'
          item.style.height = '.54rem'
        }, PORTRAITTIME[i]) 
      })
    },
    methods: {
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
  .home-page{
    .scan-worth{
      margin-top: 59px;
      width: 580px;
      height: 580px;
      margin-left: 50%;
      transform: translate(-290px,0);
    }
    .tip{
      margin-top: 65px;
    }
    .tip-grey{
      margin-top: 28px;
    }
    .scan-worth{
      position: relative;
    }
    .scan-text{
      font-family: Adobe Heiti Std R;
      font-weight: 500;
      color:#393631;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: 105px;
      margin-left: -75px;
      font-size: 15px;
    }
    .scan{
      animation: scan-an 2s linear;
      animation-fill-mode: forwards;
      transform-origin: 0 50%;
      position: absolute;
      left: 50%;
      top:168px;
      display:block;
      width: 290px;
      height: 243px;
      .bg('scan.png');
    }
    .portrait1{
      position: absolute;
      left:50%;
      top: 50%;
      margin-left: -81px;
      margin-top: -84px;
      width:162px;
      height: 168px;
      .bg('portrait-1.png')
    }
    .portrait2{
      position: absolute;
      width: 0;
      height: 0;
      .bg('portrait-2.png');
      opacity: 0.5;
    }
    .portrait2-0{
      left: 65%;
      top:28%;
    }
    .portrait2-1{
      left: 70%;
      top:0%;
    }
    .portrait2-2{
      left: 10%;
      top:14%;
    }
    .portrait2-3{
      left: 10%;
      top:68%;
    }
    .portrait2-4{
      left: 78%;
      top:70%;
    }
  }
  @keyframes scan-an
  {
    from {transform: rotate(0)}
    to {transform: rotate(-340deg)}
  }
  
</style> 