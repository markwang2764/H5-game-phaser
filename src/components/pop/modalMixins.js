/**
 * 房间弹窗控制
 */
// 父级组件mixin
export default {
  data() {
    return {
      modalShow: false,
      curview: '',
      data: {},
      chargeShow: false
    };
  },

  components: {},

  methods: {
    showModel(params) {
      this.curview = params.modalId;
      this.data = params.data;
      this.modalShow = true;
      console.log(params);
    }
  },

  mounted() {
    // 弹窗切换
    this.$bus.$on('showModal', params => {
      this.curview = params.modalId;
      this.data = params.data;
      this.modalShow = true;
    });
  }
};
