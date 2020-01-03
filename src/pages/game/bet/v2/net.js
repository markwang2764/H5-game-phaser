var NetManager = function () {
  var gameId = window.BT.getParamUrl('id');
  var pageId = window.BT.getParamUrl('pageId');
  var baseurl = CFG.debug ? 'ws://172.16.40.122:17800/bet2Game/80/' + CFG.uskA : ('ws:' + CFG.pgHost + '/bet2Game/' + gameId + '/' + CFG.uskA);
  this.socket = new WebSocket(baseurl + (pageId ? ('?pageId=' + pageId) : ''));
  this.socket.onopen = this.onopen.bind(this);
  this.socket.onmessage = this.onmessage.bind(this);
  this.socket.onclose = this.onclose.bind(this);
  this.socket.onerror = this.onerror.bind(this);
  this.msgQue = [];
  this.timer = 0;
  this.connected = false;
};

var p = NetManager.prototype;

p.update = function (dlt) {
  if (this.connected) {
    // if(this.timer >= 1000) {
    // 	this.timer = 0;
			
    // } else {
    // 	this.timer += dlt;
    // }
  }
  if (!this.msgQue.length) return;
  var msg = this.msgQue.shift();
  this.handle(msg);
};

p.onopen = function (evt) {
  console.log('ws connected.');
  this.connected = true;
};

p.onmessage = function (evt) {
  try {
    var data = JSON.parse(evt.data);
    // if(data.a == window.BT.MsgId.enterRsp) {
    // console.log("recieve message: ", evt.data);	
    // }
    window.BT.app.evtMgr.emit({type: window.BT.EventType.INTER, id: data.a}, data.b);
  } catch (e) {
    console.log(e);
  }
};

p.onclose = function (evt) {
  console.log('closed.');
  if(!getUrlParameter("debug")){
    window.location.reload();
  }
  // window.BT.app.evtMgr.emit({type: window.BT.EventType.INTER, id: 'evt_netclose'}, null);
};

p.onerror = function (err) {
  console.log(err);
};

p.handle = function (data) {
  try {
    // console.log('before send message: ', data);
    this.socket.send(JSON.stringify(data));	
    // console.log('send message: ', data);
    // window.BT.app.evtMgr.emit({type: window.BT.EventType.INTER, id: data.type % 100 + 200}, {});
  } catch (e) {
    console.error(e);
  }
};

p.send = function (proto, data) {
  if (!data) data = '';
  // console.log("send: " + proto);
  this.msgQue.push({
    a: proto,
    b: data
  });
};

export default NetManager;
