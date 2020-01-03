/**
 * 分割段落
 * @param str
 * @returns {{collapse: string, expand: (*|Array|void|string[]|p2.Island[])}}
 */


export const divideContext = {
  methods: {
    divideContext(str) {
      let pList = [];
      let collapse = '';
      if (str) {
        // 删除文末的换行符
        str = str.replace(/\n+$/, '');
        pList = str.split(/\n+/g);

        if (pList.length > 0) {
          collapse = pList.length > 1 ? pList[0].substring(0, pList[0].length - 1) + '...' : pList[0];
        }
      }

      return {
        collapse: collapse,
        expand: pList
      }
    }
  }
};

export const transformAnswer = {
  methods: {
    transformAnswer(answer) {
      let list = [];
      let overview = {};

      overview = answer[0];
      list = [answer[1], answer[2], answer[3]];

      return {
        overview: overview,
        list: list
      }
    }
  }
};
