<template>
  <div class="home-page">
    
  </div>
</template>

<script>
import {getUrlParameter,isWeiXin,isAndroid,setLocalStorage,getLocalStorage} from '../../components/utils';
export default {
  name: 'ios',
  components: {
  },
  data() {
    return {
    };
  },
  methods: {
    
  },
  
  created() {
    
  },
  mounted() {
    
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
  width: 100%;
  height: 1600px;
  .bg('ios.png');
  background-color: #fff;
}
</style> 