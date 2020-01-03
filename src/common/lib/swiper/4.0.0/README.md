
## lib.slider  精简版

* https://github.com/thebird/swipe

## 例子
```
Swipe(document.getElementById('swipe'), {
    startSlide: 0,
    speed: 400,
    auto: 3000,
    continuous: true,
    disableScroll: false,
    stopPropagation: false,
    callback: function(index, elem) {},
    transitionEnd: function(index, elem) {}
});
```