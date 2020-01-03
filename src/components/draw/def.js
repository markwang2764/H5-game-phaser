import pako from 'pako';
function Drawing() {}

Drawing.prototype.setData = function(str) {
  var list = JSON.parse(str);
  var aim = [];
  for (var i = 0; i < list.length; i++) {
    var line = new ColorsLine();
    line.setData(list[i].type, list[i].color, list[i].size, list[i].points);
    aim.push(line);
  }
  return aim;
};

Drawing.prototype.play = function(context, list) {
  context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
  var cid = 0;
  var colorsLine;
  var timerId = setInterval(() => {
    if (!colorsLine) {
      colorsLine = list.shift();
      if (!colorsLine) {
        clearInterval(timerId);
        console.log('draw over');
        return;
      }
      colorsLine.start(context);
    }
    if (!colorsLine.draw(context)) {
      colorsLine = null;
    } else {
      colorsLine.end(context);
    }
  }, 30);
};

function ColorsLine(type, color, size) {
  this.moveTo = true;
}

ColorsLine.prototype.setData = function(type, color, size, points) {
  this.type = type;
  this.color = color;
  this.size = size;
  this.points = points ? points : [];
};

ColorsLine.prototype.end = function(context) {
  // context.restore();
  // context.closePath();
  context.stroke();
};

ColorsLine.prototype.start = function(context) {
  // context.save();
  context.beginPath();
  context.globalCompositeOperation = this.type;
  context.lineWidth = this.size;
  context.strokeStyle = this.color;
  console.log(context.globalCompositeOperation, context.strokeStyle, context.lineWidth);
};

ColorsLine.prototype.add = function(x, y) {
  this.points.push(x, y);
};

ColorsLine.prototype.draw = function(context) {
  // context.globalCompositeOperation = this.type;
  // context.lineWidth = this.size;
  // context.strokeStyle = this.color;
  if (this.points.length) {
    var x = this.points.shift();
    var y = this.points.shift();
    if (this.moveTo) {
      this.moveTo = false;
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
      context.stroke();
    }
    return true;
  } else {
    return false;
  }

  /*
    context.globalCompositeOperation = this.type;
    context.lineWidth = this.size;
    context.strokeStyle = this.color;
    context.beginPath();
    for(var i = 0; i < this.points.length; i += 2){
        if(i == 0){
            context.moveTo(this.points[i], this.points[i + 1]);
        }
        else{
            context.lineTo(this.points[i], this.points[i + 1]);
        }
        context.stroke();
    }
    */
};

function unzip(b64Data) {
  var strData = atob(b64Data);
  // Convert binary string to character-number array
  var charData = strData.split('').map(function(x) {
    return x.charCodeAt(0);
  });
  // Turn number array into byte-array
  var binData = new Uint8Array(charData);
  // // unzip
  var data = pako.inflate(binData);
  // Convert gunzipped byteArray back to ascii string:
  strData = String.fromCharCode.apply(null, new Uint16Array(data));
  return strData;
}

function zip(str) {
  var binaryString = pako.gzip(str, { to: 'string' });
  return btoa(binaryString);
}

export {
  Drawing,
  ColorsLine,
  unzip,
  zip
};
