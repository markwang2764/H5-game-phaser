/**
 * @note   推啊 - 统计代码
 * @date   2017-10-11
 * @des
 *         1. DOM中写db-exposure属性，属性中传入后端给的数据，通常为 ${lottery}
 *         2. 埋点初始化，调用 window.DB.exposure.initLog()
 *         3. 埋点批量曝光，调用 window.DB.exposure.showLog()
 *         4. 埋点点击埋点， 调用 window.DB.exposure.clickLog()
 *         5. 埋点单张曝光， 调用 window.DB.exposure.singleExp(data)
 *         6. 埋点单次点击， 调用 window.DB.exposure.singleClk({data:data, callback:callback})
 * @update: 2017-05-18 20:13:46
 *         增加点击需求
 *         默认<a db-exposure=""></a> 曝光
 *         <a db-click=""></a> 点击
 *         <a db-exposure="" db-click=""></a> 曝光+点击
 * 
 *         增加singleExp、singleClk
 *
 */


(function(window, $, DB) {
  $.cookie=function(a,b,c){if("undefined"==typeof b){var d=null;if(document.cookie&&""!=document.cookie)for(var e=document.cookie.split(";"),f=0;f<e.length;f++){var g=$.trim(e[f]);if(g.substring(0,a.length+1)==a+"="){d=decodeURIComponent(g.substring(a.length+1));break}}return d}c=c||{},null===b&&(b="",c=$.extend({},c),c.expires=-1);var h="";if(c.expires&&("number"==typeof c.expires||c.expires.toUTCString)){var i;"number"==typeof c.expires?(i=new Date,i.setTime(i.getTime()+24*c.expires*60*60*1e3)):i=c.expires,h="; expires="+i.toUTCString()}var j=c.path?"; path="+c.path:"",k=c.domain?"; domain="+c.domain:"",l=c.secure?"; secure":"";document.cookie=[a,"=",encodeURIComponent(b),h,j,k,l].join("")};
  var Ret = $.cookie('Ret');

    var exposure = {
      logTimeout: null,
      $win: $(window),
      initLog: function() {
        var self = this;
        self.showLog();
        self.clickLog();
        self.srollLog();
      },
      singleExp: function(data) {
        var domainUrl, webUrl;

        if (data === undefined || data === 'undefined' || $.trim(data) === '' || data === 'null') {
          return;
        }

        if (data && typeof data === 'string') {
          data = JSON.parse(data);
        } else {
          return;
        }

        // 埋点服务器曝光
        if (data.domain) {
          var arr = [];
          for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
          }
          domainUrl = data.domain + '/exposure/standard?' + arr.join('&') + '&_t=' + (new Date().getTime()) + '&Ret=' + Ret;
          var $img = $('<img style="display:none;" src="' + domainUrl + '">'); // img src方式曝光
        }

        // web服务器曝光
        if (data.domain4Web) {
          var arr = [];
          for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
          }
          webUrl = data.domain4Web + data.url + '?' + arr.join('&') + '&_t=' + (new Date().getTime());
          var $img = $('<img style="display:none;" src="' + webUrl + '">'); // img src方式曝光
        }
      },
      // 曝光
      showLog: function(callback) {
        var self = this, Wheight = self.$win.height(), Wwidth = self.$win.width();
  
        // 遍历DOM
        $('body').find('[db-exposure]').not('[db-exposure-get]').each(function() {
          var me = $(this), data = me.attr('db-exposure');
  
          // 规避 隐藏 (visiblity除外)
          if (me.offset() && me.offset().width === 0) {
            return;
          }

          if (data === undefined || data === 'undefined' || $.trim(data) === '' || data === 'null') {
            return;
          }
  
          //判断是否在屏幕范围内，在则继续，不在则返回
          if ( $(window).scrollTop() + Wheight >= me.offset().top && $(window).scrollLeft() + Wwidth >= me.offset().left ) {
            me.attr('db-exposure-get', true);
          } else {
            return;
          }
  
          if (data === undefined || data === 'undefined' || $.trim(data) === '') {
            return;
          }
  
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.log('数据曝光失败:' + (e || ''));
          }
  
          if (data.domain) {
            // 发送埋点到埋点服务器
            data.Ret = Ret;
            self.sendApi({
              domain: data.domain,
              url: '/exposure/standard',
              data: data
            }, function() {
              callback && callback();
            });
          }
          if (data.domain4Web) {
            // 发送埋点到内部日志
            self.sendApi({
              domain: data.domain4Web,
              url: data.url,
              data: data
            }, function() {
              callback && callback();
            });
          }
        });
      },
      singleClk: function(options) {
        var self = this;
        var _defaults = {
          data: null,
          callback: function() {}
        }
        options = $.extend(true, _defaults, options);
        var data = options.data, callback = options.callback;

        if (data === undefined || data === 'undefined' || $.trim(data) === '') {
          callback && callback();
          return;
        }

        try {
          data = JSON.parse(data);
        } catch (e) {
          console.log('数据曝光失败:' + (e || ''));
        }

        if (data.domain4Web) {
          // 发送点击埋点到内部日志
          self.sendApi({
            domain: data.domain4Web,
            url: data.url,
            data: data
          }, function() {
            callback && callback();
          });
        }
      },
      clickLog: function(callback) {
        var self = this;
  
        $('body').find('[db-click]').unbind('click.statistics').bind('click.statistics', function() {
          var me = $(this), data = me.attr('db-click');
  
          // 规避 隐藏 && disabled
          if (me.css('display') === 'none' || me.attr('disabled') === 'disabled' || me.prop('disabled')) {
            return;
          }
  
          if (data === undefined || data === 'undefined' || $.trim(data) === '') {
            return;
          }
  
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.log('数据曝光失败:' + (e || ''));
          }
  
          if (data.domain4Web) {
            // 发送点击埋点到内部日志
            self.sendApi({
              domain: data.domain4Web,
              url: data.url,
              data: data
            }, function() {
              callback && callback();
            });
          }
        });
      },
      //屏幕滚动
      srollLog: function(callback) {
        var self = this;
        clearTimeout(self.logTimeout);
        self.logTimeout = setTimeout(function() {
          self.$win.scroll(function() {
            self.showLog();
          });
        }, 200);
      },
      sendApi: function(data, complete, success, error) {
  
        // 数据过滤，防刷
        try {
          var Protection = JSON.stringify(data);
          if (Protection.indexOf('iframe') !== -1) {
            return;
          }
        } catch (e) {
          console.log('数据异常:' + (e || ''));
        }
  
        var domain = data.domain || '',
          url = data.url;
  
        // domain不存在，返回
        if (!domain) return;
  
        // domain、 url不需要传，过滤不需要的数据
        delete data.domain;
        delete data.url;
  
        if (data.data && data.data.domain) {
          delete data.data.domain
        }
  
        $.ajax({
          url: domain + url,
          data: data.data,
          dataType: 'jsonp',
          type: 'get',
          timeout: 400,
          jsonpCallback: 'tracks',
          complete: function() {
            complete && complete();
          },
          success: function(datas) {
            success && success(datas);
          },
          error: function(datas) {
            error && error(datas);
          }
        });
      }
    };

    var format = function(data) {
      if (data) {
        var _data = JSON.parse(data);
      } else {
        return;
      }
  
      var arr = [];
      for (var name in _data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(_data[name]));
      }
      return _data.domainWeb + _data.url + '?' + arr.join('&');
    }
  
    // 调用 window.DB.exposure
    DB.exposure = exposure;
    DB.format = format;
  
  })(window, $, window.DB || (window.DB = {}));