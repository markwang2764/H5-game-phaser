import fact from './objectFactory';

var Pool = function () {
  /** 金币对象池 */ 
  this.objMap = {
    'coin': [],
    'group': [],
    'tween': []
  };
  /** 金币对象序号 */
  this._index = 0;
};

Pool.prototype.getObj = function (game, key) {
  var objList = this.objMap[key];
  if (!!objList && !!objList.length) {
    return objList.pop();
  } else {
    return fact.create(game, this._index++, key);
  }
};

Pool.prototype.recycle = function (obj) {
  // console.log('recycle: %s, id: %s', obj['__fa_type'], obj['__fa_id']);
  var type = obj['__fa_type'];
  if (!type) {
    console.warn('无法回收未知类型对象');
    return;
  }
  if (type === 'tween') {
    obj.target = {};
  }
  if (type === 'coin') {
    obj['__tw'] = null;
    // [obj.x, obj.y] = obj['_origin_pos'];
  }
  var objList = this.objMap[type];
  var repeat = objList.filter(function (val, idx, arr) {
    return val['__fa_id'] === obj['__fa_id'];
  });
  if (!!repeat && !!repeat.length) {
    console.warn('待回收对象: %s 已存在：%s', obj['__fa_type'], obj['__fa_id']);
  } else {
    objList.push(obj);
  }
};

export default new Pool();
