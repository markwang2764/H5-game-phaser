var CK = CK || {};

(function () {
	
	var NetManager = function () {
		var baseurl = CFG.debug ? "ws://172.16.15.242:17800/chickenGame/" : ("ws:" + CFG.pgHost + "/chickenGame/");
		console.log(baseurl + wsData.gid + "/" + wsData.uid);
		this.socket = new WebSocket(baseurl + wsData.gid + "/" + wsData.uid);
		this.socket.onopen = this.onopen.bind(this);
		this.socket.onmessage = this.onmessage.bind(this);
		this.socket.onclose = this.onclose.bind(this);
		this.socket.onerror = this.onerror.bind(this);
		this.msgQue = [];
		this.timer = 0;
		this.connected = false;
		this.delayList = [];
	}

	var p = NetManager.prototype;

	p.update = function (dlt) {
		if(!this.connected){
			return;
		}// 注意这里需要考虑这样的问题，如果连接时间超过1s，请求队列中很可能积压过多请求
		if(this.timer >= 1000) {
			this.timer = 0;
			this.send(CK.NetMsgID.heartBeat, null);
		} else {
			this.timer += dlt;
		}
		if(!this.msgQue.length) return;
		var msg = this.msgQue.shift();
		this.handle(msg);
	}

	p.onopen = function (evt) {
		console.log("connected.");
		this.connected = true;
	}

	p.onmessage = function (evt) {
		var data = JSON.parse(evt.data);
		CK.app.evtMgr.emit({type: CK.EventType.INTER, id: data.type}, data.msg);
	}

	p.onclose = function(evt) {
		console.log("closed.");
		CK.app.evtMgr.emit({type: CK.EventType.INTER, id: 'evt_netclose'}, null);
	}

	p.onerror = function (err) {
		console.log(err);
	}

	p.handle = function (data) {
		try {
			this.socket.send(JSON.stringify(data));	
		}catch(e){
			console.error(e);
		}
	}

	p.send = function (proto, data) {
		if(!data) data = '';
		this.msgQue.push({
			type: proto,
			msg: data
		});
		if(this.msgQue.length >= 10) {
			console.warn('net message queue seem to be too long!');
		}
	}

	CK.NetManager = NetManager;
})()