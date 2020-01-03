<template>
    <div class="m-barrage" :style="{width: width / 200 + 'rem', height: height / 200 + 'rem'}">
        <div class="barrage" :style="{transform: `translateX(${item.x/200}rem)`, top: item.y}" v-if="item.show" :ref="'barrage_'+index"  v-for="(item, index) in  list" :key=index>
            <div class="notify-box">
                <div class="notify"></div>
            </div>
            <div class="barrage-text" v-html="item.text"></div>
        </div>  
    </div>
</template>

<script>
import {requestAnimFrame} from '@js/utils'
import { setTimeout } from 'timers';

const endX = -1500;
const speed = 5;
const pathCount = 3; // 弹幕拆成三个子区域，尽量避免重叠
export default {
     name: 'barrage',
     props: {
         // 弹幕列表
         barrages: {
             type: Array,
             default: ()=>[]
         },
         width: {
             type: Number,
             default: 200
         },
         height: {
             type: Number,
             default: 200
         }

     },
     data(){
         let initX = this.width;
         return {
             list: [],
             xArr: [],
             initTime: 0,
             pathNumber: 0
        }
     },
     methods:{
        transformText(text) {
            return text.replace(/提现/g, ($1)=>{
                return `<span style="color:#0087F3;">提现</span>`;
            })
        },
        getRandomY() {
            let availMaxHeight = (this.pathNumber + 1) / pathCount * (this.height - 62);
            let availMinHeight = this.pathNumber  / pathCount * (this.height - 62);
            let y = Math.floor(Math.random() * (availMaxHeight - availMinHeight)) + availMinHeight;
            this.pathNumber ++; 
            if (this.pathNumber >= pathCount) {
                this.pathNumber = 0;
            }
            console.log('barrage.y= ' + y)
            return y / 200 + 'rem';
        },

        move() {
            let finish = true;
            for (let i = 0 ; i < this.list.length; i ++ ) {
                let x = this.list[i].x;
                let show = true;
               
                if (+new Date() - this.initTime > this.list[i].delay) {
                     x -= speed;
                }
                if (x > this.list[i].endX) {
                    finish = false;
                } else {
                    show = false;
                }

                let newValue = Object.assign({}, this.list[i], {x: x, show: show});
                this.$set(this.list, i, newValue)
            }
            if (!finish){
                requestAnimFrame(this.move.bind(this));

            }
        },
        initList() {
            console.log(this.barrages)
            for (let i = 0 ; i < this.barrages.length; i ++ ) {
                this.list[i] =  {
                    text: this.transformText(this.barrages[i]),
                    endX: endX,
                    startX: this.width,
                    x: this.width,
                    show: false,
                    y: this.getRandomY(),
                    delay: Math.floor(Math.random() * 1000),
                    duration: Math.floor(Math.random() * 101) + 2900
                };
            }

            console.log(this.list);
        }
     
    },

     mounted(){
         this.initList();
         this.initTime = +new Date();
        requestAnimFrame(this.move.bind(this));
        
     }
     
}
</script>
<style lang="less" scoped>
 .bg(@url) {
        background-repeat: no-repeat;
        background-size: cover;
        background-image: url("../img/@{url}");
    }
    .m-barrage{
        width: 100%;
        height:100%;
        position: relative;
        @barrage-color: #22212a;
        @barrage-height: 44px;
        .barrage{
            max-width: 750px;
            display: inline-block;
            height: @barrage-height;
            line-height: @barrage-height;
            position: absolute;
            left: 0; 
            top: 0;
            background-color: @barrage-color;
            border-radius: 25px;
            padding: 0 40px 0 64px;

            .notify-box{
                position: absolute;
                left: 0;
                top: -11px;
                width: 62px;
                height: 62px;
                border-radius: 31px;
                background-color: @barrage-color;
            }
            .notify{
                display: inline-block;
                width: 36px;
                height: 34px;
                margin-top: (62-36)/2px;
                margin-left: (62-34)/2px;
                .bg('ic_notify.png');
            }
            .barrage-text{
                color: #F66900;
                font-size: 32px;
                span {
                    color: #0087F3;
                }
            }
        }

    }
</style>

