/**
 * @note    游戏大厅3.0用
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-01
 * @des
 */
import {tostring} from '@js/utils';
import NewWall from './wall';

let registry = null;
var newWallInitialized = false;

var wallList = [];
var curNews = null;
/** 消息墙初始化标记 */
var isStarted = false;
var newsList = [];
var totalNewsNum = 0;

var isMoveOff = false;
var isSlideOff = false;
var dlt = -0.5, s_counter = 0, m_counter = 0, nextNewsIdx = 0;

/**
 * 初始化公告板
 */
function tryInitNewWall (gameroom) {
  gameroom.getAnnouncement(function (ann) {
    newWallInitialized = true;
    initRegistry(ann, gameroom);
    initNewsWall();
    setInterval(update, 30);
  });
  console.log('try to initialize new wall.');
}

function initRegistry (ann, gameroom) {
  let ann2 = [];
  ann.forEach(function (item) {
    let e = {
      announcement: item.announcement,
      values: item.values
    };
    ann2.push(e);
  });

  registry = {
    luckWall: [],
    notify: [
      {
        announcement: '当前有%s人与你在游戏厅共享欢乐时光~',
        values: [
          tostring(gameroom.totalPlayerNum)
        ]
      },
      {
        announcement: '游戏大厅倡导理性健康的游戏理念，针对通过非常规手段获取金币的行为，一经发现封号处理。',
        values: []
      }
    ]
  };
  let lw;
  let lastNotify;
  if (ann2.length > 1) {
    lw = ann2.slice(0, ann2.length - 1);
    lastNotify = ann2[ann2.length - 1]; // 最后一项为固定公告
    registry.luckWall = lw;
    registry.notify.splice(0, 0, lastNotify); // 将通知插入在第二条
  }
}

/**
 * @author zhyu
 * @version 0.01
 * 2018年04月20日16:24:04
 */
/**
 * 生成随机消息库
 * @param {number} lwNum 幸运墙消息拉取数量
 * @param {number} nNum 公告消息拉取数量
 * @returns {string[]} 按照指定数量生成的消息库
 */
function generateContent (lwNum, nNum) {
  var lw = registry.luckWall;
  var notify = registry.notify;
  var list = [];
  for (var i = 0; i < lwNum; i++) {
    var tmp = {type: 1, content: lw[i].announcement, data: lw[i].values};
    list[i] = tmp;
  }
  for (var i = 0; i < nNum; i++) {
    list.push({type: 2, content: notify[i].announcement, data: notify[i].values});
  }
  return list;
}

/**
 * 初始化消息墙
 */
function initNewsWall () {
  let lwNum = registry.luckWall.length,
    notifyNum = registry.notify.length;

  totalNewsNum = lwNum + notifyNum;
  newsList = generateContent(lwNum, notifyNum);

  // 文字显示区域的宽度
  var showWidth = $('.new-tell').width() - $('.wall-ico-box').width();
  console.log(showWidth);

  $('.new-wall').forEach(function (val, idx) {
    var wall = new NewWall(val, idx, showWidth);
    wall.changeContent(newsList[idx]);
    wallList.push(wall);
  });
  // 构造环形链表
  constructCircleList(wallList);
  curNews = wallList[0];
  isStarted = true;
}

function update () {
  if (!isStarted) return;
  if (!curNews) return;
  if (isSlideOff) {
    if (m_counter < 50) { // 向左移动到头之后，停留1.5秒再向上滚动
      m_counter++;
    } else {
      wallList.forEach(function (val, idx) {
        if (!isMoveOff) {
          if (val.moveOff(dlt, wallList.length)) isMoveOff = true;
        } else if (s_counter >= 50) { // 向上滚动到指定位置之后，停留1.5秒，重置
          s_counter = 0, m_counter = 0;
          curNews.changeContent(newsList[nextNewsIdx]);
          if (++nextNewsIdx >= totalNewsNum) nextNewsIdx = 0;
          curNews = curNews.next;
          isMoveOff = false, isSlideOff = false;
        } else {
          s_counter++;
        }
      });
    }
  } else if (curNews.slideOff(dlt)) {
    isSlideOff = true;
  }
}

function constructCircleList (list) {
  if (!(list instanceof Array)) {
    console.warn('origin list is not an instance of Array!');
    return false;
  }
  for (var i = 0, j = list.length; i < j; i++) {
    if (i !== j - 1) {
      list[i]['next'] = list[i + 1];
    } else {
      list[i]['next'] = list[0];
    }
  }
  return true;
}

export default tryInitNewWall;
