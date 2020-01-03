var defaultConfig = {

  content: '',

  size: 'auto',

  mask: true,

  position: 'center',

  radius: 8,

  closeTime: 0,

  actionConfig: [],

  mainStyle: {
    'display': 'inline-block',
    'max-width': '65%',
    'border-radius': '0.1rem',
    'background': '#fff'
  }
};

function popup (content, config) {
  var cf = $.extend(true, {}, defaultConfig, config);

  cf.content = content || cf.content;

  // 初始化html
  var $mask = $('<div></div>').addClass('popup-mask'),
    $main = $('<div></div>').addClass('popup-main'),
    $content = $('<div></div>').addClass('popup-content');

    // 构建初步的样式
  $mask.css({
    'position': 'fixed',
    'left': 0,
    'top': 0,
    'width': '100%',
    'height': '100%',
    'background': 'rgba( 0, 0, 0,.6)',
    'z-index': 999
  });

  $main.css(cf.mainStyle);
  $mask.append($main);
  $main.append($content);

  // config.mask
  if (cf.mask === false) {
    $mask.css({
      'background': 'rgba(0,0,0,0)'
    });
  }

  // config.content
  $content.html(cf.content);

  // config.size
  if (typeof cf.size === 'object') {
    $main.css({
      'width': cf.size.width,
      'height': cf.size.height
    });
  }

  // config.action

  var acflength = cf.actionConfig.length;
  if (acflength > 0) {
    var $action = $('<div></div>').addClass('popup-action'),
      $actionBtn = $('<a></a>').addClass('popup-action-btn'),
      defaultAction = {
        text: '',
        callback: function () {}
      };
    $action.css({
      'padding': '.2rem 0',
      'text-align': 'center'
    });

    $main.append($action);

    if (acflength >= 3) {
      $actionBtn.css({
        'width': 100 / cf.actionConfig.length + '%',
        'text-align': 'center',
        'font-size': '0.25rem',
        'color': '#0d81ff',
        'display': 'inline-block',
        'text-decoration': 'none',
        'border-top': '1px #eee solid',
        'padding': '0.18rem 0'
      });
    }

    cf.actionConfig.reverse();
    for (var k = acflength; k--;) {
      var $t = $actionBtn.clone(),
        acf = $.extend({}, defaultAction, cf.actionConfig[k]);

      $t.css({
        'display': 'inline-block',
        'height': '.4rem',
        'text-align': 'center',
        'font-size': '0.2rem',
        'line-height': '.4rem',
        'text-decoration': 'none',
        'border-radius': '.04rem',
        'box-sizing': 'border-box'
      });

      if (acflength === 1) {
        $t.css({
          'width': '78%',
          'color': '#fff',
          'background-color': 'rgba(112, 112, 112, 0.68)'
        });
      } else if (acflength === 2) {
        if (k === 1) {
          $t.css({
            'width': '3.25rem',
            'color': '#ff4965',
            'border': '1px #ff4965 solid',
            'margin-right': '0.6rem'
          });
        } else {
          $t.css({
            'width': '3.25rem',
            'color': '#fff',
            'background-color': '#ff4965'
          });
        }
      }

      $t
        .html(acf.text)
        .on('click', {
          acf: acf
        }, function (ev) {
          ev.data.acf.callback();
        });
      if (k < cf.actionConfig.length - 1 && cf.actionConfig.length >= 3) {
        $t.css({
          'box-sizing': 'border-box',
          'border-right': '1px #eee solid'
        });
      }
      $action.append($t);
    }
  }

  // 插入popbox
  $('body').append($mask);

  // 定位
  if (cf.position === 'center') {
    $main.css({
      'position': 'absolute',
      'top': '50%',
      'left': '50%',
      'margin-left': -$main.width() / 2,
      'margin-top': -$main.height() / 2
    });
  } else if (cf.position === 'top') {
    $main.css({
      'position': 'absolute',
      'top': '5%',
      'left': '50%',
      'margin-left': -$main.width() / 2
    });
  } else if (cf.position === 'bottom') {
    $main.css({
      'position': 'absolute',
      'top': '95%',
      'left': '50%',
      'margin-left': -$main.width() / 2,
      'margin-top': -$main.height()
    });
  }

  // config.closeTime
  if (cf.closeTime !== 0) {
    setTimeout(function () {
      method.fadeOut(function () {
        method.remove();
      });
    }, cf.closeTime);
  }

  var method = {

    $mask: $mask,

    $main: $main,

    $contnet: $content,

    show: function () {
      this.$mask.show();
      return this;
    },

    hide: function () {
      this.$mask.hide();
      return this;
    },

    fadeOut: function (callback) {
      var self = this;
      var fadeOut = function (a, b) {
        a -= b;
        self.$mask.css('opacity', a / 200);
        setTimeout(function () {
          fadeOut(a, b);
        }, b);
        if (a === 0) {
          callback();
        }
      };
      fadeOut(200, 20);
    },

    remove: function () {
      this.$mask.remove();
      return this;
    }

  };

  return method;
};

popup.loading = function (config) {
  config = $.extend(true, {}, {
    mainStyle: {
      'background': 'rgba(0,0,0,.5)',
      'padding': '.1rem .15rem'
    }
  }, config);

  return popup('<style>.sk-fading-circle{width:0.3rem;height:0.3rem;position:relative}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0}.sk-fading-circle .sk-circle:before{content:"";display:block;margin:0 auto;width:15%;height:15%;background-color:#fff;border-radius:100%;-webkit-animation:sk-circleFadeDelay 1.2s infinite ease-in-out both;animation:sk-circleFadeDelay 1.2s infinite ease-in-out both}.sk-fading-circle .sk-circle2{-webkit-transform:rotate(30deg);-ms-transform:rotate(30deg);transform:rotate(30deg)}.sk-fading-circle .sk-circle3{-webkit-transform:rotate(60deg);-ms-transform:rotate(60deg);transform:rotate(60deg)}.sk-fading-circle .sk-circle4{-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.sk-fading-circle .sk-circle5{-webkit-transform:rotate(120deg);-ms-transform:rotate(120deg);transform:rotate(120deg)}.sk-fading-circle .sk-circle6{-webkit-transform:rotate(150deg);-ms-transform:rotate(150deg);transform:rotate(150deg)}.sk-fading-circle .sk-circle7{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}.sk-fading-circle .sk-circle8{-webkit-transform:rotate(210deg);-ms-transform:rotate(210deg);transform:rotate(210deg)}.sk-fading-circle .sk-circle9{-webkit-transform:rotate(240deg);-ms-transform:rotate(240deg);transform:rotate(240deg)}.sk-fading-circle .sk-circle10{-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}.sk-fading-circle .sk-circle11{-webkit-transform:rotate(300deg);-ms-transform:rotate(300deg);transform:rotate(300deg)}.sk-fading-circle .sk-circle12{-webkit-transform:rotate(330deg);-ms-transform:rotate(330deg);transform:rotate(330deg)}.sk-fading-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.sk-fading-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.sk-fading-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}.sk-fading-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.sk-fading-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}.sk-fading-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.sk-fading-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}.sk-fading-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.sk-fading-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}.sk-fading-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.sk-fading-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes sk-circleFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}@keyframes sk-circleFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}</style><div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div>', config);
};
popup.hideing = function () {
  $('.popup-mask').remove();
};

popup.note = function (text, config) {
  var defaultCfg = {
    mainStyle: {
      'background': 'rgba(0,0,0,.7)',
      'padding': '.1rem .15rem'
    },
    closeTime: 1000
  };

  if (typeof config === 'number') {
    config = $.extend(true, {}, defaultCfg, {
      closeTime: config
    });
  } else {
    config = $.extend(true, {}, defaultCfg, config);
  }

  return popup('<div style="color:#fff;font-size:0.12rem;margin:0">' + text + '</div>', config);
};

popup.confirm = function (text, confirmCallback, cancelCallback, config) {
  config = $.extend(true, {}, {
    mainStyle: {
      width: '65%'
    },
    mask: true,
    actionConfig: [{
      text: '取消',
      callback: function () {
        re.remove();
        cancelCallback && cancelCallback.apply(re);
      }
    }, {
      text: '确认',
      callback: function () {
        re.remove();
        confirmCallback && confirmCallback.apply(re);
      }
    }]
  }, config);

  var re = popup('<div style="padding:.3rem;text-align:center;font-size:0.2rem;">' + text + '</div>', config);

  return re;
};

popup.alert = function (text, config, callback) {
  config = $.extend(true, {}, {

    mainStyle: {
      width: '65%'
    },
    mask: true,
    actionConfig: [{
      text: '好的',
      callback: function () {
        re.remove();
        callback && callback();
      }
    }]
  }, config);

  var re = popup('<div style="padding:.25rem;text-align:center;font-size: 0.16rem;">' + text + '</div>', config);

  return re;
};

module.exports = popup;
