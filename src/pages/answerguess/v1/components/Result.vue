<template>
    <div class="result-container">
        <div class="case1" v-if="poptype===1">
            <div class="face">
                <img src="../img/right_face.png"/>
            </div>
            <div class="main">
                <div class="type">答对了 ！</div>
                <div class="tip">已成功领取</div>
                <div class="money">6.09<span class="font-smaller">元</span></div>
            </div>
            <div class="footer">
                <div class="button" @click="forward()">立即提现</div>
                <div class="tip2">下载<span class="color-yellow">趣晒app</span> ，就能免费发起价值<span class="color-yellow">100</span>的题目， 分享好友可以瓜分哦~</div>
            </div>
        </div>
        <div class="case2" v-if="poptype===2">
            <div class="face">
                <img src="../img/right_face2.png"/>
            </div>
            <div class="main">
                <div class="type">答对了 ！</div>
                <div class="tip">手慢了一点哦，10个红包被瓜分完了</div>
                <div class="tip3">送你一份好友鼓励金：</div>
                <div class="money">1.09<span class="font-smaller">元</span></div>
            </div>
            <div class="footer">
            <div class="button" @click="forward()">立即提现</div>
            </div>
        </div>
        <div class="case3" v-if="poptype===3">
            <div class="face">
                <img src="../img/wrong_face.png"/>
            </div>
            <div class="main">
                <div class="type">答错了 ！</div>
                <div class="tip"><span class="color-light">此题正确答案是：</span>低糖/无糖</div>
                <div class="tip3">送你一份好友鼓励金：</div>
                <div class="money">1.09<span class="font-smaller">元</span></div>
            </div>
            <div class="footer">
            <div class="button" @click="forward()">立即提现</div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../style/style.less'
    export default {
        name: "result",
        props: {
            //type 1 2 3 = 配置金额 答对了瓜分金 答对了奖励金 答错了
            poptype: {
                type: Number,
                default: 1
            },
        },
        methods:{
            forward(){
                alert("ti xian")
            }
        }
    }
</script>

<style lang="less" scoped>

    .result-container {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 750px;
        height: 915px;
        transform: translate(-50%, -50%);
        background-image: url("../img/result_bg.png");
        background-size: contain;
        .face {
            position: absolute;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                height: 200px;
            }
        }
        .case1 .face{
            top: 15px;
        }
        .case2 .face{
            top: -16px;
            left: 30px;
        }
        .case3 .face{
            top: -31px;
            left: 6px;
        }
        .main{
            .type {
                padding: 20px;
                text-align: center;
                font-size: 60px;
                color: #ffd339;
                transform: translateX(36px);
            }
            .tip {
                padding: 20px;
                text-align: center;
                font-size: 30px;
                color: white;
            }
            .tip3{
                padding: 20px;
                text-align: center;
                font-size: 40px;
                color: #ffd339;
            }
            .money {
                padding: 20px;
            }
        }
        .case1 .main{
            padding-top: 215px;
        }
        .case2 .main{
            padding-top: 197px;
        }
        .case3 .main{
            padding-top: 184px;
        }
        .footer{
            width: 680px;
            margin:0 35px;
            position: absolute;
            bottom: 75px;
            .tip2{
                font-size: 28px;
                line-height: 40px;
                color: #9c2722;
                margin:0 50px;
            }
            .button {
                margin: 30px 40px;
                /*height: 106px;*/
                /*text-align: center;*/
                /*line-height: 100px;*/
                /*font-size: 50px;*/
                /*color: #753117;*/
                /*z-index: 11;*/
                /*background-image: url("../img/button_bg.png");*/
                /*background-position: center;*/
                /*background-size: contain;*/
            }
        }

    }
</style>