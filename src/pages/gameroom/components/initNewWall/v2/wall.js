/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-25
 * @des
 */
var wallIconArr = ['', 'lucky.png', 'tell.png'];

/**
 * 替换占位符
 * @param holder 占位符
 * @param values 替换后的内容数组
 * @returns {String}
 */
String.prototype.placeHolder = function (holder, values) {
  let s = this;
  values.forEach(function (item) {
    s = s.replace(new RegExp(holder), function () {
      return item;
    });
  });
  return s;
};

function NewWall (div, idx, showWidth) {
  this.div = div;
  this.stepHeight = $(div).height(); // 默认行高
  // div.style.width = window.innerWidth + 'px';
  var container = $(div).find('.word-container')[0];
  container.style.width = showWidth + 'px';
  this.iconDiv = $(div).find('.wall-ico')[0];
  this.txtDiv = $(container).find('.wall-word')[0];
  this.showWidth = showWidth - 18;
  [this.offX, this.offY] = [0, this.stepHeight * idx];
  this.length = this.txtDiv.offsetWidth;
  this.move(this.div, 'translateY(' + this.offY + 'px)');
  this.move(this.txtDiv, 'translateX(' + this.offX + 'px)');
}

/**
 *
 * @param dlt
 * @param length wallList长度
 * @returns {boolean}
 */
NewWall.prototype.moveOff = function (dlt, length) {
  if (this.offY <= (-1 * this.stepHeight)) {
    this.offY += this.stepHeight * length;
    this.offX = 0;
    this.move(this.div, this.getMoveStr('Y'));
    this.move(this.txtDiv, this.getMoveStr('X'));
    return true;
  } else {
    this.offY += dlt;
    this.move(this.div, this.getMoveStr('Y'));
    return false;
  }
};

NewWall.prototype.getMoveStr = function (property) {
  return 'translate' + property + '(' + this['off' + property] + 'px)';
};

NewWall.prototype.slideOff = function (dlt) {
  if (this.offX + this.length <= this.showWidth) {
    return true;
  } else {
    this.offX += dlt;
    this.move(this.txtDiv, this.getMoveStr('X'));
    return false;
  }
};

/**
 * 消息展示div变更消息内容
 * @param {Object} content 消息类型和内容
 */
NewWall.prototype.changeContent = function (content) {
  this.txtDiv.innerHTML = this.customInnerHtml(content.content, content.data);
  this.length = this.txtDiv.offsetWidth;
  // this.iconDiv.style.backgroundImage = "url(//yun.tuisnake.com/h5-mami/adpages/gameroom/v1/" + wallIconArr[content.type] + ")";
};

NewWall.prototype.getMoveStr = function (property) {
  return 'translate' + property + '(' + this['off' + property] + 'px)';
};

NewWall.prototype.slideOff = function (dlt) {
  if (this.offX + this.length <= this.showWidth) {
    return true;
  } else {
    this.offX += dlt;
    this.move(this.txtDiv, this.getMoveStr('X'));
    return false;
  }
};

/**
 *
 * @param {string} str 基础消息串
 * @param {number[]} data 填充数据
 * @returns {string}
 */
NewWall.prototype.customInnerHtml = function (str, data) {
  if (!data.length) return str;
  if (str.indexOf('%s') < 0) return str;

  let dataDom = [];
  data.forEach(function (val, idx) {
    dataDom.push('<span class="tell-num">' + val + '</span>');
  });

  str = str.placeHolder('%s', dataDom);

  return str;
};
/**
 * 执行区块偏移action
 * @param {HTMLElement} div 要偏移的区块
 * @param {string} eleStr 偏移style描述标签string
 */
NewWall.prototype.move = function (div, eleStr) {
  div.style.transform = eleStr;
};

export default NewWall;
