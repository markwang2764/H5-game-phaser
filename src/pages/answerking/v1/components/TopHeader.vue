<template>
    <div :class="['m-top-header', page === 'home' ? '' : 'small']">
            <div class="banner-wrap">
                  <div class="banner-img"></div>
            <div class="banner-text">{{text}}</div>
            </div>
            <div class="atmos" v-if="page !== 'home'"></div>
    </div>
</template>
<script>
export default {
    name: 'top-header',
    props: {
      page:{
        type: String,
        default: ''
      }
    },
    data() {
        return {
            text: '参与答题领奖金，答对越多金额越高'
        }
    }
}
</script>
<style lang="less" scoped>
     .bg(@url) {
        background-repeat: no-repeat;
        background-size: cover;
        background-image: url("../img/@{url}");
    }
    .m-top-header{
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .banner-wrap{
            margin-top: 109px;
        }
        .banner-img{
            width: 599px;
            height: 186px;
            margin-left: 12px;
            margin-bottom: 7px;
            .bg('banner_title.png');
        }
        .banner-text{
            width: 555px;
            height: 54px;
            line-height: 54px;
            color: #fff;
            font-size: 32px;
            margin-left: 24px;

            text-align: center;
            background-color: #5044EE;  
            border-radius: 27px;   
            margin-bottom: 25px;
        }

        &.small{
            .banner-wrap{
                margin-top: 69px;
                transform-origin: center  top;
                transform: scale(0.8);
            }
            
            .atmos{
                position: absolute;
                top: 40px;
                left: 84px;
                display: block;
                width: 591px;
                height: 366px; 
                .bg('atmos.png');  
            }
        }
    }
     
</style>
