<template>
  <transition name="fade">
    <div class="modal-container" v-show="show" ref="container">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: "modal",
  data(){
    return{
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    //弹窗位置
    //value:'middle' 水平垂直居中
    //value:'bottom' 页面底部
    position:{
      type:String,
      default:'middle'
    },
    //关闭弹窗元素选择器
    close:{
      type:String
    },
    //关闭弹窗回掉
    closeCb:{
      type:Function
    },
    confirm:{
      type:String
    },
    confirmCb:{
      type:Function
    },
    //是否点击空白区关闭
    clearArea:{
      type: Boolean,
      default: false
    }
  },

  mounted() {
    let parent = this.$refs.container
    let child = this.$slots.default[0].elm
    child.classList.add('modal-content',this.position)

    //绑定关闭事件
    if(!!this.close){
      Array.prototype.forEach.call(parent.querySelectorAll(this.close), (ele, index) =>{
        ele.addEventListener('click', ()=> {
          this.hide()
          this.closeCb && this.closeCb(this, child);
        })
      })
    }

    if (!!this.confirm) {
      Array.prototype.forEach.call(parent.querySelectorAll(this.confirm), (ele, index) =>{
        ele.addEventListener('click', function() {
          this.confirmCb && this.confirmCb(this);
        })
      })
    }

    //点击空白区关闭弹窗
    if (this.clearArea) {
      parent.addEventListener('click', (evt)=> {
        this.hide()
      })
      child.addEventListener('click', function(evt) {
        evt.stopPropagation()
      })
    }
  },
  methods:{
    hide(){
      this.$emit('update:show', false)
    }
  }
};
</script>

<style lang="less">
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 501;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.7);
}
.modal-content {
  &.middle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
  &.bottom {
    left: 0;
    bottom: 0;
    transform: none;
    top: auto;
    position: absolute;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
