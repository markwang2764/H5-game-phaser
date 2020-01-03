<template>
  <div class="top-header">
    <div class="top-header-img-wrap">
      <img class="top-header-img" src="../img/bg_header.png">
      <div class="intro" v-if="intro">
        {{intro}}
      </div>
    </div>
    <div :class="['title', align]">{{title}}</div>

  </div>
</template>

<script>
  export default {
    name: 'top-header',
    props: {
      title:{
        type: String
      },
      align: {
        type: String,
        default: 'center'
      },
      intro: {
        type: String
      }
    }
  }
</script>

<style lang="less" scoped>
  .top-header{
    position: relative;
    .line(@n) {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: @n;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }

    .intro{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 15px 24px;
      font-size: 26px;
      line-height: 1.8;
      color: #fff;
      background-color: rgba(255, 154, 130, 0.8);
      max-height: 300px;
      overflow: hidden;
    }
    .top-header-img{
      width: 750px;
      height: 350px;
    }

    .top-header-img-wrap{
      position: relative;
    }

    .title{
      font-size: 40px;
      color: rgb(30,21,21);
      padding: 42px 24px;
      font-weight: 600;
      line-height: 1.7;

      &.left{
        text-align: left;
      }
      &.right{
        text-align: right;
      }
      &.center{
        text-align: center;
      }
    }
  }

</style> 