<template>
    <div class="toshare-page">
        <div id="mask" class="mask" @click="closeShareTip()">
            <main class="main">
                <div class="close" @click="closeMask()">
                    <img src="../../img/icon_close.png"/>
                </div>
                <section class="before">
                    <div class="coin">
                        <img src="../../img/button_open.png"/>
                    </div>
                </section>
                <section class="after">
                    <div class="card">
                        <div class="content">
                            <span>6.09</span><span class="smaller">元</span>
                        </div>
                    </div>
                    <div class="front">
                        <div class="content">
                            恭喜您获得一个现金红包
                        </div>
                        <div class="content large">
                            分享给好友即可提现
                        </div>
                    </div>
                    <div class="button" @click.stop="showShareTip()">
                        分享提现
                    </div>
                </section>
            </main>
        </div>
        <big-bag v-if="isBig" @onCloseClick="closeBag()" @onShareClick="showShareTip()"
                 @onMaskClick="closeShareTip()"></big-bag>
        <small-bag v-if="isSmall" @onSmallBagClick="showBag()"></small-bag>
        <share-tip v-if="isShareTip"></share-tip>
    </div>
</template>
<script>

    import '../../style/style.less'
    import BigBag from '../../components/BigBag'
    import SmallBag from '../../components/SmallBag'
    import ShareTip from '../../components/ShareTip'

    export default {
        name: 'toshare',
        components: {SmallBag, BigBag, ShareTip},
        data() {
            return {
                isShareTip: false,
                isBig: false,
                isSmall: false
            }
        },
        methods: {
            closeMask() {
                document.getElementById('mask').style.display = 'none';
                this.closeBag()
            },
            closeBag() {
                this.isBig = false;
                this.isSmall = true;
            },
            showBag() {
                this.isBig = true;
                this.isSmall = false;
            },
            showShareTip() {
                this.isShareTip = true;
            },
            closeShareTip() {
                this.isShareTip = false;
            }
        }
    }
</script>
<style lang="less" scoped>
    .toshare-page {
        .mask {
            .main {
                * {
                    animation-timing-function: linear;
                    animation: ani1 1s, ani2 1s 1s;
                }
                position: relative;
                .before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 583px;
                    height: 733px;
                    background-image: url("../../img/redbag_start.png");
                    animation-delay: 60*@item_frame;
                    animation-name: before-animate;
                    animation-duration: 7*@item_frame;
                    animation-fill-mode: both;
                    .coin {
                        position: absolute;
                        top: 416px;
                        left: 182px;
                        width: 206px;
                        height: 206px;
                        animation: coin-animate1 40*@item_frame linear, coin-animate2 20*@item_frame linear 40*@item_frame;
                    }
                }
                .after {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 583px;
                    height: 733px;
                    animation-delay: 60*@item_frame;
                    animation-name: after-animate;
                    animation-duration: 7*@item_frame;
                    animation-fill-mode: both;
                    background-image: url("../../img/redbag_bg.png");
                    transform: scale(0.9);
                    opacity: 0;
                    .card {
                        width: 501px;
                        height: 322px;
                        background-image: url("../../img/card_white.png");
                        position: absolute;
                        top: -32px;
                        left: 39px;
                        animation-delay: 60*@item_frame;
                        animation-name: card-animate;
                        animation-duration: 10*@item_frame;
                        animation-fill-mode: both;
                        padding-top: 150px;
                        text-align: center;
                        font-size: 72px;
                        color: #F64739;
                        font-weight: bold;
                        transform: translateY(260px);
                        .content {
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
                        background-image: url("../../img/redbag_front.png");
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
                    }
                    .button {
                        position: absolute;
                        top: 500px;
                        left: 60px;
                        width: 464px;
                        height: 129px;
                        background-image: url("../../img/button_yellow.png");
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

    @keyframes coin-animate1 {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(1.2);
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes coin-animate2 {
        0% {
            transform: rotateY(0);
        }

        100% {
            transform: rotateY(360deg);
        }
    }

    @keyframes before-animate {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        1% {
            transform: scale(1);
            opacity: 0.5;
        }
        100% {
            transform: scale(0.9);
            opacity: 0;
        }
    }

    @keyframes after-animate {
        0% {
            transform: scale(0.9);
            opacity: 0;
        }
        1% {
            transform: scale(0.9);
            opacity: 0.5;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes card-animate {
        0% {
            transform: translateY(400px);
        }
        100% {
            transform: translateY(0);
        }
    }

    @item_frame: 33ms;


</style>