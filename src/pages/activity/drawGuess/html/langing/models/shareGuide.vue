// 分享引导蒙层


<template>
    <modal :show.sync="_show">
        <div class="share-guide" @click="close">
            <img src="../../../img/share-guide.png" alt="">
        </div>
    </modal>
</template>
<script>
import itemMixins from '@components/pop/modelItemMixins';
export default {
  mixins: [itemMixins]
};
</script>
<style lang="less" scoped>
@import '~@css/util.less';

.share-guide {
  width: 100%;
  height: 100vh;
  img {
    .size(671,546);
    .posr(50,20)
  }
}
</style>


