<template>
    <div class="todownload-page">
        <div class="wrapper" @click="closeDownloadGuide()">
            <main class="main">
                <div class="content one">
                </div>
                <div class="button" @click.stop="showDownloadGuide()"></div>
                <div class="code">
                    QSK584624
                </div>
            </main>
        </div>
        <download-guide v-if="isDownloadGuide" @onMaskClick="closeDownloadGuide"></download-guide>
    </div>
</template>
<script>
    import DownloadGuide from '../../components/DownloadGuide'
    export default {
        name: 'todownload',
        components:{DownloadGuide},
        data(){
            return{
                isDownloadGuide:false  
            }
            
        },
        methods:{
            closeDownloadGuide(){
                this.isDownloadGuide=false
            },
            showDownloadGuide(){
                this.isDownloadGuide=true
            },
        }
    }
</script>
<style lang="less" scoped>
    .todownload-page {
        .wrapper {
            position: fixed;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, #ffc935, #fe941a);
            overflow: scroll;
            .main {
                position: relative;
                width: 750px;
                height: 1206px;
                background-image: url("../../img/landpage_bg.jpg");
                background-size: contain;
                .content {
                    position: absolute;
                    top: 434px;
                    left: 264px;
                    width: 242px;
                    height: 102px;
                    background-size: contain;
                }
                .one {
                    background-image: url("../../img/388.png");
                }
                .two {
                    background-image: url("../../img/588.png");
                }
                .three {
                    background-image: url("../../img/888.png");
                }
                .code {
                    position: absolute;
                    bottom: 84px;
                    right: 158px;
                    height: 39px;
                    font-size: 30px;
                    line-height: 39px;
                    color: #D80000;
                }
                .button {
                    position: absolute;
                    bottom: 224px;
                    left: 185px;
                    width: 382px;
                    height: 87px;
                }
            }
        }

    }

</style>