<template>
  <div class="achieve-rich-num" :style="{marginTop: marginTop ? marginTop/200 + 'rem' : 0.29 + 'rem'}">
        致富指数:
        <i class="star star-3" v-for="p in num"></i>
  </div>
</template>

<script>
  export default {
    name: 'achieve-rich',
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
 .achieve-rich-num{
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      text-align: center;
      color: #2E3726;
      font-size: 36px;
    }
</style> 