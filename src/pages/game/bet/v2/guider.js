
var Guider = function () {
    
};

var p = Guider.prototype;

p.getState = function (app, nickName) {
  var names = localStorage.getItem(app);
  if (!names) {
    var list = [nickName];
    var str = encodeURIComponent(JSON.stringify(list));
    localStorage.setItem(app, str);
    return true;
  }

  var str = decodeURIComponent(names);
  var list = JSON.parse(str);
  if (list.indexOf(nickName) == -1) {
    list.push(nickName);
    var str = encodeURIComponent(JSON.stringify(list));
    localStorage.setItem(app, str);
    return true;
  }
  return false;
};

var guider = new Guider();
export default guider;
