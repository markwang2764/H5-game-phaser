// 子级model组件mixin

import Modal from '@components/pop/Modal';
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
  components: {
    Modal
  },
  methods: {
    close() {
      this._show = false;
    }
  },
  computed: {
    _show: {
      get: function() {
        return this.show;
      },
      set: function(val) {
        this.$emit('update:show', val);
      }
    }
  }
};
