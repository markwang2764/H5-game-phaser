/*
import $ from '@js/base';
import Promise from "promise-polyfill";
import Router from './js/router'
*/

/*
const getData = (url)=>{
    return new Promise((resolve, reject)=>{
        $.get(url, function(data){
            resolve(data);
        })
    })
}

getData('/hotGuess/getEmbed')
.then(data=>{
    console.log("-1--------");
    console.log(data);
    return getData('/game/startGame');
})
.then(data=>{
    console.log("-2--------");
    console.log(data);
    return getData('/soap/getResult');
})
.then(data=>{
    console.log("-3--------");
    console.log(data);
})
.catch(err=>{
    console.log(err);
})
*/

/*
let router = new Router();
router.route("/", ()=>{
    console.log("index page");
})
router.route("/start", ()=>{
    console.log("start page");
})
router.route("/over", ()=>{
    console.log("over page");
})
router.init();
*/