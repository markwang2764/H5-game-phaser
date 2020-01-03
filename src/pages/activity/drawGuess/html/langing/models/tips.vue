<template>
  <modal :show.sync="_show">
    <div class="keyword-tips">
      <img src="../../../img/arrow.png" v-show="data.isTips" alt="" class="arrow">
      <div class="t-body">
        <div class="t-title">{{data.title}}</div>
        <div class="keyword">答案是：{{data.tipsKey}}
          <span class="red" v-show="data.isTips">{{'*'.repeat(data.restCount)}}</span>
          <div class="share-tips" v-show="data.isTips">发送到群或朋友圈获取更多提示</div>
        </div>
        <div class="close" @click="beforeClose"></div>
      </div>
    </div>
  </modal>
</template>
<script>
import itemMixins from '@components/pop/modelItemMixins';
export default {
  mixins: [itemMixins],
  mounted() {
    this.$bus.$on('shareSuccess', () => {
      this.beforeClose();
    });
    console.log(this.data.isTips,'==>tips');
    if (!this.data.isTips) {
      setTimeout(() => {
        this.beforeClose();
        console.log(98);
      }, 2000);
    }
  },
  methods: {
    beforeClose() {
      if (!this.data.isTips) {
        this.$bus.$emit('finnal', {
          timeOut: true
        });
      }
      this.$bus.$emit('close');
      this.close();
    }
  }
};
</script>
<style lang="less" scoped>
.keyword-tips {
  width: 100%;
  height: 100vh;
}
.t-body {
  width: 468px;
  height: 451px;
  background: url('~@pages/activity/drawGuess/img/tips-bg.png') no-repeat;
  background-size: contain;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.arrow {
  position: absolute;
  right: 50px;
  top: 20px;
  width: 89px;
  height: 167px;
}
.t-title {
  margin-top: 146px;
  font-size: 40px;
  text-align: center;
  color: rgb(252, 96, 97);
}
.keyword {
  position: absolute;
  left: 20px;
  top: 285px;
  font-size: 30px;
  width: 420px;
  height: 50px;
  text-align: center;
  .share-tips {
    font-size: 28px;
    margin-top: 50px;
  }
}
.close {
  width: 60px;
  height: 60px;
  position: absolute;
  top: 130px;
  right: 5px;
}
</style>


