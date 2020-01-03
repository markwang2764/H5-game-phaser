<template>
    <div class="shared-page">
        <big-bag v-if="!isSmall" :is-after="true" @onCloseClick="closeBag()" @onShareClick="showDownloadTip()" ></big-bag>
        <small-bag v-if="isSmall"  @onSmallBagClick="showBag()"></small-bag>
        <download-tip v-if="isDownload" @onMaskClick="closeDownloadTip()"></download-tip>
    </div>
</template>
<script>

    import '../../style/style.less'
    import BigBag from '../../components/BigBag'
    import SmallBag from '../../components/SmallBag'
    import DownloadTip from '../../components/DownloadTip'
    export default {
        name: 'aftershare',
        components: { SmallBag, BigBag,DownloadTip},
        data(){
            return{
                isSmall:false,
                isDownload:false
            }
        },
        methods:{
            closeBag() {
                this.isSmall=true;
            },
            showBag() {
                this.isSmall=false;
            },
            showDownloadTip(){
                this.isDownload=true;
            },
            closeDownloadTip(){
                this.isDownload=false
            }
        }
    }
</script>
<style lang="less" scoped>


</style>