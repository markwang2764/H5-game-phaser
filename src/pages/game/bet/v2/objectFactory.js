// import Coin from './coin';

var Factory = {};

Factory.create = function (game, id, key) {
  if (!key) {
    console.warn('对象类型为空');
    return null;
  }
  var obj;
  switch (key) {
    case 'coin':
      obj = game.make.sprite(0, 0, 'coin');
      obj.anchor.set(0.5);
      break;
    case 'group':
      obj = game.make.group();
      break;
    case 'tween':
      obj = game.add.tween({});
      break;
  }
  obj['__fa_id'] = id;
  obj['__fa_type'] = key;
  return obj;
};

export default Factory;
