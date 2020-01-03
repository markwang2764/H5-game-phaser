<template>
  <div class="item-page" v-if="isConfigLoaded">
    <top-header :title="configData.theme" :align="'left'" :intro="configData.introduce"></top-header>
    <div class="main-container">
      <questions></questions>
    </div>
  </div>
</template>

<script>
  import TopHeader from '../../components/TopHeader.vue';
  import Questions from '../../components/Questions.vue';
  import {getConfig} from '../../service/getData';
  import {getUrlParameter} from '../../components/utils'

  import {mapState, mapActions} from 'vuex';

  export default {
    name: 'item',
    data() {
      return {}
    },
    computed: {
      isConfigLoaded() {
        // 根据题目判断是否加载完配置信息
        return Object.keys(this.configData.questions).length > 0;
      },
      ...mapState([
        'configData'
      ])
    },
    components: {TopHeader, Questions},

    methods: {
      ...mapActions([
        'setConfigData'
      ])
    },

    mounted() {
      // 获取配置信息
      if (!this.isConfigLoaded) {
        getConfig()
          .then(result => {
            result = result.data;
            const {
              code,
              desc,
              data,
              success
            } = result;
            if (success) {
              this.setConfigData(data);
              this.$embed.update(data.embed);
              this.$embed.singleClk(this.$embed.TYPE_3);

              if (this.configData.hasAnswer) {
                this.$router.push({ path: '/result'})
              }
            } else {
              console.error(desc);
            }
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        this.$embed.singleClk(this.$embed.TYPE_3);
        if (this.configData.hasAnswer) {
          this.$router.push('/result');
        }
      }
    }
  }
</script>

<style lang="less">
  .item-page {
  }

</style> 