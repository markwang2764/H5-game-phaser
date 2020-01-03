<template>
  <modal :show.sync="_show">
    <div class="friendget-modal">
     <div class="money">￥{{data.money}}</div>
     <div class="money-content">
      下载app，立即提现{{data.money}}元现金<br/>
      长按二维码进群领取下载码
     </div>
     <img :src="data.img" alt="" class="code">
     <div class="describe">
      ios用户暂时无法参与<br/>
      已下载趣晒的用户无法参与
    </div>
    </div>
  </modal>
</template>

<script>
import Modal from "@components/pop/Modal";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      
    };
  },
  components: {
    Modal
  },
  methods: {
    handleClick() {
      this._show = false;
    }
  },
  computed: {
    _show: {
      get: function() {
        return this.show;
      },
      set: function(val) {
        this.$emit("update:show", val);
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("~@pages/activity/share_packet/img/@{url}");
  }
  .friendget-modal {
    width: 548px;
    height: 924px;
    padding-top: 80px;
    .bg('bg33.png');
    .describe {
      font-size: 32px;
      color: #9B9B9B;
      letter-spacing: 2px;
      text-align: center;
      line-height: 50px;
    }
    .money {
      font-size: 128px;
      color: #EA390D;
      text-align: center;
    }
    .money-content {
      font-size: 32px;
      color: #222;
      text-align: center;
      margin-top: 60px;
      line-height: 50px;
    }
    .code {
      width: 330px;
      height: 330px;
      margin: 50px 113px 38px;
    }
  }
</style>
