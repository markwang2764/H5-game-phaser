function Phmonster(row, level, signal, id, direction) {
  this.row = row;
  this.direction = direction;
  this.id = id;
  this.signal = signal;
  this.group = phgame.add.group();
  this.sprite = new Phaser.Image(phgame, 0, 0);
  this.sprite.anchor.set(0.5, 1);
  this.missEmoji = phgame.add.sprite(0, 0, 'missemoji');
  this.missEmoji.x = -this.missEmoji.width / 2;
  this.missEmoji.y = -this.sprite.height;
  this.missEmoji.alpha = 0;
  this.missEmoji.depth = 0;
  this.missEmoji.exist = false;
  this.group.addChild(this.missEmoji);
  this.group.addChild(this.sprite);

  this.miss = phgame.add.text(0, -10, "miss", {font: "24px Arial Black", fill: "#fff"});
  this.miss.stroke = "#ec1226";
  this.miss.strokeThickness = 8;
  this.miss.anchor.x = 0.5;
  this.miss.alpha = 0;
  this.miss.x = this.sprite.width + 50;
  this.miss.y = -this.sprite.height;

  this.group.addChild(this.miss);
  this.x = Math.random() * 200;
  this.y = 300;
  this.xspeed = 3 * this.direction;
  this.yspeed = 0;
  this.timer = 0;
  this.tapes = [];
  this.shaking = false;
  this.shakeTimes = 0;
  this.visible = true;
  this.fast = false;
  this.setLevel(level);
  this.init();
}

Phmonster.prototype = {
  init: function () {
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(function (e) {
      this.hit(e);
    }, this);
  },
  hit: function (e) {
    this.shake();
    hitSignal.dispatch({
      type: "hit_monster",
      x: e.input.downPoint.x,
      y: e.input.downPoint.y,
      id: this.id,
      row: this.row
    });
  },
  reset: function (level) {
    this.show();
    this.setLevel(level);
    this.xspeed = 3 * this.direction;
    this.yspeed = 0;
    this.timer = 0;
    this.shaking = false;
    this.shakeTimes = 0;
    this.visible = true;
    this.fast = false;
    this.move();
  },
  setLevel: function (level) {
    this.level = level;
    this.sprite.loadTexture("monster" + level);
    this.width = this.sprite.width;
    this.tapes.forEach(function (item) {
      item.destroy();
    });
    this.tapes = [];
  },
  die: function () {
    this.signal.dispatch({id: this.id});
  },
  move: function () {
    if (!this.visible) {
      return;
    }
    this.x += this.xspeed;
    this.timer += 0.24;
    this.yspeed = Math.sin(this.timer);
    this.y += this.yspeed;

    if (this.direction === 1) {
      if (this.x > STAGE_WIDTH + this.sprite.width) {
        this.die();
      }
    }
    else {
      if (this.x < 0 - this.sprite.width) {
        this.die();
      }
    }

    if (this.shaking) {
      this.group.x = this.x + (0.5 - Math.random()) * 12;
      this.group.y = this.y + (0.5 - Math.random()) * 12;
      if (++this.shakeTimes > 10) {
        this.shaking = false;
      }
    }
    else {
      this.group.x = this.x;
      this.group.y = this.y;
    }
  },
  shake: function () {
    this.shaking = true;
    this.shakeTimes = 0;
    var tape = new Phaser.Image(phgame, 0, 0, "tape");
    tape.anchor.set(0.5, 0.5);
    tape.x = (0.5 - Math.random()) * this.sprite.width / 2 - 10;
    tape.y = (0 - Math.random()) * this.sprite.height / 2 - 24;
    this.group.addChild(tape);
    this.tapes.push(tape);
  },
  showMiss: function () {
    var sh = this.sprite.height;
    this.miss.alpha = 1;
    var missH = - sh - 50;
    this.miss.y = missH;
    phgame.add.tween(this.miss).to({alpha: 0, y: missH}, 600, "Linear", true);

    if (!this.missEmoji.exist) {
      this.missEmoji.exist = true;
      this.missEmoji.alpha = 0;
      this.missEmoji.y = -sh;
      phgame.add.tween(this.missEmoji).to({alpha: 1, y: (-sh - 40)}, 200, 'Linear', true).onComplete.add(function () {
        phgame.add.tween(this.missEmoji).to({alpha: 0, y: (-sh - 80)}, 200, 'Linear', true).onComplete.add(function () {
          this.missEmoji.exist = false;
        }, this);
      }, this);
    }

  },
  leave: function () {
    this.xspeed *= Math.random() * 4 + 3;
    this.fast = true;
  },
  show: function () {
    this.group.visible = true;
    this.visible = true;
  },
  hide: function () {
    this.group.visible = false;
    this.visible = false;
    this.x = -300;
    this.group.x = -300;
  },
  getPrizeAmount: function () {
    return store.monsters[this.level - 1].prizeAmount;
  }
};