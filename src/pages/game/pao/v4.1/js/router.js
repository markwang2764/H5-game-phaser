/*
function Router(){
    this.url = "";
    this.routes = {};
    this.route = function(path, callback){
        this.routes[path] = callback || function(){};
    };
    this.refresh = function(){
        this.url = location.hash.slice(1) || "/";
        this.routes[this.url]();
    };
    this.init = function(){
        window.addEventListener("hashchange", this.refresh.bind(this));
        this.refresh();
    };
}

export default Router;
*/