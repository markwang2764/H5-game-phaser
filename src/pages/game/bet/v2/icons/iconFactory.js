
import config from './iconCfg';

var Factory = function () {
  this.dict = config || {};
	
  // console.log(this.dict);
};

Factory.prototype.getCat = function (game, id, name) {
	 var icon = this.dict[id];
	 if (!icon) return null;
	 return icon.getRender(game, id, name);
};

var fact = new Factory();
export default fact;
