<template>
    <modal :show.sync="_show" @click="close">
        <div>
            <img src="../../../img/download.png" alt="">
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
div{
    width: 100%;
    height: 100vh;
}
img {
  width: 694px;
  height: 604px;
  position: absolute;
  top: 20px;
  right: 50px;
}
</style>
