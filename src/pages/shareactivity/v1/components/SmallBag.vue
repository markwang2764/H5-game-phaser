<template>
    <div class="small-bag">
        <div class="main" @click="onSmallBagClick()">
        </div>
    </div>
</template>

<script>
    export default {
        name: "SmallBag",
        methods: {
            onSmallBagClick() {
                this.$emit('onSmallBagClick')
            }
        }
    }
</script>

<style lang="less" scoped>
    .small-bag {
        .main {
            position: fixed;
            bottom: 50px;
            right: 10px;
            width: 176px;
            height: 187px;
            background-image: url("../img/shake.gif");
            background-size: contain;
        }
    }
</style>