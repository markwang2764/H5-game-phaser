
### 绘图板



#### usage

```js
 <draw ref='draw' v-if="hackReset" :action='globalCompositeOperation' :pause='hasDone'></draw>
```

#### Tips

组件有两个功能，绘画和播放。互相独立，有不同的props和methods

#### Props

```js
style:{
  color: '#000', //画笔颜色
  lineWidth: 5,  //画笔宽度
  eraserWidth: 20  //橡皮擦的宽度
}
action:'source-over'||'destination-out'  // 执行的动作，画图||橡皮擦

replayData：''// 绘画路径加密压缩后的字符串 （播放时）
pause：false. //是否暂停绘画

```

#### Methods



```js
replay()  //回放绘画路径  （播放时）

getLines()  //获取绘画路径

output(opts)  - opts直接传给canvas.toDataURL(opts)  //输出图片

clean（） // 清空画板 
```

