// declare var require: {
//     <T>(path: string): T;
//     (paths: string[], callback: (...modules: any[]) => void): void;
//     ensure: (paths: string[],
//              callback: (require: <T>(path: string) => T) => void) => void;
// };

// require('./entry.less');

// function sayHello(person: string) {
//     return 'Hello, ' + person;
// }

// let user = 'Xcat Liu';
// console.log(sayHello(user));

// interface IShape {
//     name: string;
//     width: number;
//     height: number;
//     color?: string;
// }


// function area(shape: IShape) {
//     let area = shape.width * shape.height;
//     return "I'm a " + shape.name + " with an area of " + area + " cm squared.";
// }

// console.log(area({name: "rectangle", width: 30, height: 15}));
// console.log(area({name: "square", width: 30, height: 30, color: "blue"}));

// let shape = {
//     name: 'rectangle',
//     popup: function () {
//         console.log('This inside popup()', this.name);
//         setTimeout(() => {
//             console.log('This inside setTimeout():' + this.name);
//             console.log('i am a ' + this.name + '!!!');
//         }, 500);
//     },
//     popup2: function () {
//         console.log('This inside popup()', this.name);
//         setTimeout(function () {
//             console.log('This inside setTimeout():' + this.name);
//             console.log('i am a ' + this.name + '!!!');
//         }, 500);
//     }
// };

// shape.popup();
// shape.popup2();

// class Shape {
//     private _area: number;
//     private _color: string;
//     private _name: string;


//     public get area(): number {
//         return this._area;
//     }

//     public get color(): string {
//         return this._color;
//     }

//     public get name(): string {
//         return this._name;
//     }

//     constructor(name: string, width: number, height: number) {
//         this._area = width * height;
//         this._color = 'pink';
//     }

//     public shoutout() {
//         return "I'm " + this._color + " " + this._name + " with an area of " + this._area + " cm squared.";
//     }


// }

// let square = new Shape('square', 30, 30);

// console.log(square.shoutout());
// console.log('Area of  Shape :' + square.area);
// console.log('Name of Shape: ' + square.name);
// console.log('Color of Shape: ' + square.color);

