var CK = CK || {};

(function () {
	var DataManager = function () {
		this.userDict = {};
		this.self = null;
		this.selfId = null;
		this.robot = false;
		this.tenter = (CK.getQueryValue('tenter') === 'SOW');
		// this.version = CK.gameVersion;
		CK.data = this;

	}

	var p = DataManager.prototype;

	p.addUser = function (user) {

		var id = user.id || user.usk || user.uskA || user.userId;
		if(id === null || id === undefined) {
			console.warn('the id of user to be added to usersystem can not be null or undefined!');
			return false;
		}
        if(!!this.userDict[id]) {
            console.warn("data of user: %s has already existed.", user.id.substr(0, 5));
            return false;
        }
        var model = new User({});
        model.id = id || "super_lite";
        model.name = user.nickName || user.name || "小鱼无双";
        model.sex = user.sex || 0;
        model.avator = user.headUrl || user.headImg;
		model.rivalId = user.rivalId || '';
		this.userDict[model.id] = model;
        // this._users.set(model.id, model);
        if(id === this.selfId && !this.self) {
            this.self = model;
        }
        return true;
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

