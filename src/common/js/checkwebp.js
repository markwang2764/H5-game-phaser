/**
 * 检查是否支持.webp 格式图片
 *
 * 支持 webp CDN   ?x-oss-process=image/format,webp
 * 不支持    CDN   ?x-oss-process=image/quality,Q_80
 */

;
(function() {
  var urlarr = [];
  // localStorage存在且之前没设置过iswebp
  if (localStorage && !localStorage.iswebp) {
    var cs = document.createElement('canvas');

    // 如果不支持canvas则退出
    if (cs.getContext && cs.getContext('2d')) {
      try {
        localStorage.iswebp = (0 === cs.toDataURL('image/webp').indexOf('data:image/webp'));
      } catch (e) {
        // safari 浏览器无恒模式在低于11版本会有bug
        // https://stackoverflow.com/questions/21159301/quotaexceedederror-dom-exception-22-an-attempt-was-made-to-add-something-to-st
        console.error(e);
      }
    }
  }

  function getOssImg(url) {
    if (!url) {
      return url;
    }

    // 不支持localStorage或者没有设置过iswebp或者isweb是false
    if (!localStorage || !localStorage.iswebp || localStorage.iswebp === 'false') {
      url = url + '?x-oss-process=image/quality,Q_80';

      return url;
    } else {
      // gif 的图片不做处理
      urlarr = url.split('.');
      if (urlarr.length > 0 && urlarr[urlarr.length - 1] === 'gif') {
        return url;
      }
      url = url + '?x-oss-process=image/format,webp';

      return url;
    }
  }

  String.prototype.ossimg = function() {
    return getOssImg(this);
  };
})();


