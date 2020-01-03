<template>
  <div class="download-pop"   @click="onClose">
    <div class="guide-pic"></div>
  </div>
</template>

<script>
  export default {
    name: 'download-pop',
    props: ['onClose']
  }
</script>

<style lang="less">
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("../img/@{url}");
  }
  .download-pop{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0, 0.6);
    z-index: 999;

    .guide-pic{
      position: absolute;
      top: 0;
      right: 23px;
      width: 536px;
      height: 353px;
      .bg('download_guide.png');
    }

  }
</style> 