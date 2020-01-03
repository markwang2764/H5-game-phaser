<template>
  <modal :show.sync="_show" :clearArea="true">
    <div class="share-modal">
      <div class="code">活动奖励码:<span id="two">{{ data.cdk }}</span></div>
      <div class="btn is-code" @click="handCopy" data-clipboard-action="copy" data-clipboard-target="#two" ref="copy">复制</div>
    </div>
  </modal>
</template>

<script>
import Modal from "@components/pop/Modal";
import toast from "../toast/index";
import {isAndroid, isWeiXin, getUrlParameter} from '../utils';
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
      copyBtn: null
    };
  },
  components: {
    Modal
  },
  methods: {
    handCopy() {
      let clipboard = this.copyBtn;
      clipboard.on('success', (e)=>{
        e.clearSelection();
      })
      this.$embed.singleClk(this.$embed.TYPE_904, {page_source: this.data.page_source})
      toast.make({
        content: "复制成功！"
      })
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
  },
  mounted() {
    this.copyBtn = new ClipboardJS(this.$refs.copy);
  }
};
</script>

<style lang="less" scoped>
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("~@pages/activity/luckdraw/img/@{url}");
  }
  .share-modal {
    width: 662px;
    height: 577px;
    .bg('share.png');
    position: absolute;
    top: 300px;
    left: 400px;
    .code {
      font-size: 24px;
      position: absolute;
      top: 350px;
      left: 130px;
      span {
        display: inline-block;
        width: 170px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #ff8c1c;
        font-size: 24px;
        border: none;
        background-color: #fff8ef;
      }
    }
    .btn {
      position: absolute;
      top: 350px;
      left: 456px;
      color: #fff;
      font-size: 24px;
    }
  }
</style>
