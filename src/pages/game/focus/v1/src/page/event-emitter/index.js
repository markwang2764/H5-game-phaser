/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-06
 * @des
 */
class EventEmitter {
  constructor () {
    this.handlers = {};
  }
  /**
   * 注册事件
   * @param {事件名词} eventName
   * @param {事件执行} callback
   */
  on (eventName, callback) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(callback);
  }
  /**
   * 触发事件
   * @param {事件名词} eventName
   */
  trigger (eventName) {
    if (this.handlers && this.handlers[arguments[0]]) {
      for (var i = 0; i < this.handlers[arguments[0]].length; i++) {
        this.handlers[eventName][i].apply(null, [].slice.call(arguments, 1));
      }
    }
  }
  /**
   * 移除事件
   * @param {事件名词} eventName
   * @param {事件} callback
   */
  remove (eventName, callback) {
    if (this.handlers[eventName] instanceof Array) {
      const handlers = this.handlers[eventName];
      for (let i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i] === callback) {
          this.handlers[eventName].splice(i, 1);
          break;
        }
      }
    }
  }
}

export default EventEmitter;
