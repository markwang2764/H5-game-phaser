<template>
    <div class="earn-page">
        <main class="main">
            <div class="money">
                <span class="color-white font-smaller">你有</span>
                6.09
                <span class="font-smaller">元</span>
                <span class="color-white font-smaller">待提现</span>
            </div>
            <div class="bubble">
                <ques-ans v-if="showQues">
                </ques-ans>
                <div class="box-length" v-else>
                    <div>
                        我们果然是真朋友，快去领红包吧
                    </div>
                </div>
            </div>
            <div class="footer">
                <div v-if="!showQues" class="a color-yellow" @click="showQuestion()">查看题目</div>
                <div class="button" @click="showLanding()">立即领取</div>
            </div>
        </main>
    </div>
</template>
<script>
    import '../../style/style.less'
    import QuesAns from '../../components/QuesAns'

    export default {
        name: 'earn',
        components: {QuesAns},
        data() {
            return {
                showQues: false,
                showLan: false
            }
        },
        methods: {
            showQuestion() {
                this.showQues = true
            },
            showLanding() {
                this.showLan = true
            }
        }
    }
</script>
<style lang="less" scoped>
    .earn-page {
        width: 750px;
        height: 1206px;
        background-image: url("../../img/earn_page_bg.png");
        background-size: contain;
        background-repeat: no-repeat;
        .main {
            .money {
                margin-bottom: 41px;
                margin-top: 300px;
                font-weight: 500;
                font-size: 84px;
                .font-smaller {
                    font-size: 42px;
                    font-weight: 500;
                    margin: 0 -12px;
                }
            }
            .bubble {
                position: relative;
                .box-length {
                    text-align: center;
                    margin: 60px 70px;
                    padding: 0 40px;
                    height: 100px;
                    background-color:rgb(201,38,32);
                    border-radius: 16px;
                    font-size: 26px;
                    line-height: 100px;
                    color: white;
                }
            }
            .bubble::before {
                content: url("../../img/tra.png");
                height: 15px;
                position: absolute;
                top: -25px;
                left: 308px;
            }
        }
    }

</style>