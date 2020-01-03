<template>
  <canvas id='draw-canvas' ref='canvas' width='585' height="509"></canvas>
</template>

<script>
import { Drawing, ColorsLine, zip, unzip } from './def.js';
export default {
  data() {
    return {
      canvas: null,
      lines: []
    };
  },
  props: {
    styles: {
      type: Object,
      default() {
        return {
          color: '#000',
          lineWidth: 5,
          eraserWidth: 20
        };
      }
    },
    action: {
      type: String,
      default: 'source-over'
    },
    replayData: {
      type: String
    },
    pause: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.canvas = this.$refs['canvas'];
    if (this.canvas) {
      this.bindEvent();
    }
  },
  methods: {
    bindEvent(e) {
      // context.save();
      var canvas = this.canvas;
      var self = this;
      canvas.addEventListener('touchstart', function(e) {
        if (self.pause === true) {
          return;
        }
        var context = canvas.getContext('2d');
        var style = window.getComputedStyle(canvas, null);
        var cssWidth = parseFloat(style['width']);
        var cssHeight = parseFloat(style['height']);
        var scaleX = canvas.width / cssWidth; // 水平方向的缩放因子
        var scaleY = canvas.height / cssHeight;
        var evt = e || window.event;
        var x = evt.targetTouches[0].clientX;
        var y = evt.targetTouches[0].clientY;
        var rect = canvas.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
        x *= scaleX; // 修正水平方向的坐标
        y *= scaleY; // 修正垂直方向的坐标
        var line;
        context.globalCompositeOperation = self.$props['action'];
        context.lineWidth = self.$props['action'] === 'source-over' ? self.$props['styles'].lineWidth : self.$props['styles'].eraserWidth;
        context.strokeStyle = `${self.$props['styles'].color}`;

        console.log(context.globalCompositeOperation, context.strokeStyle, context.lineWidth);

        context.beginPath();
        context.moveTo(x, y);
        console.log(ColorsLine, 111);
        line = new ColorsLine();
        line.setData(context.globalCompositeOperation, context.strokeStyle, context.lineWidth);
        line.add(x, y);

        canvas.addEventListener('touchmove', function(e) {
          if (self.pause === true) {
            return;
          }
          var evt = e || window.event;
          var style = window.getComputedStyle(canvas, null);
          var cssWidth = parseFloat(style['width']);
          var cssHeight = parseFloat(style['height']);
          var scaleX = canvas.width / cssWidth; // 水平方向的缩放因子
          var scaleY = canvas.height / cssHeight;
          var x = evt.targetTouches[0].clientX;
          var y = evt.targetTouches[0].clientY;
          var rect = canvas.getBoundingClientRect();
          x -= rect.left;
          y -= rect.top;
          x *= scaleX; // 修正水平方向的坐标
          y *= scaleY; // 修正垂直方向的坐标
          context.lineTo(x, y);
          context.stroke();

          line.add(x, y);
        });

        canvas.addEventListener('touchend', function() {
          if (self.pause === true) {
            return;
          }
          canvas.onmousemove = null;
          self.lines.push(line);
          // context.closePath();
          // context.restore();
        });
      });
    },
    replay(pathData) {
      var context = this.canvas.getContext('2d');
      var drawing = new Drawing();
      var lines = drawing.setData(unzip(pathData));
      drawing.play(context, lines);
    },
    getLines() {
      return {
        lines: this.lines,
        zip: zip(JSON.stringify(this.lines))
      };
    },
    output(opts) {
      return this.canvas.toDataURL(opts);
    },
    clean() {
      this.canvas.height = this.canvas.height;
      this.lines = [];
    }
  },
  watch: {
    replayData(val) {
      if (!val) {
        return;
      }
      this.replay(val);
    }
  }
};
</script>
<style lang="less" scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>


