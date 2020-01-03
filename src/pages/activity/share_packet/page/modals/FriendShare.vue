<template>
  <modal :show.sync="_show" >
    <div class="bindmobile-modal">
     <div class="money">￥{{ data.money }}</div>
     <div class="money-content">恭喜您，你拆到{{ data.money }}元现金红包</div>
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
    handleClick() {
      this._show = false;
      axios.get("/youtui/temporary/redPacket/receive", {
        params: {
          img: this.data.img,
          pop: this.data.pop,
          sourceUserId: getUrlParameter("sourceUserId") || '',
          userId: this.data.userId,
          version: getUrlParameter("version") || ''
        }
      }).then((res)=>{        
        this.$bus.$emit("showModal", {
          modalId: 'FriendGet',
          data: {
            money: res.data.data.money,
            img: res.data.data.downloadCode
          }
        });
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
  .bindmobile-modal {
    width: 600px;
    height: 806px;
    position: relative;
    padding-top: 200px;
    .bg("receive.png");
    .btn {
      height: 200px;
      width: 200px;
      position: absolute;
      bottom: 110px;
      left: 200px;
      font-size: 48px;
      color: #CB211E;
      letter-spacing: 1px;
      text-align: center;
      .bg('button3.png');
    }
    .money {
      font-size: 128px;
      color: #EA390D;
      letter-spacing: 0.29px;
      text-align: center;
    }
    .money-content {
      font-size: 32px;
      color: #EA390D;
      letter-spacing: 0.07px;
      text-align: center;
      font-weight: bold;
      margin-top: 60px;
    }
  }
</style>
