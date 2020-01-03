<template>
  <modal :show.sync="_show" :clearArea="true" :close="'.share-modal'">
    <div class="share-modal">
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
  .share-modal {
    width: 600px;
    height: 440px;
    .bg('share.png');
    position: absolute;
    top: 260px;
    left: 440px;
  }
</style>
