var CK = CK || {};

(function () {
  var str = function (tar) {
    try {
      return JSON.stringify(tar);
    } catch (e) {

    }
  };
  CK.str = str;

  var getSprite = function (name) {
    try {
      return CK.app.game.add.sprite(0, 0, name);
    } catch (e) {
      console.log(e);
    }
  };
  CK.getSprite = getSprite;

  var getGroup = function (x, y) {
    try {
      var group = CK.app.game.add.group();
      group.x = x, group.y = y;
      return group;
    } catch (e) {

    }
  };
  CK.getGroup = getGroup;

  var setAccessor = function (tar) {
    Object.defineProperties(tar, {
      x: {
        get: tar._x
      },
      y: {
        get: tar._y
      },
      width: {
        get: tar._w
      },
      height: {
        get: tar._h
      }
    });
  };
  CK.setAccessor = setAccessor;

  var getTween = function (obj) {
    try {
      return CK.app.game.add.tween(obj);
    } catch (e) {

    }
  };
  CK.getTween = getTween;

  var exetw = function (obj, opts, time, easing) {
    try {
      obj.to(opts, time, easing, true, 0, 0, false);
    } catch (e) {

    }
  };
  CK.exetw = exetw;
})();
