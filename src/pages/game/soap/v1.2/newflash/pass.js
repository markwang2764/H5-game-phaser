(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// stage content:
(lib.pass = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{});

	// clounds
	this.instance = new lib.clounds("synched",0);
	this.instance.setTransform(-245.3,166.3,1,1,0,0,180,309.5,360);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(3).to({startPosition:0,_off:false},0).to({x:179.2,y:346.5},5).wait(6).to({startPosition:0},0).to({x:-317.3,y:194.3},5).wait(51));

	// clounds
	this.instance_1 = new lib.clounds("synched",0);
	this.instance_1.setTransform(1053.3,-92.4,1,1,0,0,0,309.5,360);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({startPosition:0,_off:false},0).to({x:440.5,y:184.2},5).wait(7).to({startPosition:0},0).to({x:1061.3,y:-92.3},5).wait(52));

	// clounds
	this.instance_2 = new lib.clounds("synched",0);
	this.instance_2.setTransform(-302.2,-115,1,1,0,0,180,309.5,360);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({x:294.4,y:184.2},5).wait(12).to({startPosition:0},0).to({x:-302.1,y:-114.9},5).wait(48));

	// clounds
	this.instance_3 = new lib.clounds("synched",0);
	this.instance_3.setTransform(-230.9,965.3,1,1,0,0,180,309.5,360);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(3).to({startPosition:0,_off:false},0).to({x:277.5,y:1101.6},5).wait(7).to({startPosition:0},0).to({x:-320.8,y:961.3},5).wait(50));

	// clounds
	this.instance_4 = new lib.clounds("synched",0);
	this.instance_4.setTransform(-267,568.8,1,1,0,0,180,309.5,360);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({x:269.5,y:789.2},5).wait(11).to({startPosition:0},0).to({x:-320.9,y:568.8},5).wait(49));

	// clounds
	/* Layers with classic tweens must contain only a single symbol instance. */

	// clounds
	this.instance_5 = new lib.clounds("synched",0);
	this.instance_5.setTransform(1173.5,977.5,1,1,0,0,0,309.5,360);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).to({x:448.6,y:1105.7},5).wait(12).to({startPosition:0},0).to({x:1173.5,y:977.5},5).wait(48));

	// clounds
	this.instance_6 = new lib.clounds("synched",0);
	this.instance_6.setTransform(1149.4,524.8,1,1,0,0,0,309.5,360);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(2).to({startPosition:0,_off:false},0).to({x:452.5,y:733.2},5).wait(8).to({startPosition:0},0).to({x:1149.4,y:524.8},5).wait(50));

	// clounds
	this.instance_7 = new lib.clounds("synched",0);
	this.instance_7.setTransform(1093.3,201.3,1,1,0,0,0,309.5,360);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({x:440.5,y:404.3},5).wait(9).to({startPosition:0},0).to({x:1093.3,y:201.3},5).wait(51));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,0,0);


// symbols:
(lib.cloudbg = function() {
	this.initialize(img.cloudbg);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,619,720);


(lib.levelcolor = function() {
	this.initialize(img.levelcolor);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,540,237);


(lib.clounds = function() {
	this.initialize();

	// 图层 1
	this.instance = new lib.cloudbg();

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,619,720);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;