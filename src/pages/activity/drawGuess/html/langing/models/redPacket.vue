<template>
  <modal :show.sync="_show">
    <div class="red-wrap">
      <img src="../../../img/red-model.png" alt="">
      <div class="s-content" :class="{noRed:!data.hasRed}">
        <template v-if="data.hasRed">
          <div class="s-title">
            猜对了，用时{{data.time}}秒！
          </div>
          <div class="s-reward">
            获得
            <span class="s-word">{{data.redPacket}}</span>元
          </div>
        </template>
        <template v-if="!data.hasRed">
          <div class="s-title">
            猜对了，可惜红包被瓜分完了～
          </div>
          <div class="s-subtitle">
            获得猜画鼓励金
          </div>
          <div class="s-reward">
            <span class="s-word">{{data.redPacket}}</span>元
          </div>
        </template>
        <div class="s-tips">机智如你，快留下大名吧！</div>
        <input type="text" placeholder="" v-model="nickName">
        <img src="../../../img/confirm.png" class="confirm" @click="confirmName" alt="">
      </div>
    </div>
  </modal>
</template>
<script>
import itemMixins from '@components/pop/modelItemMixins';
import fetch from '@js/fetch';
export default {
  mixins: [itemMixins],
  data() {
    return {
      nickName: ''
    };
  },
  methods: {
    confirmName() {
      this.close();
      this.$bus.$emit('finnal',{
        hasRed:this.data.hasRed
      })
      fetch({
        url: '/youtui/paintAndGuess/updateNickName',
        params: {
          answerRecordId: this.data.answerRecordId,
          nickName: this.nickName,
          paintRecordId:this.data.paintRecordId
        }
      }).then(res => {
        this.$bus.$emit('getList')
      });
    }
  }
};
</script>

<style lang="less" scoped>
.red-wrap {
  width: 737px;
  height: 868px;
  text-align: center;
}
.s-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  .s-title {
    font-size: 30px;
    color: #fff;
    margin-top: 193px;
  }
  &.noRed {
    .s-title {
      margin-top: 166px;
    }
    .s-reward {
      margin-top: 22px;
    }
  }
  .s-subtitle {
    margin-top: 48px;
    font-size: 40px;
    color: #ffd339;
  }
  .s-reward {
    color: #fff06d;
    font-size: 40px;
    margin-top: 40px;
    .s-word {
      font-size: 80px;
    }
  }
  .s-tips {
    position: absolute;
    width: 100%;
    top: 450px;
    color: #9e1e19;
    font-size: 28px;
  }
  input {
    position: absolute;
    top: 500px;
    left: 100px;
    font-size: 50px;
    background-color: transparent;
  }
  .confirm {
    position: absolute;
    top: 650px;
    left: 76px;
  }
}
.confirm {
  width: 584px;
  height: 104px;
  margin: auto;
  display: block;
}
</style>
