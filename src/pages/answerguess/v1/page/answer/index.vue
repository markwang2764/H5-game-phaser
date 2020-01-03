<template>
    <div class="answer-page">
        <header>
            <img src="../../img/toutu.jpg">
            <div class="bubble">
                <span class="color-red">前10位</span>答对者可免费瓜分趣晒提供的<span class="color-red">100元</span>答题红包哦！
            </div>
        </header>
        <main>
            <div class="avatar">
                <img src="../../img/avatar.png"/>
            </div>
            <div class="question">
                <span>[单选]</span>哪些饮料标签能吸引到你？
            </div>
            <option-list @onSelectOne="selectOne()"></option-list>
        </main>
        <div class="footer">
            <button class="submit" @click="finishSubmit">提交答案</button>
        </div>
        <div class="popup-wrapper" v-if="showPopup">
            <result @onForward="finishForward"></result>
        </div>
    </div>
</template>
<script>
    import OptionList from '../../components/OptionList.vue';
    import Result from '../../components/Result.vue';
    import '../../style/style.less'
    export default {
        name: 'answer',
        components: {OptionList,Result},

        data() {
            return {
                showPopup: false
            }
        },
        methods: {
            finishSubmit() {
                this.showPopup = true
            },
            finishForward() {
                this.showPopup = false
            },
            selectOne(){
                alert("selected one")
            }
        },
    }
</script>
<style lang="less" scoped>
    .answer-page header {
        height: 200px;
        background: orange;
        img {
            width: 100%;
        }
        .bubble{
            position: absolute;
            left: 96px;
            top: 22px;
            padding-left: 30px;
            padding-right: 30px;
            padding-top: 20px;
            /*padding: 14px 30px 52px 30px;*/
            padding-bottom: 46px;
            width: 606px;
            height: 146px;
            /*box-shadow: 0 3px 7px 0 rgba(76, 24, 12, 0.47);*/
            /*background-color: white;*/
            background-image: url("../../img/white_bub_bg.png");
            background-size: contain;
            font-size: 28px;
            line-height: 40px;
            border-radius: 8px;
        }
    }

    .answer-page main {
        position: relative;
        background: white;
        top: -20px;
        padding: 0 24px;
        border-radius: 16px;
        .avatar{
            width: 100px;
            position: absolute;
            top: -50px;
        }
        .question {
            padding:110px 0 60px 0;
            font-size: 40px;
            font-weight: bold;
            color: #333;
            line-height: 56px;
            span {
                color: #FE8C00;
            }
        }
        /*.option-list {*/
            /*padding-bottom: 76px;*/
            /*.option {*/
                /*display: block;*/
                /*padding-left: 5%;*/
                /*height: 112px;*/
                /*line-height: 112px;*/
                /*margin-bottom: 36px;*/
                /*text-align: left;*/
                /*box-shadow: 0 4px 40px 0 rgba(225, 228, 243, 0.8);*/
                /*border-radius: 16px;*/
                /*font-size: 30px;*/
                /*span img{*/
                    /*width: 40px;*/
                    /*margin-right: 24px;*/
                /*}*/
            /*}*/
        /*}*/


    }

</style>