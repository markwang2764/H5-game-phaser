<template>
    <div class="share-tip">
        <div class="mask" @click="onMaskClick()">
            <main class="main"></main>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DownloadTip",
        methods:{
            onMaskClick(){
                this.$emit('onMaskClick')
            }
        }
    }
</script>

<style lang="less" scoped>
    .share-tip .mask{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.51);
        .main{
            width:524px;
            height: 373px;
            position: fixed;
            top: 19px;
            right: 13px;
            background-image: url("../img/down_guide.png");
            background-size: contain;
        }

    }
</style>