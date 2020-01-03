<template>
    <div class="share-page">
        <div class="main">
            <div class="avatar">
                <img src="../../img/avatar.png"/>
            </div>
            <div class="bubble">
                <ques-ans v-if="showQues">
                </ques-ans>
                <div class="box-length" v-else>
                    <div>
                        还剩<span class="squre color-yellow left">0</span><span class="squre color-yellow right">3</span>个红包未被领取，速速邀请好友答题!
                    </div>
                </div>
            </div>
            <div class="footer">
                <div v-if="!showQues" class="a color-yellow" @click="showQuestion()">查看我的题目</div>
                <div class="button" @click="share()">邀请好友答题</div>
            </div>
        </div>
    </div>
</template>
<script>
    import '../../style/style.less'
    import QuesAns from '../../components/QuesAns'
    export default {
        name: 'share',
        components: {QuesAns},
        comments:{QuesAns},
        data(){
            return{
                showQues:false
            }
        },
        methods:{
            showQuestion(){
                this.showQues=true
            },
            share(){
                alert("share")
            }
        }
    }
</script>
<style lang="less" scoped>
    .share-page{
        background-image: url("../../img/share_page_bg.png");
        background-size: contain;
        background-repeat: no-repeat;
        .main{
            .avatar{
                margin-top: 126px;
                text-align: center;
                img{
                    position: relative;
                    left: -3px;
                    width: 136px;
                }
            }
            .bubble{
                position: relative;
                .box-length{
                    margin: 60px 30px;
                    padding:0 40px;
                    height: 100px;
                    background-color:rgb(201,38,32);
                    border-radius: 16px;
                    font-size: 26px;
                    line-height: 100px;
                    color: white;
                    text-align: center;
                    .squre{
                        display: inline-block;
                        line-height: 40px;
                        text-align: center;
                        width: 30px;
                        height: 44px;
                        background-image: url("../../img/squre_bg.png");
                        background-size: contain;
                        font-size: 30px;
                    }
                    .squre.left{
                        margin-left: 6px;
                        margin-right: 4px;
                    }
                    .squre.right{
                        margin-left: 4px;
                        margin-right: 6px;
                    }
                }
               top:25px
            }
            .bubble::before {
                content: url("../../img/tra.png");
                height: 15px;
                position: absolute;
                top: -25px;
                left: 315px;
            }
        }
    }
    .squre{
        display: inline-block;
        /*vertical-align: center;*/
        text-align: center;
        width: 30px;
        height: 44px;
        background-image: url("../../img/squre_bg.png");
        background-size: contain;
        font-size: 30px;
    }

</style>