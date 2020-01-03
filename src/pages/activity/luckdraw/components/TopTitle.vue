<template>
  <div :class="['top-title', topWidth]">
    <slot name="title"></slot>
  </div>
</template>

<script>
  export default {
    name: 'top-title',
    props: {
      topWidth:{
        type: String
      },
    }
  }
</script>

<style lang="less" scoped>
</style> 