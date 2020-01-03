<template>
  <modal :show.sync="_show">
    <div class="red-envelope">
     <div class="money-title">恭喜你获得一个<br/>现金红包</div>
     <div class="money">最高{{ data.money }}元</div>
     <div class="btn" @click="handleClick"></div>
    </div>
  </modal>
</template>

<script>
import Modal from "@components/pop/Modal";
import axios from 'axios';
import {getUrlParameter,setLocalStorage,getLocalStorage} from '@pages/activity/share_packet/components/utils';
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
    handleClick(e) {
      if(e.target.tagName.toLowerCase()=== "div") {
        e.target.classList.add("transform");
        setTimeout(()=>{
         this._show = false;
        }, 1000)
      }

      axios.get("/youtui/temporary/redPacket/open", {
        params: {
          img: this.data.img,
          pop: true,
          sourceUserId: getUrlParameter("sourceUserId") || '',
          userId: getLocalStorage("userId") || '',
          version: getUrlParameter("sourceUserId") || ''
        }
      }).then((res)=>{
        //逻辑
        this._show = false;
      }).catch((err)=>{
        console.log('transferToAccount error');
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
  }
};
</script>

<style lang="less" scoped>
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("~@pages/activity/share_packet/img/@{url}");
  }
  .red-envelope {
    width: 600px;
    height: 800px;
    padding-top: 130px;
    .bg('redbag.png');
    .money-title {
      font-size: 48px;
      color: #FFD88E;
      text-align: center;
      line-height: 70px;
      margin: 0 0 68px;
    }
    .money {
      font-size: 60px;
      color: #FFD88E;
      text-align: center;
    }
    .btn {
      width: 200px;
      height: 200px;
      .bg("open.png");
      position: absolute;
      bottom: 100px;
      left: 200px;
    }
    .transform {
      animation: mymove 1s;
    }
    @keyframes mymove {
      0 {transform: rotateY(0deg);}
      20% {transform: rotateY(90deg);}
      40% {transform: rotateY(0deg);}
      60% {transform: rotateY(90deg);}
      80% {transform: rotateY(0deg);}
      100% {transform: rotateY(90deg);}
    }
  }
</style>
