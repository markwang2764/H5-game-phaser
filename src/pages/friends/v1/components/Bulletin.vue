<template>
  <div class="bulletin">
    <div class="sheft"></div>
    <div class="curtain-wrapper">
        <div class="curtain" ref="curtain">
          <slot name="desc"></slot>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'bulletin',
    props: {
      num:{
        type: Array
      },
      marginTop:{
        type: Number
      },
      duration:{
        type: Number
      }
    },
    mounted() {
      setTimeout(() => {
         setTimeout(() => {
          this.$refs.curtain.style.transform = 'translateY(-.385rem)'
        }, 50);
        setTimeout(() => {
          this.$refs.curtain.style.transform = 'translateY(-.1rem)'
        }, 70);
        setTimeout(() => {
          this.$refs.curtain.style.transform = 'translateY(0rem)'
        }, 90);
      }, 700);
    }
  }
</script>

<style lang="less" scoped>
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("../img/@{url}");
  }
 .bulletin{
    margin-top: 36px; 
      .sheft{
        width:520px;
        height:36px;
        margin-left: 50%;
        transform: translate(-260px,0);
        .bg('sheft.png');
      }
      .curtain-wrapper{
        width:480px;
        height:154px;
        margin-left: 50%;
        margin-top: -20px;
        transform: translate(-240px,0);
        overflow: hidden;
      }
      .curtain{
        border-top: 1px solid transparent;
        transform: translate(0,-154px);
        width:100%;
        height: 100%;
         .bg('bulletin.png');
      }
    }
</style> 