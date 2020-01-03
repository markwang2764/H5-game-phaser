<template>
  <div class="home-page">
    <img src="../../img/bg2.png" alt="" class="bg-img">
    <img class="title-img" src="../../img/title2.png"></img>
    <div class="btn" @click="handleClick"></div>

    <component :is="curview" :show.sync="modalShow" :data="data"></component>
  </div>
</template>

<script>
import TopTitle from '../../components/TopTitle.vue';
import axios from 'axios';
import modalMixins from '@components/pop/modalMixins'; // 弹窗系列控制
import {isWeiXin, getUrlParameter,getWxConfig,getOpenid,setLocalStorage,getLocalStorage} from '../../components/utils';
export default {
  name: 'langing',
  components: {
    TopTitle,
    FriendShare: resolve => {
      require(['../../page/modals/FriendShare.vue'], resolve);
    },
    FriendGet: resolve => {
      require(['../../page/modals/FriendGet.vue'], resolve);
    },
    redEnvelope: resolve => {
      require(['../../page/modals/redEnvelope.vue'], resolve);
    },
    redBag: resolve => {
      require(['../../page/modals/redBag.vue'], resolve);
    },
    userShare: resolve => {
      require(['../../page/modals/userShare.vue'], resolve);
    }
  },
  mixins: [modalMixins],
  data() {
    return {
      dataList: {}
    };
  },
  mounted() {},
  methods: {
    handleClick() {
      axios.get("/youtui/temporary/redPacket/helpOpen", {
        params: {
          img: this.dataList.img || '',
          pop: this.dataList.pop || false,
          sourceUserId: getUrlParameter("sourceUserId") || '',
          userId: this.dataList.userId || "",
          version: getUrlParameter("version") || ''
        }
      }).then((res)=>{
        if(res.data.data) {
          window.location.href = res.data.data;
        } else {
          this.handlePop();
        }
      }).catch((err)=>{
        console.log('transferToAccount error');
      })
    },

    handlePop() {
    this.$bus.$emit('showModal', {
        modalId: 'redEnvelope',
        data: {
          money: this.dataList.money,
          finish: this.dataList.finish,
          url: this.dataList.url,
          userId: this.dataList.userId,
          pop: this.dataList.pop,
          img: this.dataList.img
        }
      });
    }
  },
  computed: {},
  mounted() {
    if(window.CFG) {
        this.dataList = window.CFG;

        //是否需要微信授权
        if(!window.CFG.authed) {
          document.body.innerHTML = "";
          getOpenid(window.CFG);  
        } else {
          setLocalStorage("userId", this.dataList.userId)
          if(this.dataList.pop === true ) {
            this.handlePop();
          }
        }

      }
  }
};
</script>

<style lang="less" scoped>
.bg(@url) {
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('../../img/@{url}');
}
.home-page {
  position: relative;
  height: 100vh;
  width: 100%;
  background-color: #ffefd2;
  .bg-img {
    width: 100%;
  }
  .title-img {
    height: 160px;
    width: 424px;
    position: absolute;
    top: 100px;
    right: 162px;
  }
  .btn {
    width: 242px;
    height: 248px;
    .bg("help.png");
    position: absolute;
    top: 760px;
    left: 256px;
  }
}
</style> 