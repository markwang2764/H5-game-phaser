/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-21
 * @des
 */


let locationEl = document.getElementById('location');
let queryEL = document.getElementById('query')
let stateEl = document.getElementById('pushState');
let count = 0 ;

setInterval(()=>{
    locationEl.innerHTML = location.href;
}, 1000);

function changeHistory(){
    history.pushState({author: 'awu'},'newPage', '?akakka=1');
}
function changeQuery(){
    location.search = 'count=' + count;
    count++;
}

queryEL.onclick= ()=>{
    changeQuery();
}

stateEl.onclick= ()=>{
    changeHistory();
}

window.onpopstate = function() {
    let state = history.state;
    alert(state)
}



