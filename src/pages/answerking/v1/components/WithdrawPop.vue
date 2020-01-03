<template>
  <div class="withdraw-pop" >
    <div class="pop-main">
        <div class="pop-box">
            <div class="title">确认提现吗？</div>
            <div class="bonus-now">当前答题奖金<span class="amount">{{bonus}}</span><span class="unit">元</span></div>
            <div class="bonus-total">再回答一题就可领取<span class="amount">{{totalBonus}}</span><span class="unit">元</span></div>

            <div class="footer">
                <div class="btn-1" @click="onCancel">继续答题</div>
                <div class="btn-2" @click="onConfirm">确认提现</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'withdraw-pop',
    props: ['onCancel', 'onConfirm', 'bonus', 'totalBonus'],
    mounted(){
        this.$embed.singleClk(this.$embed.TYPE_6);
    }
  }
</script>

<style lang="less">
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("../img/@{url}");
  }
  .withdraw-pop{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0, 0.6);
    z-index: 998;

    @base-color: rgb(53,28,125);
    .pop-main{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      border-radius: 14px;
      width: 650px;
    //   height: 353px;
    }
    .pop-box{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: @base-color;
        padding: 50px 40px;
        border-radius: 14px;
        font-weight: 600;
        .title{
            font-size: 46px;
            margin-bottom: 60px;
            margin-left: 20px;
        }
        .bonus-now{
            font-size: 26px;
            margin-bottom: 44px;
            color: rgb(133,116,183);
            .amount{
                color: rgb(255,112,99);
            }
            .unit{
                color: rgb(255,112,99);
            }
        }
        .bonus-total{
            font-size: 40px;
            margin-bottom: 60px;
            color: @base-color;
            .amount{
                color: rgb(255,112,99);
                            font-size: 46px;

            }
            .unit{
                color: rgb(255,112,99);
            }
        }
        .footer{
            font-size: 0;
            width: 100%;
           
            .btn-1{
                display: inline-block;
                width: 48%;
                height: 96px;
                line-height: 96px;
                border: solid 1px #ffd427; /* no */
                border-radius: 14px;
                background-color: #ffd427;
                font-size: 40px;
                text-align: center;
                color: rgb(22,21,27);
                    margin-right: 4%;

            }
            .btn-2{
                display: inline-block;
                width: 48%;
                height: 96px;
                line-height: 96px;
                border: solid 1px @base-color; /* no */
                color: @base-color;
                border-radius: 14px;
                font-size: 40px;
                text-align: center;
                
            }
        }
    }

  }
</style> 