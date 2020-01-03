<template>
  <div class="btn-blue" @click="onBtnClick">
      {{text}}<br>
    <div class="time">有效期倒计时：<span >{{time}}</span></div>
  </div>
</template>

<script>
export default {
  name: 'countdown-btn',
  props: {
    deadline: {
      type: Number
    },
    onBtnClick: {
      type: Function
    },
    onTimeEnd: {
      type: Function
    },
    text: {
      type: String
    }
  },
  data() {
    return {
      timer: null,
      time: ''
    };
  },
  methods: {
    run: function() {
      let end = this.deadline;
      let begin = + new Date();
      let onEnd = this.onTimeEnd;
      let diff = end - begin;

      diff = Math.floor(diff / 1000); // 取秒
      let daySecs = 86400;
      let hourSecs = 3600;
      let minSecs = 60;

      if (diff < 0) {
        onEnd && onEnd();
        this.stop();
        return;
      }

      let h  = Math.floor(diff / hourSecs);
      let m = Math.floor((diff - h * hourSecs) / minSecs);
      let s = diff - h * hourSecs - m * minSecs;

      this.time = `${this._fixZero(h)}:${this._fixZero(m)}:${this._fixZero(s)}`;
    },

    /**
     * 时间补0
     * @param n
     * @returns {string}
     * @private
     */
    _fixZero: function(n) {
      return n >= 10 ? n : '0' + n;
    },

    start: function() {
      let self = this;
      self.run();
      this.timer = setInterval(function() {
        self.run();
      }, 1000);
    },

    stop: function() {
      this.timer && clearInterval(this.timer);
    }
    },
  mounted() {
    this.start();
  }
};
</script>

<style lang="less">
.bg-fill(@url) {
  background-repeat: no-repeat;
  background-size: 100% 100% ;
  background-image: url('../img/@{url}');
}
.btn-blue {
  display: inline-block;
  width: 644px;
  height: 152px;
  color: #16151a;
  padding-top: 20px;
  font-size: 40px;
  color: #fff;
  font-weight: 600;
  text-align: center;
  .bg-fill('btn_blue.png');

  .time{
      color: #fff;
      font-size: 32px;
        margin-top: 18px;
      span{
          color: #FFE316;
      }
  }
}
</style> 