<template>
    <div class="download-guide">
        <div class="mask" @click="onMaskClick()">
            <main class="main"></main>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DownloadGuide",
        methods:{
            onMaskClick(){
                this.$emit('onMaskClick')
            }
        }
    }
</script>

<style lang="less" scoped>
    .download-guide .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        .main {
            width: 534px;
            height: 240px;
            position: fixed;
            top: 13px;
            right: 16px;
            background-image: url("../img/wechat_guide.png");
            background-size: contain;
        }

    }
</style>