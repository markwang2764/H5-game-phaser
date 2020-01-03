/*
 * @Author: miaokefu@duiba.com.cn 
 * @Date: 2018-07-23 10:31:10 
 * @Last Modified by: miaokefu@duiba.com.cn
 * @Last Modified time: 2018-07-23 17:35:05
 */
import './index.less';

let toast = {
  _animTime: 250,
  _toast: null,
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
            <div class="mkf-content"></div>
        </div>
      </div>`;
    this._toast = $(html);
    $('body').append(this._toast);
  },
  /**
   * 显示toast
   * @param content
   * @param time 默认2000
   */
  make: function (content = '', time = 2000) {
    let self = this;
    self._timer1 && clearTimeout(self._timer1);
    self._init();
    self._show();
    
    self._toast.find('.mkf-content').html(content);
   
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
