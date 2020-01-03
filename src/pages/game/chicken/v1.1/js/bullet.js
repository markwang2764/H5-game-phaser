var CK = CK || {};

(function () {
	var Bullet = function (game, parent, x, y, owner, id, uuid) {
		this.game = game;
		this.owner = owner;
		this.id = id;
		this.uuid = uuid;
		var ownerIndex = owner.index;
		this.group = CK.getGroup(x, y);
		parent.add(this.group);
		this.targetType = CK.TargetType.Bullet;
		this.rate = ([1, -1][ownerIndex]);
		this.vx = 0.6 * this.rate;
		this.targets = [];
		this.addSkin(ownerIndex);
		this.addSprite();
		this.collideTarget = null;
		this.boomcount = 0;
		this.destroycount = 0;
		this.zibaoTimer = 0;
	}

	var p = Bullet.prototype;

	/**添加子弹皮肤*/
	p.addSkin = function (ownerIndex) {
		this.skin = CK.getSprite('bullet_' + ownerIndex);
		this.skin.anchor.set(0.5, 0.5);
		this.group.add(this.skin);
		this.halfW = this.skin.width >> 1;
	}

	/**添加碰撞烟雾*/
	p.addSprite = function () {
		this.sprite = CK.getSprite('attack');
		this.sprite.visible = false;
		this.sprite.anchor.set(0.5, 0.5);
		this.sprite.x = this.skin.width / 2 * this.rate;
		this.group.add(this.sprite);
	}

	p.update = function (dlt) {
		

		// 控制子弹飞行状态
		if(!this.isPaused) {
			this.group.x += this.vx * dlt;	
			if(this.group.x <= -this.halfW || this.group.x >= this.game.width + this.halfW) {
				this.destroy();
			}
		} else {
			if(this.zibaoTimer >= 200) {
				this.destroy();
			} else {
				this.zibaoTimer += dlt;
			}
		}
		
		// 用来表示是否已经检测到碰撞，无论跟什么碰撞，都不再进行碰撞检测了
		if(this.isCollided) return false;
		var tar = this.checkCollide();
		if(!!tar) {
			this.collideTarget = tar;
			this.pause();
			return true;
		}
		return false;
	}

	/**在主循环中遍历目标列表，进行碰撞检测*/
	p.checkCollide = function () {
		var collide = null;
		for(var i = this.targets.length - 1; i >= 0; i--) {
			var tar = this.targets[i];
			// 如果一颗子弹已经被另一颗子弹选为目标，那么这颗子弹就不能再成为其他子弹的碰撞检测目标了
			if(tar.targetType === CK.TargetType.Bullet && tar.isCollided) continue;
			if(this.checkX(tar) && this.checkY(tar)) {
				collide = tar;
				break;
			}
		}
		return collide;
	}

	p.setStamp = function (time) {
		var text = this.game.make.text(0, 0, "", {font: '32px'});
		text.text = time;
    	text.anchor.set(0.5);
    	text.y = 0;
    	text.visible = true;
    	this.group.add(text);
	}

	p.checkX = function (tar) {
		var dltx = this.width / 2 + tar.width / 2;
		return dltx >= Math.abs(tar.x - this.x) + 10;
	}

	p.checkY = function (tar) {
		var dlty = this.height / 2 + tar.height / 2;
		return dlty >= Math.abs(tar.y - this.y) + 20;
	}

	p.onAdd = function (arr) {
		this.plist = arr;
	}

	/**暂停位移*/
	p.pause = function () {
		this.isPaused = true;
	}

	/**恢复位移*/
	p.resume = function () {
		
	}

	/**强制失效*/
	p.invalid = function () {
		this.isCollided = true;
		this.targets = [];
	}

	/**添加假想目标*/
	p.addTargets = function (chick) {
		this.targets.push(chick);
	}

	/**碰撞目标, 区分碰撞目标：子弹，道具，小鸡*/
	p.collide = function (tar) {
		// if(this.isCollided) return;
		this.isCollided = true;
		switch(tar.targetType) {
			case CK.TargetType.Bullet:
				if(!tar.isDel) {
					tar.onHit();	
				}
				this.boom();
				break;
		}
	}

	/**碰撞检测服务端校验失败*/
	p.onHitRefused = function () {
		this.isPaused = false;
	}

	p.onHit = function () {
		this.isCollided = true;
		this.destroy();
	}

	/**击中爆炸*/
	p.boom = function () {
		if(!!this.boomcount) {
			this.destroy();
			return;
		}
		this.boomcount += 1;
		// console.log('子弹爆炸%s次', this.boomcount);
		this.sprite.visible = true;
		this.sprite.scale.set(0.5);
		var fire = this.sprite.animations.add('fire');
		fire.onComplete.addOnce(function (sprite, anim) {
			sprite.animations.stop(null, false);
			sprite.visible = false;
			this.destroy();
		}, this);
		fire.play(20, false);
		this.group.remove(this.skin);
	}

	p.destroy = function () {
		if(!!this.destroycount) {
			return;
		}
		this.destroycount += 1;
		// console.log('子弹销毁%s次', this.destroycount);
		this.isDel = true;
		this.skin.visible = false;
		this.sprite.visible = false;
		if(!!this.skin.parent) {
			this.skin.parent.remove(this.skin);
		}
		this.group.removeAll();
		if(!!this.group.parent){
			this.group.parent.remove(this.group);
		}
	}

	p._y = function () {
		return this.group.y;
	}

	p._x = function () {
		return this.group.x;
	}

	p._w = function () {
		return this.skin.width;
	}

	p._h = function () {
		return this.skin.height;
	}

	CK.setAccessor(p);

	CK.Bullet = Bullet;

	var TargetType = {
		Bullet: 1,
		Chick: 2, 
		Item: 3
	}

	CK.TargetType = TargetType;
})()