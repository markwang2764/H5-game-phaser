var NetManager = function () {
	var gameId = GAME.tool.getParamUrl("id") || CFG.gameId;
	var pageId = GAME.tool.getParamUrl('pageId');
	var baseurl = ("ws:" + CFG.pgHost + "/" + CFG.domain + "/" + gameId + "/" + (CFG.uskA || CFG.sessionKey));
	this.socket = new WebSocket(baseurl + (pageId ? ('?pageId=' + pageId) : ''));
	this.socket.onopen = this.onopen.bind(this);
	this.socket.onmessage = this.onmessage.bind(this);
	this.socket.onclose = this.onclose.bind(this);
	this.socket.onerror = this.onerror.bind(this);
	this.msgQue = [];
	this.timer = 0;
	this.connected = false;
}

var p = NetManager.prototype;

p.update = function (dlt) {
	if(!this.msgQue.length) return;
	var msg = this.msgQue.shift();
	this.handle(msg);
}

p.onopen = function (evt) {
	console.log("ws connected.");
	this.connected = true;
}

p.onmessage = function (evt) {
	try{
		var data = JSON.parse(evt.data);
		console.log(data);
		GAME.event.emit({type: GAME.EventType.INTER, id: data.a}, data.b);
	} catch (e) {
		console.log(e);
	}
	
}

p.onclose = function(evt) {
	console.log("closed.");
	if(CFG.debug) {
		return;
	}
	if("socket" in CFG && !CFG.socket) {
		return;
	}
	window.location.reload();
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

/**
 * 向服务器发送消息
 * @param {number} proto 网络接口协议编码
 * @param {object} data 发送的数据
 */
p.send = function (proto, data) {
	if(!data) data = '';
	this.msgQue.push({
		a: proto,
		b: data
	})
}

window.GAME = window.GAME || {};
GAME.net = new NetManager();

export default NetManager;