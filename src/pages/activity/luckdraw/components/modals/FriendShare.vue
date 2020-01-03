<template>
  <modal :show.sync="_show" :close="'.close'">
    <div class="friend-content">
      <div class="close" @click='handleClickClose'></div>
      <div class="home-time">
        <span class="time-word">还剩</span>
        <span class="time-num">{{ time.day[0] }}</span>
        <span class="time-num">{{ time.day[1] }}</span>
        <span class="time-word">天</span>
        <span class="time-num">{{ time.hours[0] }}</span>
        <span class="time-num">{{ time.hours[1] }}</span>
        <span class="time-word">小时</span>
        <span class="time-num">{{ time.minutes[0] }}</span>
        <span class="time-num">{{ time.minutes[1] }}</span>
        <span class="time-word">分钟</span>
        <span class="time-num">{{ time.seconds[0] }}</span>
        <span class="time-num">{{ time.seconds[1] }}</span>
        <span class="time-word">秒就要开奖啦</span>
      </div>
      <div class="discribe">本期的幸运儿是你吗？</div>
      <div class="btn" @click='handleClick'>
        下载app中奖概率翻倍
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from "@components/pop/Modal";
import axios from 'axios';
import {getUrlParameter} from '@pages/activity/share_packet/components/utils';
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      isEnd: false,
      time: {
        day: '00',
        hours: '00',
        seconds: '00',
        minutes: '00'
      }
    };
  },
  components: {
    Modal
  },
  methods: {
    handleClick() {
      this.$embed.singleClk(this.$embed.TYPE_9, {page_source: 1})
      this._show = false;
      this.$bus.$emit('showModal', {
        modalId: 'userShare',
        data: {
          page_source: 1,
          cdk: this.data.cdk
        }    
      });
    },
    handleClickClose() {
      this.$embed.singleClk(this.$embed.TYPE_301)
    },
    getTime(time) {
      let splitTime = time - new Date().getTime();
      if(splitTime > 0) {
        let day = Math.floor(splitTime/86400000);
        let hours = Math.floor(splitTime/3600000 - day*24);
        let minutes = Math.floor(splitTime/60000 - day*24*60 - hours*60);
        let seconds = Math.floor(splitTime/1000 - minutes*60 - day*24*60*60 - hours*60*60);
        return {
          day: this.getString(day),
          hours: this.getString(hours),
          minutes: this.getString(minutes),
          seconds: this.getString(seconds),
        }
      } else {
         return false;
      }
    },

    //将数字变成字符串
    getString(num) {
      if(num < 10) {
        return "0" + num;
      } else {
        return '' + num;
      }
    },

    countTimer(flag) {
      if(flag){
        var fun = setTimeout(()=>{
            if(this.getTime(this.data.endTime)) {   
              this.time = this.getTime(this.data.endTime);
              this.countTimer(true)
            } else {
              this.time = {
                day: "00",
                hours: "00",
                minutes: "00",
                seconds: "00"
              }
              this.countTimer(false)
            }
          },1000);
      }else{
          clearTimeout(fun);
          this.isEnd = true;
      }
    }




  },
  created() {
    this.countTimer(true);
  },
  computed: {
    _show: {
      get: function() {
        return this.show;
      },
      set: function(val) {
        this.$emit("update:show", val);
      }
    }
  },

  mounted() {
  }
};
</script>

<style lang="less" scoped>
  .bg(@url) {
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("~@pages/activity/luckdraw/img/@{url}");
  }
  .friend-content {
    height: 728px;
    width: 676px;
    padding-top: 436px;
    position: relative;
    .bg("model.png");
    .close {
      position: absolute;
      width: 76px;
      height: 76px;
      bottom: -100px;
      left: 306px;
      .bg("close.png");
    }
    .btn {
      width: 496px;
      height: 90px;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url("~@pages/activity/luckdraw/img/btn.png");
      font-size:32px;
      color:rgba(221,63,54,1);
      line-height: 86px;
      text-align: center;
      margin-left: 90px;
      font-weight: bold;
    }
    .discribe {
      font-size:32px;
      color:rgba(255,255,255,1);
      line-height:29px;
      margin: 24px 0 30px 0;
    }
    .home-time {
      font-size:27px;
      color:rgba(255,255,255,1);
      line-height:32px;
      .time-num {
        display: inline-block;
        width:23px;
        height:46px;
        background:rgba(84,63,63,1);
        border-radius:4px;
        color: #fff;
        line-height: 46px;
        font-weight: bold;
        margin-right: -6px;
        text-align: center;
      }
    }
  }

  @keyframes mymove {
    0 {transform: rotateY(0deg);}
    20% {transform: rotateY(90deg);}
    40% {transform: rotateY(0deg);}
    60% {transform: rotateY(90deg);}
    80% {transform: rotateY(0deg);}
    100% {transform: rotateY(90deg);}
  }
  
</style>
