var EventManager = function () {
	/**事件处理器 */
	this.handlerDict = {};
	/**事件列表 */
	this.evtArr = [];
	/**事件提交锁定标识 */
	this.emitLock = false;
	/**事件提交锁定时间 */
	this.lockInterval = 200;
	/**事件处理器唯一标识 */
	this.index = 1;
	/**待移除监听队列 */
	this.deleteCbList = [];
	this.timer = 0;
}

var p = EventManager.prototype;

/**
 * 注册事件监听
 * @param {number|string} type 消息id
 * @param {Function} fun 回调函数
 * @param {object} thisObj 回调对象
 * @param {number} times 回调次数
 */
p.on = function(type, fun, thisObj, times) {
	if(!!fun['__e_id']) {
		return;
	}
	let arr = this.handlerDict[type];
	if(!arr) {
		arr = [];
		this.handlerDict[type] = arr;
	}

	times = !times ? 0: times;
	var idx = this.index++;
	let tmp = {
		id: idx,
		func: fun,
		obj: thisObj,
		count: 0,
		max: times,
		type: type
	}
	fun['__e_id'] = tmp.id;
	arr.push(tmp);
}


/**
 * 注册指定事件单次监听
 * @param {number|string} type 消息id
 * @param {Function} fun 回调函数
 * @param {object} thisObj 回调对象
 */
p.once = function (type, fun, thisObj) {
	this.on(type, fun, thisObj, 1);
}

/**发射事件 */
p.emit = function(msg, param) {
	if(!msg) return;
	if(msg.type === EventType.UI && !this.emitLock) {
		this.evtArr.push({eid: msg.id, par: param});
		this.emitLock = true;
	} else if(msg.type === EventType.INTER){
		this.evtArr.push({eid: msg.id, par: param});
	} else {
		console.warn('事件发射失败，必须提供事件类型：INTER / UI');
	}
}

/**
 * 移除指定事件对应的监听回调
 * @param {number | string} type 要移除监听的事件id
 * @param {Function} fun 要移除的事件回调方法
 */
p.remove = function(type, fun){
	if(!type || !fun) {
		return;
	}
	this.deleteCbList.push({
		_type: type,
		_fun: fun
	});
}

/**移除事件监听 */
p.doRemove = function(type, fun) {
	if(!type || !fun) {
		return;
	}
	let arr = this.handlerDict[type];
	if(!arr || !arr.length){
		return;
	}
	let idx = -1;
	for(let i = 0, j = arr.length; i < j; i++) {
		var idd = arr[i]["id"];
		if(fun['__e_id'] === idd) {
			idx = i;
			fun['__e_id'] = null;
			break;
		}
	}
	if(idx > -1) arr.splice(idx, 1);
}

p.update = function(dlt) {
	if(this.emitLock) {
		this.timer += dlt;
		if(this.timer >= this.lockInterval) {
			this.timer = 0;
			this.emitLock = false;
		}
	}
	let self = this;
	this.deleteCbList.forEach(function(val, idx){
		self.doRemove(val._type, val._fun);
	});
	this.deleteCbList = [];
	// 每帧只处理一个事件是有缺陷的，如果事件队列过长怎么办？
	let head = this.evtArr.shift();
	this.handle(head);
}

p.handle = function(e) {
	if(!e) return;
	let arr = this.handlerDict[e.eid];
	if(!arr) return;
	arr.forEach(function(val, idx){
		val.func.call(val.obj, e.par);
		if(val.max) {
			val.count++;
			if(val.count >= val.max){
				this.deleteCbList.push({
					_type: val.type, 
					_fun: val.func});
			}	
		}
	}, this);
}

/**
 * 发射指定消息
 * @param {EventType} type 消息类型
 * @param {number|string} id 消息id
 * @param {object} param 参数
 */
p.send = function(type, id, param){
	this.emit({type:type, id:id}, param);
}

var EventType = {
	UI: 1,
	INTER: 2
}

window.GAME = window.GAME || {};
GAME.EventType = EventType;
GAME.event = new EventManager();

export default {};