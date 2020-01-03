/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-18
 * @des
 */
import './index.less';

let toast = {
  _animTime: 250,
  _toast: null,
  _defaultTime: 2000, //
  _timer1: null,
  _init: function () {
    this._createDom();
  },
  _createDom: function () {
    if ($('.m-toast').length > 0) {
      $('.m-toast').remove();
    }
    let html =
      `<div class="m-toast">
        <div class="mkf-box">
          <div class="mkf-icon"></div>
          <div class="mkf-content-wrap">
            <div class="mkf-title"></div>
            <div class="mkf-content"></div>
          </div>
        </div>
      </div>`;
    this._toast = $(html);
    $('body').append(this._toast);
  },
  /**
   * 显示toast
   * @param option
   * @param time 默认2000ms
   */
  make: function (option, time) {
    let self = this;
    self._timer1 && clearTimeout(self._timer1);
    self._init();
    time = time || this._defaultTime;
    self._show();
    let content = option.content || '';
    let title = option.title || '';
    let type = option.type || 'info';
    self._toast.find('.mkf-content').html(content);
    self._toast.find('.mkf-title').html(title);
    if (!title) {
      self._toast.find('.mkf-title').hide();
    }
    if (!content) {
      self._toast.find('.mkf-title').css('margin-bottom', 0);
    }
    self._toast.addClass(type);
    self._timer1 = setTimeout(function () {
      self._hide();
    }, time);
  },
  _show: function () {
    let self = this;
    if (this._toast) {
      this._toast.removeClass('mkf-ts mkf-th');
      setTimeout(function () {
        self._toast.show().addClass('mkf-ts');
      }, 0);
    }
  },
  _hide: function () {
    let self = this;
    if (this._toast) {
      this._toast.removeClass('mkf-ts mkf-th');
      setTimeout(function () {
        self._toast.addClass('mkf-th');
        setTimeout(function () {
          self._toast.hide();
        }, self._animTime);
      }, 0);
    }
  }
};

export default toast;
