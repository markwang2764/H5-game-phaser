<template>
    <div class="ask-page">
        <header>
            <img src="../../img/toutu.jpg">
        </header>
        <main>
            <div class="question">
                哪些饮料标签能吸引到你？<span @click="changeQue()">换一题</span>
            </div>
            <div class="tip">[我的答案]</div>
            <option-list @onSelectOne="selectOne()"></option-list>
        </main>
        <div class="footer">
            <div class="tip2">选择你的答案，分享给好友来测试~</div>
            <button class="submit" @click="finishSet">设置完成</button>
        </div>
        <div class="popup-wrapper" v-if="showPopup">
            <popup @onShared="finishShare"></popup>
        </div>
    </div>
</template>
<script>
    import OptionList from '../../components/OptionList.vue';
    import Popup from '../../components/Popup.vue';
    import '../../style/style.less'
    export default {
        name: 'ask',
        components: {Popup,OptionList},

        data() {
            return {
                showPopup: false
            }
        },
        methods: {
            finishSet() {
                this.showPopup = true
            },
            finishShare() {
                this.showPopup = false
            },
            changeQue() {
                alert("change question")
            },
            selectOne(){
                alert("selected one")
            }
        },
    }
</script>
<style lang="less" scoped>
    .ask-page{
        /*padding-bottom: 200px;*/
    }
    .ask-page header {
        height: 200px;
        img {
            width: 100%;
        }
    }

    .ask-page main {
        position: relative;
        background: white;
        top: -20px;
        padding: 0 24px;
        border-radius: 16px;
        .question {
            padding: 40px 0;
            font-size: 40px;
            font-weight: bold;
            color: #333;
            line-height: 56px;
            span {
                color: #3F86FF;
                font-size: 24px;
                text-decoration: underline;
            }
        }
        .tip {
            padding: 24px 0;
            font-size: 40px;
            line-height: 56px;
            color: #FE8C00;
            font-weight: bold;
        }
    }

</style>