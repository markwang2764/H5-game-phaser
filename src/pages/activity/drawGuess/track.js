import { parseUrlParams, isObjectEmpty, deleteInvalidKey } from '@js/utils';
import fetch from '@js/fetch';
import axios from 'axios';

var params = {};

let urlParams = parseUrlParams();
delete urlParams.type;
let { sourceToken, sessionKey, sourceUserId, id, consumerIdOrder, appPreview, share_way } = urlParams;
fetch({
  url: '/youtui/paintAndGuess/getEmbed',
  params: {
    sourceToken,
    sessionKey,
    sourceUserId,
    ...deleteInvalidKey({ id, appPreview, consumerIdOrder, share_way })
  }
}).then(res => {
  params = JSON.parse(res.st_info_1_click);
  delete params.type;
});
const track = function(type, data) {
  if (isObjectEmpty(params)) {
    setTimeout(function() {
      track(type, data);
    }, 300);
    return;
  }
  let p = Object.assign({}, params, data);

  //type=1 特殊处理
  if (type == 1) {
    p = Object.assign({}, urlParams, p);
  }

  // 埋点接口返回为空，不能用fetch
  axios({
    url: '/youtui/log/youtuiEmbedLog',
    params: {
      type,
      ...p
    }
  });
};
export default track;
