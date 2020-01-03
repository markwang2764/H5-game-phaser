<template>
    <div class="home-page">
        <top-header :page="'home'"></top-header>
        <div class="barrage-container">
            <barrage v-if="barrages.length > 0" :barrages="barrages" :width="750" :height="600"></barrage>
        </div>
        <div v-if="!inApp" class="btn-yellow" @click="start">开始答题</div>
        <template v-else>
            <div class="btn-yellow" @click="invite">立即邀请</div>
        </template>
        

    </div>
</template>

<script>
import TopHeader from '../../components/TopHeader';
import Barrage from '../../components/Barrage';
import {getUrlParameter} from '@js/utils';
import bridge from '@components/bridge/index';
import {getCommonShare} from '../../service/getData.js';

export default {
    name: 'home',
    components: {TopHeader, Barrage},
    props: {
        barrages: {
            type: Array,
            default: ()=>[]
        },
    },

    data() {
        return {
            inApp: false
        }
    },
    methods:{
        start(){
            console.log('start')
            this.$embed.singleClk(this.$embed.TYPE_2, null , {
                page_share_source: 1
            })
            this.$embed.singleClk(this.$embed.TYPE_3, null, {
                answer_source: '1' 
            });
             this.$bus.$emit('changeState', {state: 'item'});
        },
        invite(){
            console.log('invite')
            // alert('调起app内分享');
            bridge.h5Share({
                shareType: 1,
                needDraw:0, 
            });
        },
        invite2(){
            bridge.testShare();
        },
        commonShareTest() {
            getCommonShare()
            .then(result => {
                result = result.data;
                const { code, desc, data, success } = result;
                if (success && data) {
                console.log(JSON.stringify(data));
                } else {
                console.error(desc);
                }
            })
            .catch(err => {
                console.error(err);
            });
        }

    },
    mounted() {
        this.inApp = getUrlParameter('appPreview') ? true : false; // appPreview 在端内=1
        if (this.inApp) {
            // app端内
            this.$embed.singleClk(this.$embed.TYPE_15)

        } else{
            this.$embed.singleClk(this.$embed.TYPE_1, null , {
                source_user_id: getUrlParameter('sourceUserId'),
                page_share_source: 1
            })

        }
        // this.commonShareTest();
        console.log('home init')
    }
}
</script>
<style lang="less" scoped>
    .bg(@url) {
        background-repeat: no-repeat;
        background-size: cover;
        background-image: url("../../img/@{url}");
    }
    .bg-fill(@url) {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url("../../img/@{url}");
    }

    .home-page{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 750px;
        height: 1206px;
        .bg('bg_home.png');

        .barrage-container{
            width: 100%;
            height: 600px;
            margin-bottom: 20px;

        }
        .btn-yellow{
            display: inline-block;

            width: 596px;
            height: 143px;
            color:#16151A;
            font-size: 56px;
            font-weight: 600;
            text-align: center;
            line-height: 120px;
            .bg-fill('btn_yellow.png');
        }
    }
</style>

