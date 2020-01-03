<template>
  <div class="bulletin">
    <div class="sheft"></div>
    <div class="curtain">
      <slot name="desc"></slot>
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
      .curtain{
        border-top: 1px solid transparent;
        width:480px;
        height:154px;
        margin-left: 50%;
        margin-top: -20px;
        transform: translate(-240px,0);
        .bg('bulletin.png')
      }
    }
</style> 