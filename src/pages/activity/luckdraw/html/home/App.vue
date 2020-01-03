<template>
    <div class="home-page" ref="home">
    <div class="home-title">参与抽奖领取丰厚奖品，分享好友中奖率翻倍哦～</div>
    <div class="home-img">
      <img src="../../img/card3.png" alt="" class="home-card">
      <img class="home-small" src="../../img/small.png"></img>
    </div>
    <div class="card-title">
      <span>200元支付宝红包</span>
    </div>
    <div class="home-time">
      <span class="time-word">距离结束还有</span>
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
      <span class="time-word">秒</span>
    </div>
    <!-- h5头像 -->
    <div class="share-people" v-if="!isInApp">
      <div class="share-img">
        <img :src="participantHeadUrl" alt="">
      </div>
      <div class="share-name">{{ participantName }}</div>
    </div>
    <!-- 是否已经结束 -->
    <div class="home-people" v-if="!isEnd">
      <span class="icon"></span>
      <span class="people-num">已有{{ participantNum }}人参与，快来参加~</span>
    </div>
    <div class="home-people" v-else>
      <span class="icon"></span>
      <span class="people-num">已结束</span>
    </div>

    <div v-if="participateStatus === 0 && isInApp && !isEnd">  
      <div class="home-discribe">
        分享给好友，好友参与后你的中奖概率翻倍
      </div>
      <div class="btn" @click="handleJoinShare">马上参与并分享</div>
    </div>

    <div v-if="isInApp && participateStatus === 1 && !isEnd">  
      <div class="home-discribe">
        好友为你助力，中奖概率翻了{{ multipleCount }}倍
      </div>
      <div class="btn" @click="handleShareFriend">马上分享给好友</div>
    </div>

    <div v-if="winnerName !== '' && isInApp && isEnd" class="winner-content">  
      <span class="winner-people">中奖者:</span>
      <span class="winner-img">
        <img :src="winnerHeadUrl" alt="">
      </span>
      <span class="winner-name">
        {{ winnerName }}
      </span>
      <i></i>
    </div>

    <div v-if="(!isInApp && isEnd) || (!isInApp && participateStatus === 1)" class="not-app">  
      <span class="btn-title2">
        我猜幸运儿就是你！
      </span>
      <div class="btn animate code-copy" @click="handleGoApp" data-clipboard-target="#code" key="1" >去app内查看结果</div>
    </div>


    <div v-if="!isInApp && participateStatus === 0 && !isEnd" class="not-app">  
      <span class="btn-title1">
        快来参与吧，奖金分你一半！
      </span>
      <div class="btn animate" @click="handleJoin" key="2">马上参与</div>
    </div>

    <input type="" name="" :value="cdk" id="code" style="opacity: 0" />


    <component :is="curview" :show.sync="modalShow" :data="data"></component>
  </div>
  
</template>

<script>
import modalMixins from '@components/pop/modalMixins'; // 弹窗系列控制
import {getUrlParameter,isWeiXin,isAndroid,setLocalStorage,getLocalStorage} from '../../components/utils';
import bridge from "@components/bridge/index";
export default {
  name: 'home',
  components: {
    FriendShare: resolve => {
      require(['../../components/modals/FriendShare.vue'], resolve);
    },
    userShare: resolve => {
      require(['../../components/modals/userShare.vue'], resolve);
    }
  },
  mixins: [modalMixins],
  data() {
    return {
      endTime: 0,
      time: {
        day: '00',
        hours: '00',
        seconds: '00',
        minutes: '00'
      },
      participantNum: null,
      winnerHeadUrl: '',
      winnerName: '',
      participateStatus: 0,
      multipleCount: null,
      isInApp: null,
      participantName: '',
      participantHeadUrl: '',
      isEnd: null,
      cdk: '',
      page_type: ''
    };
  },
  methods: {
    handleClick() {
      this.$bus.$emit('showModal', {
        modalId: 'FriendShare',
        data: {
          endTime: this.endTime,
          cdk: this.cdk
        }
      });
    },
    handleJoinShare() {
      if(this.participateStatus === 1) {
        this.$embed.singleClk(this.$embed.TYPE_1501, {page_type: 2})
      } else {
        this.$embed.singleClk(this.$embed.TYPE_1501, {page_type: 1})
      }
      this.$http("/youtui/sendPrize/doJoin", {
        params: {
          sourceToken: getUrlParameter("sourceToken"),
          sourceUserId: getUrlParameter("sourceUserId"),
          sessionKey: getUrlParameter("sessionKey"),
          id: getUrlParameter("id")       
        }
      }).then((res)=>{
        if(res.data.success) {
          this.getUserInfo();
        }
      }).catch((err)=>{
        console.log(err)
      })
      bridge.h5Share({})
    },
    handleShareFriend() {
      if(this.participateStatus === 1) {
        this.$embed.singleClk(this.$embed.TYPE_1501, {page_type: 2})
      } else {
        this.$embed.singleClk(this.$embed.TYPE_1501, {page_type: 1})
      }
      this.$http("/youtui/sendPrize/doJoin", {
        params: {
          sourceToken: getUrlParameter("sourceToken"),
          sourceUserId: getUrlParameter("sourceUserId"),
          sessionKey: getUrlParameter("sessionKey"),
          id: getUrlParameter("id")       
        }
      }).then((res)=>{
        if(res.data.success) {
          this.getUserInfo();
        }
      }).catch((err)=>{
        console.log(err)
      })
      bridge.h5Share({})
    },
    handleJoin() {
      this.$embed.singleClk(this.$embed.TYPE_2)
      this.$http("/youtui/sendPrize/doJoin", {
        params: {
          sourceToken: getUrlParameter("sourceToken"),
          sourceUserId: getUrlParameter("sourceUserId"),
          sessionKey: getUrlParameter("sessionKey"),
          id: getUrlParameter("id")       
        }
      }).then((res)=>{
        if(res.data.success) {
          this.getUserInfo();
          this.handleClick();
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    handleGoApp() {
      var clipboard = new ClipboardJS('.code-copy');
      clipboard.on('success', (e)=>{
        e.clearSelection();
        clipboard.destroy();
      });
      let page_source;
      if(this.isEnd) {
        page_source = 3;
        this.$embed.singleClk(this.$embed.TYPE_9, {page_source: 3})
      }else {
        page_source = 2;
        this.$embed.singleClk(this.$embed.TYPE_9, {page_source: 2})
      }
      this.$bus.$emit('showModal', {
        modalId: 'userShare',
        data: {
          page_source,
          cdk: this.cdk
        }   
      });
    },
    getTime(time) {
      let splitTime = time - new Date().getTime();
      if(splitTime > 0) {
        let day = Math.floor(splitTime/86400000);
        let hours = Math.floor(splitTime/3600000 - day*24);
        let minutes = Math.floor(splitTime/60000 - day*24*60 - hours*60);
        let seconds = Math.floor(splitTime/1000 - minutes*60 - day*24*60*60 - hours*60*60);
        this.isEnd = false;
        return {
          day: this.getString(day),
          hours: this.getString(hours),
          minutes: this.getString(minutes),
          seconds: this.getString(seconds),
        }
      } else {
        this.isEnd = true;
        this.getUserInfo();
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
    //定时器
    countTimer(flag) {
      if(flag){
        var fun = setTimeout(()=>{
            if(this.getTime(this.endTime)) {   
              this.time = this.getTime(this.endTime);
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
    },

    //获取数据
    getUserInfo() { 
      this.isInApp = getUrlParameter('appPreview') == 1 ? true : false;
      this.$http("/youtui/sendPrize/index", {
        params: {
          sourceToken: getUrlParameter("sourceToken"),
          sourceUserId: getUrlParameter("sourceUserId"),
          sessionKey: getUrlParameter("sessionKey"),
          id: getUrlParameter("id")
        }
      }).then((res)=>{
        //非aap内部获取字段
        // if(!this.isInApp) {
          this.participantName = res.data.data.participantName || '';
          this.participantHeadUrl = res.data.data.participantHeadUrl || '';
        // } else {    
          this.winnerHeadUrl = res.data.data.winnerHeadUrl || '';
          this.winnerName = res.data.data.winnerName || '';
        // }
        if(res.data.data.endTime - new Date().getTime() < 0) {
          this.isEnd = true;
        } else {
          this.isEnd = false;
        }
        this.endTime = res.data.data.endTime || new Date().getTime();
        this.countTimer(true);
        this.participateStatus = res.data.data.participateStatus;
        this.participantNum = res.data.data.participantNum;
        this.multipleCount = res.data.data.multipleCount;
        this.cdk = res.data.data.cdk;
      }).catch((err)=>{
        console.log(err)
      })
    },
    //获取埋点数据
    getEmbed() {
      return new Promise((resolve, reject) => {
        this.$http("/youtui/sendPrize/getEmbed", {
          params: {
            sourceToken: getUrlParameter("sourceToken"),
            sourceUserId: getUrlParameter("sourceUserId"),
            sessionKey: getUrlParameter("sessionKey"),
            id: getUrlParameter("id"),
            share_way: getUrlParameter("share_way"),
            appPreview: getUrlParameter("appPreview") || ''
          }
        }).then((res)=>{
          if(res.data.success) {
            resolve(res.data.data)
          }
        }).catch((err)=>{
            reject(err)
        })
      })
    },
    toDownloadUrl(url, page_source) {
      setTimeout(()=>{
        window.location.href = url;
      }, 120);
    },

    getDownloadUrl() {
      return new Promise((resolve, reject) => {
        this.$http("/youtui/system/getDownloadUrl", {
          params: {
            sourceToken: getUrlParameter("sourceToken"),
            sourceUserId: getUrlParameter("sourceUserId"),
            sessionKey: getUrlParameter("sessionKey"),
            channelString: "yysc-cc-wintreasure"    
          }
        }).then((res)=>{
          resolve(res.data.data)
          // this.downloadUrl = res.data.data.channelString;
        }).catch((err)=>{
          reject(err)
        })
      })
    }
  },
  
  created() {
    this.getUserInfo();
    if(!isWeiXin() && isAndroid() && getUrlParameter("appPreview") != 1) {
      this.getEmbed().then((res)=>{
        this.$embed.update(res);
        this.getDownloadUrl().then((res)=>{
          document.body.innerHTML = '';
          this.$embed.singleClk(this.$embed.TYPE_10, {loadpage_source_type: 2})
          this.toDownloadUrl(res, this.data.page_source);
        })
      }).catch((error)=>{
        console.log(error)
      })
    }
  },
  mounted() {
    if(!isWeiXin() && !isAndroid() && getUrlParameter("appPreview") != 1) {
        var str = "youtui/ab/getIosDownload";
        location.href = `${location.origin}/${str}`;
      }
    // //埋点
    // if(getLocalStorage("page_type")) {
    //   this.page_type = 2;
    // } else {
    //   setLocalStorage("page_type", 1)
    //   this.page_type = 1;
    // }
    this.getEmbed().then((res)=>{
      this.$embed.update(res);
      if(!this.isInApp && this.participateStatus === 0) {
        this.$embed.singleClk(this.$embed.TYPE_1, location.search)
      }
      if(!this.isInApp && this.getTime(this.endTime) && this.participateStatus === 1) {
        this.$embed.singleClk(this.$embed.TYPE_4, {award_status: 2})
      }

      if(!this.isInApp && !this.getTime(this.endTime)) {
        this.$embed.singleClk(this.$embed.TYPE_4, {award_status: 3})
      }

      if(this.isInApp && this.participateStatus === 0) {
        this.$embed.singleClk(this.$embed.TYPE_15)
      }
    }).catch((err)=>{
      console.log(err)
    })
  }
};
</script>


<style lang="less" scoped>
.bg(@url) {
  background-repeat: no-repeat;
  background-size: 100%;
  background-image: url('../../img/@{url}');
}
.home-page {
  background-color: #D0261F;
  min-height: 100vh;
  width: 100%;
  text-align: center;
  position: relative;
  .bg("bg.png");
  padding-top: 47px;
  .share-people {
    position: absolute;
    top: 113px;
    left: 316px;
    .share-img {
      height: 112px;
      width: 112px;
      border-radius: 50%;
      border: 8px solid #FFA14D;
      img {
        width: 98px;
        height: 98px;
        border-radius: 50%;
      }
    }
    .share-name {
      position: absolute;
      width: 116px;
      height: 36px;
      border-radius: 4px;
      border: 5px solid #E04C44;
      font-size:26px;
      color:rgba(229,20,30,1);
      line-height:26px;
      font-weight: bolder;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background: #fff;
      bottom: -18px;
      left: -2px;
    }
  }
  .home-title {
    color: #fff;
    text-align: center;
    font-size: 30px;
    line-height: 26px;
  }
  .home-img {
    width: 100%;
    margin-top: 210px;
    text-align: center;
    position: relative;
    .home-card {
      width: 468px;
    }
    .home-small {
      width: 140px;
      position: absolute;
      bottom: -50px;
      right: 96px;
    }
  }
  .card-title {
    width:386px;
    height:64px;
    background:rgba(221,66,58,1);
    border-radius:8px;
    text-align: center;
    margin-top: 90px;
    margin-left: 186px;
    span {
      width:231px;
      height:34px;
      font-size:36px;
      color: #fff;
      line-height:64px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        top: 40%;
        left: -24px;
        width: 10px;
        height: 10px;
        background: #fff;
        transform: rotateZ(45deg);
      }
      &::before {
        content: '';
        position: absolute;
        top: 40%;
        right: -24px;
        width: 10px;
        height: 10px;
        background: #fff;
        transform: rotateZ(45deg);
      }
    }
  }
  .home-time {
    margin-top: 40px;
    text-align: center;
    .time-word {
      font-size:30px;
      color:rgba(169,49,5,1);
      line-height:66px;
      font-weight: bolder;
    }
    .time-num {
      display: inline-block;
      width:23px;
      height:46px;
      background:rgba(84,63,63,1);
      border-radius:4px;
      color: #fff;
      line-height: 50px;
      font-weight: bolder;
      margin-right: -4px;
    }
  }
  .home-people {
    margin-top: 40px;
    text-align: center;
    .icon {
      .bg("icon.png");
      height: 30px;
      width: 30px;
      display: inline-block;
      position: absolute;
      left: 160px;
    }
    .people-num {
      font-size:30px;
      color:rgba(169,49,5,1);
      line-height: 30px;
      font-weight: bolder;
    }
  }
  .home-discribe {
    height:30px;
    font-size:28px;
    color:rgba(247,205,144,1);
    line-height:30px;
    margin-top: 80px;
  }
  .btn {
    height: 100px;
    width: 584px;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url('../../img/btn.png');
    margin: 22px 84px;
    font-size:37px;
    color:rgba(206,36,28,1);
    line-height: 100px;
    font-weight: bolder;
  }
  .not-app {
    margin-top: 90px;
    .btn-title1 {
      background:rgba(251,222,165,1);
      border-radius:8px;
      font-size:26px;
      color: #FF2B35;
      line-height:28px;
      padding: 15px 34px;
      font-weight: bold;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        display: inline-block;
        border: solid 20px #655b16;
        top: 60px;
        left: 186px;
        border-color: #FBDEA5 transparent transparent transparent;
        z-index: 20;
      }
    }
    .btn-title2 {
      background:rgba(251,222,165,1);
      border-radius:8px;
      font-size:26px;
      color: #FF2B35;
      line-height:28px;
      padding: 15px 34px;
      font-weight: bold;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        top: 60px;
        left: 136px;
        display: inline-block;
        border: solid 20px #655b16;
        border-color: #FBDEA5 transparent transparent transparent;
        z-index: 20;
      }
    }
  }
  .winner-content {
    position: relative;
    width:696px;
    height:162px;
    margin-top: 76px;
    margin-left: 28px;
    padding: 18px 74px 26px 100px;
    span {
      float: left;
    }
    .bg("button.png");
    .winner-people {
      font-size:40px;
      color:rgba(173,23,16,1);
      font-weight: bold;
      margin-top: 42px;
    }
    .winner-img {
      display: inline-block;
      width: 118px;
      height: 118px;
      margin: 0 30px 0 40px;
      border-radius: 50%;
      border: 8px solid #FFA14D;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .winner-name {
      width:196px;
      height: 70px;
      display: block;
      background:rgba(255,255,255,1);
      border-radius:8px;
      border: 6px solid #FB7A4D;
      line-height: 56px;
      font-size:40px;
      color:rgba(173,23,16,1);
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-top: 24px;
    }
    i {
      display: inline-block;
      width: 69px;
      height: 63px;
      position: absolute;
      top: 10px;
      right: 56px;
      .bg('hard.png');
    }

  }
  .animate {
    animation: breathe 1s linear infinite;
  }
  @keyframes breathe {
    0% {transform: scale(0.8, 0.8)}
    25% {transform: scale(0.9, 0.9)}
    50% {transform: scale(1, 1)}
    75% {transform: scale(0.9, 0.9)}
    100% {transform: scale(0.8, 0.8)}
  }
}
</style> 