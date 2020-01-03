var catConfig = [
  {
    id: 0,
    gender: 1,
    depart: null,
    parentId: null,
    name: '公'
  },
  {
    id: 1,
    gender: 2,
    depart: null,
    parentId: null,
    name: '母'
  },
  {
    id: 2,
    gender: 1,
    depart: 1,
    parentId: 0,
    name: '火'
  },
  {
    id: 3,
    gender: 1,
    depart: 2,
    parentId: 0,
    name: '土'
  },
  {
    id: 4,
    gender: 2,
    depart: 3,
    parentId: 1,
    name: '风'
  },
  {
    id: 5,
    gender: 2,
    depart: 4,
    parentId: 1,
    name: '水'
  },
  {
    id: 6,
    gender: 1,
    depart: 1,
    parentId: 2,
    name: '白羊'
  },
  {
    id: 7,
    gender: 1,
    depart: 1,
    parentId: 2,
    name: '狮子'
  },
  {
    id: 8,
    gender: 1,
    depart: 1,
    parentId: 2,
    name: '射手'
  },
  {
    id: 9,
    gender: 1,
    depart: 2,
    parentId: 3,
    name: '金牛'
  },
  {
    id: 10,
    gender: 1,
    depart: 2,
    parentId: 3,
    name: '处女'
  },
  {
    id: 11,
    gender: 1,
    depart: 2,
    parentId: 3,
    name: '摩羯'
  },
  {
    id: 12,
    gender: 2,
    depart: 3,
    parentId: 4,
    name: '天秤'
  },
  {
    id: 13,
    gender: 2,
    depart: 3,
    parentId: 4,
    name: '水瓶'
  },
  {
    id: 14,
    gender: 2,
    depart: 3,
    parentId: 4,
    name: '双子'
  },
  {
    id: 15,
    gender: 2,
    depart: 4,
    parentId: 5,
    name: '巨蟹'
  },
  {
    id: 16,
    gender: 2,
    depart: 4,
    parentId: 5,
    name: '天蝎'
  },
  {
    id: 17,
    gender: 2,
    depart: 4,
    parentId: 5,
    name: '双鱼'
  }
];

var xings = ['火', '土', '风', '水'];
var zuos = ['huo', 'tu', 'feng', 'shui'];

export function getItemById (id) {
  id = parseInt(id);
  var item = catConfig[id + 5];
  if (!item) {
    console.warn(id);
    return;
  }
  item.sex = item.gender === 1 ? '公' : '母';
  item.xing = xings[item.depart - 1] + '象';
  item.zuo = zuos[item.depart - 1];
  return item;
}

export default catConfig;
