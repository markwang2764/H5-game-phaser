<template>
    <div class="big-bag">
        <div class="mask" @click="onMaskClick()">
            <div class="main">
                <div class="close" @click="onCloseClick()">
                    <img src="../img/icon_close.png"/>
                </div>
                <section class="after">
                    <div class="card">
                        <div class="content">
                            <span>6.09</span><span class="smaller">元</span>
                        </div>
                    </div>
                    <div class="front">
                        <div v-if="isAfter">
                            <div class="content largest">
                                分享成功
                            </div>
                        </div>
                        <div v-else>
                            <div class="content">
                                恭喜您获得一个现金红包
                            </div>
                            <div class="content large">
                                分享给好友即可提现
                            </div>
                        </div>
                    </div>
                    <div class="button" @click.stop="onShareClick()">
                        <span v-if="isAfter">立即提现</span>
                        <span v-else>分享提现</span>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "bigBag",
        props: {
            isAfter: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onCloseClick() {
                this.$emit('onCloseClick')
            },
            onShareClick() {
                this.$emit('onShareClick')
            },
            onMaskClick() {
                this.$emit('onMaskClick')
            }
        }
    }
</script>

<style lang="less" scoped>
    .big-bag {
        .mask {
            .main {
                position: relative;
                .after {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 583px;
                    height: 733px;
                    background-image: url("../img/redbag_bg.png");
                    .card {
                        width: 501px;
                        height: 322px;
                        background-image: url("../img/card_white.png");
                        position: absolute;
                        top: -32px;
                        left: 39px;
                        padding-top: 150px;
                        text-align: center;
                        .content{
                            position: relative;
                            left: 10px;
                            font-size: 90px;
                            color: #F64739;
                            font-weight: bold;
                            .smaller {
                                font-weight: bold;
                                font-size: 36px;
                            }
                        }
                    }
                    .front {
                        position: absolute;
                        top: 58px;
                        left: 0;
                        width: 577px;
                        height: 548px;
                        background-image: url("../img/redbag_front.png");
                        padding-top: 291px;
                        .content {
                            text-align: center;
                            color: white;
                            font-size: 30px;
                            line-height: 57px;
                        }
                        .content.large {
                            font-size: 45px;
                        }
                        .content.largest{
                            font-size: 72px;
                        }
                    }
                    .button {
                        position: absolute;
                        top: 500px;
                        left: 60px;
                        width: 464px;
                        height: 129px;
                        background-image: url("../img/button_yellow.png");
                        text-align: center;
                        font-size: 36px;
                        color: #823C32;
                        line-height: 104px;
                        font-weight: bold;
                    }
                }
                .close {
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    width: 40px;
                    height: 40px;
                }
            }

        }
    }

    @item_frame: 33ms;

</style>