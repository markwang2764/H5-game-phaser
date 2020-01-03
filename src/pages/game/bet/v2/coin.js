import pool from './objectPool';

/** 场上押注和开奖动画中的金币对象 */ 

var Coin = function (game) {
  this._skin = game.make.sprite(0, 0, 'coin');
  this._skin.anchor.set(0.5);
  // 当前活动目标信息
  this._curDests = [];
  // 当前活动主体列表，每当进入新的阶段，活动主体可能发生变化，比如skin或者skin.scale
  this._subjects = [];
  // 活动步长, 每当进入新的阶段，需要重新计算活动步长
  this._step = 0;
  // 所有活动阶段信息
  this._targets = null;
  // 当前阶段序号
  // this._index = 0;
  // 与活动目标的比较依据，目标更大，则为1，目标更小，则为-1
  this._handler = 1;

  this.sleep = true;
};

var p = Coin.prototype;

p.update = function (dlt) {
  this._subjects.forEach(function (subj, idx) {
    // 如果一个活动主体所有活动目标值都满足条件，则此主体进入睡眠状态，不再参与活动
    var info = subj['_move_info'];
    if (info['_move_over']) return;
    var to = info['_run_tar'];
    to.forEach(function (key, i) {
      if (info['_' + key + '_over']) return;
      subj[key] += info['_' + key + '_step'];
      if ((subj[key] - info['_' + key + '_tar']) * info['_' + key + '_handler'] > 0) {
        info['_' + key + '_over'] = true;
        info['_over_count'] += 1;
      }
    });
    if (info['_over_count'] >= to.length) {
      info['_move_over'] = true;
    }
  }, this);
  this.destCheck();
};

p.run = function (targets) {
  if (!targets || !targets.length) return;
  this._targets = targets;
  this.stageSwitch();
};

/** 切换活动阶段 */ 
p.stageSwitch = function () {
  this._curDests = this._targets.shift();
  if (!this._curDests) {
    pool.recycle(this);
    return;
  }
  this._curDests.forEach(function (dest, idx) {
    var subj = this.getSubject(dest.comp);
    // 为当前活动主体绑定活动目标
    if (!subj['_move_info']) {
      subj['_move_info'] = {};
    }
    var info = subj['_move_info'];
    info['_run_tar'] = [];
    info['_over_count'] = 0;
    BT.forEach(dest.to, function (val, key) {
      if (!info.hasOwnProperty(key)) {
        console.warn('活动主体不存在指定属性：%s', key);
        return;
      }
      info['_run_tar'].push(key);
      info['_' + key + '_tar'] = val;
      var dlt = val - info[key];
      if (dlt < 0) {
        info['_' + key + '_handler'] = -1; 
      } else info['_' + key + '_handler'] = 1; 
      // 计算活动步长
      var step = dlt / dest.duration * 17;
      info['_' + key + '_step'] = step;
      this._subjects.push(subj);
    }, this);
  }, this);
};

/** 运动目标到达判定 */ 
p.destCheck = function () {
  var count = 0;
  for (var i = this._subjects.length - 1; i >= 0; i--) {
    var info = subj['_move_info'];
    if (info['_move_over']) {
      count++;
    }
  }
  if (count >= this._subjects.length) {
    this.stageSwitch();
  }
};

/** 根据key获取指定的活动主体 */
p.getSubject = function (key) {
  switch (key) {
    case 'body':
      return this._skin;
    case 'scale':
      return this._skin.scale;
    default:
      console.warn('指定的活动主体key: %s 暂不支持', key);
      return null;
  }
};
