<template>
    <div class="popup-container">
        <main>
            <div class="tip">趣晒已为你的题配置：</div>
            <div class="money">100<span class="font-smaller">元</span></div>
            <div class="tip2"><span class="color-yellow">前10名</span>答对的好友将瓜分此红包，参与答题的好友，收益越多</div>
        </main>
        <div class="footer">
            <div class="button" @click="share()">分享给好友</div>
        </div>
    </div>
</template>

<script>
    import '../style/style.less'
    export default {
        name: "popup",
        props: {},
        methods:{
            share(){
                alert("share");
                this.$emit('onShared');
            }
        }
    }
</script>

<style lang="less" scoped>
    .popup-container {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 750px;
        height: 845px;
        transform: translate(-50%, -50%);
        background-image: url("../img/popup_bg.png");
        background-position: center;
        background-size: contain;
        main{
            position: absolute;
            top: 200px;
        }
        .tip{
            text-align: center;
            font-size: 40px;
            color: white;
            margin-bottom: 55px;
        }
        .money{
            text-align: center;
            font-size: 80px;
            color: #fff06d;
            margin-bottom: 100px;
        }
        .tip2{
            font-size: 28px;
            line-height: 40px;
            color: white;
            margin:0 120px;
            padding: 10px 30px;
            background-color: #c92620;
            border-radius: 8px;
        }
        .footer{
            width: 750px;
            position: absolute;
            bottom: 100px;
            .button{
                margin: 0 75px;
                /*height: 110px;*/
                /*text-align: center;*/
                /*line-height: 110px;*/
                /*font-size: 40px;*/
                /*color: #753117;*/
                /*font-weight: bold;*/
                /*z-index: 11;*/
                /*background-image: url("../img/button_bg.png");*/
                /*background-position: center;*/
                /*background-size: contain;*/
            }
        }

    }
</style>