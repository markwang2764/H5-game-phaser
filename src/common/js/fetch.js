import axios from 'axios';
import { parseUrlParams } from './utils';

let { sourceToken, sessionKey, sourceUserId } = parseUrlParams();
export default (fetch = function(opts) {
  return new Promise(function(resolve, reject) {
    opts.params = opts.params || {};
    Object.assign(opts.params, {
      sourceToken,
      sessionKey,
      sourceUserId
    });
    axios(opts)
      .then(function(res) {
        res = res.data;
        if (res.success) {
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch(function(err) {
        reject(err);
      });
  });
});
