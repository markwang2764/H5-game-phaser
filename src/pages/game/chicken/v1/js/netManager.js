var CK = CK || {};

(function () {
  var NetManager = function () {
    var baseurl = CFG.debug ? 'ws://172.16.40.122:17800/chickenGame/' : ('ws:' + CFG.pgHost + '/chickenGame/');
    this.socket = new WebSocket(baseurl + wsData.gid + '/' + wsData.uid);
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
      if (this.timer >= 1000) {
        this.timer = 0;
        this.send(CK.NetMsgID.heartBeat, null);
      } else {
        this.timer += dlt;
      }
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
    var data = JSON.parse(evt.data);
    // if(data.type == 212) {
    // 	console.log("recieve message: ", evt.data);	
    // }
    CK.app.evtMgr.emit({type: CK.EventType.INTER, id: data.type}, data.msg);
  };

  p.onclose = function (evt) {
    console.log('closed.');
    CK.app.evtMgr.emit({type: CK.EventType.INTER, id: 'evt_netclose'}, null);
  };

  p.onerror = function (err) {
    console.log(err);
  };

  p.handle = function (data) {
    try {
      // console.log('before send message: ', data);
      this.socket.send(JSON.stringify(data));	
      // console.log('send message: ', data);
      // CK.app.evtMgr.emit({type: CK.EventType.INTER, id: data.type % 100 + 200}, {});
    } catch (e) {
      console.error(e);
    }
  };

  p.send = function (proto, data) {
    if (!data) data = '';
    this.msgQue.push({
      type: proto,
      msg: data
    });
  };

  CK.NetManager = NetManager;
})();
