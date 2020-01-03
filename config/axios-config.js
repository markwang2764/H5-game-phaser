/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-25
 * @des     全局配置axios
 */
const axios = require('axios');
const utils = require('../build/utils');
// Global axios defaults
// default: 127.0.0.1:80

axios.defaults.baseURL = `http://${utils.getHost()}:${utils.getPort()}`;

module.exports = axios;