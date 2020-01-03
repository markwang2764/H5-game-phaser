<template>
  <div class="wx-share-pop"  @click="onClose">
    <div class="guide-pic">
      <div class="wx-click-area"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'wz-share-pop',
    props: ['onClose']
  }
</script>

<style lang="less">
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("../img/@{url}");
  }
  .wx-share-pop{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0, 0.7);
    z-index: 999;

    .guide-pic{
      position: absolute;
      top: 0;
      right: 23px;
      width: 703px;
      height: 522px;
      .bg('wx_share2.png');
    }

    .wx-click-area{
      position: absolute;
      top: 440px;
      left: 288px;
      width: 130px;
      height: 54px;
    }
  }
</style> 