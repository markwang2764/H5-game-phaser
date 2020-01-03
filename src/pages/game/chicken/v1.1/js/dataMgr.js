var CK = CK || {};

(function () {
	var DataManager = function () {
		this.userDict = {};
		this.self = null;
		this.selfId = null;
		this.robot = false;
		this.tenter = (CK.getQueryValue('tenter') === 'SOW');
		CK.data = this;

	}

	var p = DataManager.prototype;

	p.addUser = function (data) {
		var user = new User(data);
		if(this.selfId === data.userId){
			this.self = user;
		}
		this.userDict[data.userId] = user;
	}

	p.getUserById = function (id) {
		return this.userDict[id];
	}

	p.getAllUsers = function () {
		var users = [];
		for(var i in this.userDict) {
			if(!this.userDict.hasOwnProperty(i)) continue;
			users.push(this.userDict[i]);
		}
		return users;
	}

	p.removeUserById = function (uid) {
		delete this.userDict[uid];
		this.self.rivalId = null;
	}

	CK.DataManager = DataManager;

	var User = function (data) {
		this.id = data.userId;
		this.name = data.nickName;
		this.sex = data.sex;
		this.score = data.score;
		this.avator = data.headUrl;
		this.rivalId = data.rivalId;
	}
})();

new CK.DataManager();

