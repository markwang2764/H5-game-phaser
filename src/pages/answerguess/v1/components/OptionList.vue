<template>
        <ul class="option-list">
            <li class="option" @click="selectItem()">
                    <span>
                        <img src="../img/radio.png"/>
                    </span>
                膳食纤维
            </li>
            <li class="option">
                    <span>
                        <img src="../img/selected.png"/>
                    </span>
                低糖/无糖
            </li>
            <li class="option">
                    <span>
                        <img src="../img/radio.png"/>
                    </span>
                不含咖啡因
            </li>
        </ul>
</template>

<script>
    export default {
        name: "answerList",
        methods:{
            selectItem(){
                this.$emit("onSelectOne")
            }
        }
    }
</script>

<style lang="less" scoped>
    .option-list {
        padding-bottom: 76px;
        .option {
            display: block;
            padding-left: 5%;
            height: 112px;
            line-height: 112px;
            margin-bottom: 36px;
            text-align: left;
            box-shadow: 0 4px 40px 0 rgba(225, 228, 243, 0.8);
            border-radius: 16px;
            font-size: 30px;
            span img {
                width: 40px;
                margin-right: 24px;
            }
        }
    }

</style>