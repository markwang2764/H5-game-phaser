export default class Line extends Phaser.State{
    private scaleNum:number = 1;
    private mouseBody:Phaser.Physics.P2.Body;
    private constraint:Phaser.Physics.P2.RevoluteConstraint;

    constructor(){
        super();
    }

    public preload(): void {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        document.getElementById("game").style.display = "block";
        this.scaleNum = 750 / window.innerWidth;

        this.game.load.image('car', '/game/jump/v1/asset/images/car.png');
        this.game.load.image('wheel', '/game/jump/v1/asset/images/wheel.png');
    }

    public create():void{
        var style = { font: "60px Arial", fill: "#ff0044", align: "center" };
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "hello phaser", style);
        text.anchor.set(0.5);

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.restitution = 0.8;
        this.game.physics.p2.gravity.y = 900;

        // var carimg = this.game.add.sprite(0, 0, 'car');
        var carhight = 60;
        var wheelspace = 80;
        var wheel1img = this.game.add.sprite(wheelspace, carhight, 'wheel');
        var wheel2img = this.game.add.sprite(100, 100, 'wheel');

        this.game.physics.p2.enable([wheel1img, wheel2img], true);

        wheel1img.body.setCircle(wheel1img.width / 2);
        wheel2img.body.setCircle(wheel2img.width / 2);

        // wheel1img.body.debug = true;
        // wheel2img.body.debug = true;

        wheel1img.body.static = true;

        // this.game.physics.p2.createSpring(wheel1img, wheel2img, 0, 30, 1);
        // this.game.physics.p2.createSpring(wheel1img, wheel2img, 70, 150, 50, null, null, [wheelspace, carhight], null);
        // this.game.physics.p2.createSpring(carimg, wheel2img, 70, 150, 50, null, null, [-wheelspace, carhight], null);

        // var constraint1 = this.game.physics.p2.createPrismaticConstraint(carimg, wheel1img, false, [wheelspace, carhight], [0,0], null);
        // constraint1.upperLimit = -1;
        // constraint1.lowerLimit = -8;

        // var constraint2 = this.game.physics.p2.createPrismaticConstraint(carimg, wheel2img, false, [-wheelspace, carhight], [0,0], null);
        // constraint2.upperLimit = -1;
        // constraint2.lowerLimit = -8;

        // var car = new Phaser.Physics.P2.Body(this.game, carimg, 0, 0);
        // car.setRectangle(100, 30);

        // var wheel1 = new Phaser.Physics.P2.Body(this.game, wheel1img, 0, 0);
        // wheel1.setCircle(20);

        // var wheel2 = new Phaser.Physics.P2.Body(this.game, wheel2img, 0, 0);
        // wheel2.setCircle(20);

        this.mouseBody = new Phaser.Physics.P2.Body(this.game);
        this.game.physics.p2.addBody(this.mouseBody);

        this.game.input.onDown.add(this.mouseDown, this);
        this.game.input.addMoveCallback(this.mouseMove, this);
        this.game.input.onUp.add(this.mouseUp, this);
    }

    mouseDown(e:Phaser.Pointer, t:MouseEvent){
        // console.log(e, t);
        // this.createObj(t.clientX * this.scaleNum, t.clientY * this.scaleNum);
        // this.game.physics.p2.mouseDragStart(new Phaser.Point(t.clientX * this.scaleNum, t.clientY * this.scaleNum));
        var point = new Phaser.Point(e.clientX * this.scaleNum, e.clientY * this.scaleNum);
        var list = this.game.physics.p2.hitTest(e.position);
        if(list.length){
            var physicsPos = [this.game.physics.p2.pxmi(e.position.x), this.game.physics.p2.pxmi(e.position.y)];
            var clickBody = list[0];
            var localPoint = [0, 0];
            clickBody.toLocalFrame(localPoint, physicsPos);
            this.constraint = this.game.physics.p2.createRevoluteConstraint(
                this.mouseBody, 
                [0,0], 
                clickBody,
                [this.game.physics.p2.pxmi(localPoint[0]), this.game.physics.p2.pxmi(localPoint[1])]
            )
        }
    }

    mouseMove(e:Phaser.Pointer, t:MouseEvent){
        this.mouseBody.x = this.game.physics.p2.pxmi(e.position.x);
        this.mouseBody.y = this.game.physics.p2.pxmi(e.position.y);
    }

    mouseUp(e:Phaser.Pointer, t:MouseEvent){
        this.game.physics.p2.removeConstraint(this.constraint);
    }

    public render(){
        
    }
}