export default [{
  'id': 1,
  'name': '公',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_male.png'
}, {
  'id': 2,
  'name': '母',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_female.png'
}, {
  'id': 3,
  'name': '火',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_fire.png'
}, {
  'id': 4,
  'name': '土',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_dust.png'
}, {
  'id': 5,
  'name': '风',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_wind.png'
}, {
  'id': 6,
  'name': '水',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_water.png'
}, {
  'id': 7,
  'name': '白羊',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_by.png'
}, {
  'id': 8,
  'name': '狮子',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_sz.png'
}, {
  'id': 9,
  'name': '射手',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_ss.png'
}, {
  'id': 10,
  'name': '金牛',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_jn.png'
}, {
  'id': 11,
  'name': '处女',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_cn.png'
}, {
  'id': 12,
  'name': '摩羯',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_mj.png'
}, {
  'id': 13,
  'name': '天秤',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_tp.png'
}, {
  'id': 14,
  'name': '水瓶',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_sp.png'
}, {
  'id': 15,
  'name': '双子',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_shz.png'
}, {
  'id': 16,
  'name': '巨蟹',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_jx.png'
}, {
  'id': 17,
  'name': '天蝎',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_tx.png'
}, {
  'id': 18,
  'name': '双鱼',
  'img': '//yun.dui88.com/h5-mami/webgame/bet/v2/x_sy.png'
}];

/*
var catConfig = [
	{
		id: 0,
		gender: 1,
		depart: null,
		parentId: null,
		name: "公"
	},
	{
		id: 1,
		gender: 2,
		depart: null,
		parentId: null,
		name: "母"
	},
	{
		id: 2,
		gender: 1,
		depart: 1,
		parentId: 0,
		name: "火"
	},
	{
		id: 3,
		gender: 1,
		depart: 2,
		parentId: 0,
		name: "土"
	},
	{
		id: 4,
		gender: 2,
		depart: 3,
		parentId: 1,
		name: "风"
	},
	{
		id: 5,
		gender: 2,
		depart: 4,
		parentId: 1,
		name: "水"
	},
	{
		id: 6,
		gender: 1,
		depart: 1,
		parentId: 2,
		name: "白羊"
	},
	{
		id: 7,
		gender: 1,
		depart: 1,
		parentId: 2,
		name: "狮子"
	},
	{
		id: 8,
		gender: 1,
		depart: 1,
		parentId: 2,
		name: "射手"
	},
	{
		id: 9,
		gender: 1,
		depart: 2,
		parentId: 3,
		name: "金牛"
	},
	{
		id: 10,
		gender: 1,
		depart: 2,
		parentId: 3,
		name: "处女"
	},
	{
		id: 11,
		gender: 1,
		depart: 2,
		parentId: 3,
		name: "摩羯"
	},
	{
		id: 12,
		gender: 2,
		depart: 3,
		parentId: 4,
		name: "天秤"
	},
	{
		id: 13,
		gender: 2,
		depart: 3,
		parentId: 4,
		name: "水瓶"
	},
	{
		id: 14,
		gender: 2,
		depart: 3,
		parentId: 4,
		name: "双子"
	},
	{
		id: 15,
		gender: 2,
		depart: 4,
		parentId: 5,
		name: "巨蟹"
	},
	{
		id: 16,
		gender: 2,
		depart: 4,
		parentId: 5,
		name: "天蝎"
	},
	{
		id: 17,
		gender: 2,
		depart: 4,
		parentId: 5,
		name: "双鱼"
	},
];

var cfg = {
    0: 'Male',
    1: 'Female',
    2: 'Fire',
    3: 'Dust',
    4: 'Wind',
    5: 'Water',
    6: 'By',
    7: 'Sz',
    8: 'Ss',
    9: 'Jn',
    10: 'Cn',
    11: 'Mj',
    12: 'Tp',
    13: 'Sp',
    14: 'Shz',
    15: 'Jx',
    16: 'Tx',
    17: 'Sy'
};

var list = [];
for(var i = 0; i < catConfig.length; i++){
    var obj = {};
    obj.id = catConfig[i].id + 1;
    obj.name = catConfig[i].name;
    obj.img = "//yun.dui88.com/h5-mami/webgame/bet/v2/x_" + cfg[i].toLowerCase() + ".png";
    list.push(obj);
}
console.log(JSON.stringify(list));
*/
