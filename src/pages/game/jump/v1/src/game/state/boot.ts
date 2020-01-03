export default class Boot extends Phaser.State{
    private scaleNum:number = 1;
    private vertices:Array<number> = [];
    private body:Phaser.Physics.Box2D.Body;
    constructor() {
        super();
    }

    public preload(): void {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        document.getElementById("game").style.display = "block";
        this.scaleNum = 750 / window.innerWidth;
    }

    public create():void{
        console.log("create");
        var style = { font: "60px Arial", fill: "#ff0044", align: "center" };
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "hello phaser", style);
        text.anchor.set(0.5);

        this.game.physics.startSystem(Phaser.Physics.BOX2D);
        this.game.physics.box2d.debugDraw.joints = true;

        this.game.physics.box2d.gravity.y = 900;
        this.game.physics.box2d.restitution = 0.5;
        this.game.physics.setBoundsToWorld();

        var ground = new Phaser.Physics.Box2D.Body(this.game, null, this.game.world.centerX, this.game.world.height - 10, 0);
        ground.setRectangle(300, 20, 0, 0, 0);
        ground.angle = -10;
        // ground.bullet = true;

        this.createObj(this.game.world.centerX, this.game.world.centerY);

        this.game.input.onDown.add(this.mouseDown, this);
        // this.game.input.addMoveCallback(this.mouseMove, this);
        this.game.input.addMoveCallback(this.mouseMove, this);
        this.game.input.onUp.add(this.mouseUp, this);

        //转轴
        var crank = new Phaser.Physics.Box2D.Body(this.game, null, this.game.world.centerX, 450, 2);
        crank.setRectangle(15, 75, 0, 0, 0);
        //Revolute joint with motor enabled attaching the crank to the ground. This is where all the power for the slider crank comes from
        var revoluteJoint = this.game.physics.box2d.revoluteJoint(ground, crank, 0, -300, 0, 30, 360, 50, true);
        revoluteJoint.m_enableMotor = true;
        revoluteJoint.m_maxMotorTorque = 120;
        // window.revoluteJoint = revoluteJoint;
        Object.defineProperty(window, "revoluteJoint", {
            value: revoluteJoint
        });
        // revoluteJoint.m_motorSpeed = 300;
        
        //手臂
        var arm = new Phaser.Physics.Box2D.Body(this.game, null, this.game.world.centerX, 360, 2);
        arm.setRectangle(15, 140, 0, 0, 0);
        //revolute joint to attach the crank to the arm
        this.game.physics.box2d.revoluteJoint(crank, arm, 0, -30, 0, 60);
        
        //活塞
        var piston = new Phaser.Physics.Box2D.Body(this.game, null, this.game.world.centerX, 300, 2);
        piston.setRectangle(40, 40, 0, 0, 0);
        //revolute joint to join the arm and the piston
        this.game.physics.box2d.revoluteJoint(arm, piston, 0, -60, 0, 0);
        //prismatic joint between the piston and the ground, this joints purpose is just to restrict the piston from moving on the x axis
        this.game.physics.box2d.prismaticJoint(ground, piston, 0, -1, 0, 0, 0, 0);
        
        //  Just a dynamic box body that falls on top of the piston to make the example more interesting
        var box = new Phaser.Physics.Box2D.Body(this.game, null, this.game.world.centerX, 150, 2);
        box.setRectangle(40, 40, 0, 0, 0);

        var car = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0);
        car.setRectangle(100, 40);

        // var wheel1 = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0);
        // wheel1.setCircle(20, 0);
        // this.game.physics.box2d.revoluteJoint(car, wheel1, -40, 60, 0, 0, -720, 120, true);

        // var wheel2 = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0);
        // wheel2.setCircle(20, 0);
        // this.game.physics.box2d.revoluteJoint(car, wheel2, 90, 60, 0, 0, 0, 0);

        var frequency = 4;
        var damping = 4;
        var motorSpeed = -360;//最大角速度
        var motorTorque = 720;//扭矩力

        var wheel1 = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0);
        wheel1.setCircle(20);
        var wj1 =this.game.physics.box2d.wheelJoint(car, wheel1, -40, 60, 0, 0, 0, 1, frequency, damping, motorSpeed, motorTorque, true);

        var wheel2 = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0);
        wheel2.setCircle(20);
        var wj2 = this.game.physics.box2d.wheelJoint(car, wheel2, 40, 60, 0, 0, 0, 1, frequency, damping, motorSpeed, motorTorque, true);
        console.log(wj1);
        this.lineDemo();

        // box.setBodyContactCallback(ground, this.autoMove, this);
    }

    lineDemo(){
        this.body = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
        this.body.static = true;
        this.game.input.onDown.add(this.addPoint, this);
    }

    addPoint(pointer:Phaser.Pointer){
        this.vertices.push(pointer.x, pointer.y);
        if(this.vertices.length >= 2){
            var ft = this.body.setChain(this.vertices);
        }
    }

    createObj(x:number, y:number){
        var box = new Phaser.Physics.Box2D.Body(this.game, null, x, y, 0);
        box.velocity.y = -800;
        box.mass = 900;
        box.bullet = true;
        box.angularVelocity = -10;
        box.setCircle(30);
    }

    mouseDown(e:Phaser.Pointer, t:MouseEvent){
        // console.log(e, t);
        // this.createObj(t.clientX * this.scaleNum, t.clientY * this.scaleNum);
        this.game.physics.box2d.mouseDragStart(new Phaser.Point(t.clientX * this.scaleNum, t.clientY * this.scaleNum));
    }

    mouseMove(e:Phaser.Pointer, t:MouseEvent){
        this.game.physics.box2d.mouseDragMove(new Phaser.Point(e.clientX * this.scaleNum, e.clientY * this.scaleNum));
    }

    mouseUp(e:Phaser.Pointer, t:MouseEvent){
        this.game.physics.box2d.mouseDragEnd();
    }

    public render(){
        this.game.debug.box2dWorld();
        // for(var i = 0; i < this.vertices.length; i += 2){
        //     this.game.debug.pixel(this.vertices[i], this.vertices[i + 1], 'rgb(255, 255, 0)', 6);
        // }
    }
}