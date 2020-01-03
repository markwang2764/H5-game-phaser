<template>
    <div class="box-height">
        <div>
            那些饮料标签能吸引到你？
        </div>
        <ul>
            <li>含膳食纤维</li>
            <li>低糖/无糖</li>
            <li class="color-yellow">不含咖啡因[答案]</li>
        </ul>
    </div>
</template>

<script>
    import '../style/style.less'
    export default {
        name: "QuesAns"
    }
</script>

<style lang="less" scoped>
    .box-height {
        margin: 30px 100px;
        padding: 10px 30px;
        background-color:rgb(201,38,32);
        border-radius: 16px;
        div {
            font-size: 26px;
            line-height: 40px;
            color: white;
        }
        ul {
            li {
                font-size: 24px;
                line-height: 60px;
                color: rgb(123,5,1);
            }
        }
    }
</style>