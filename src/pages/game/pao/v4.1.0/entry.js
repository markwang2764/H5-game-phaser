import "./entry.less";
import StateManager from './core/statemanager';

const statemanager = new StateManager();

var INDEX_STATE = "IndexState";
var OVER_STATE = "OverState";

$(function(){
    var list = [INDEX_STATE, OVER_STATE];
    $(".tip").html("ok");
    $(".tip").click(()=>{
        $(".tip").unbind();
        var sid = Math.floor(Math.random() * list.length); 
        statemanager.start(list[sid]);
    })
})