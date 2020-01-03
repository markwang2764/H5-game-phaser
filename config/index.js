/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-02
 * @des
 */
const path = require('path');
const testDomain = '//yun.dui88.com/';
const prodDomain = '//yun.tuisnake.com/';
const cdnDir = 'h5-mami/webgame/';

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    // Various Dev Server settings
    // host: '172.16.71.47', // can be overwritten by process.env.HOST
    host: '127.0.0.1', // can be overwritten by process.env.HOST

    port: 4000, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined

    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    // devtool: '#source-map',

    autoOpenBrowser: false,
    cssSourceMap: true,
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    // axios默认为127.0.0.1:80
    // axios-config.js中设置为当前node服务器所用端口一致
    // axiosBaseUrl: 'http://localhost:3000',
    // 接口代理
    proxy: {
      // 转发接口主机名
      protocol: 'http://',
      // 转发接口主机名
      hostName: '172.16.35.211',
      port: 17801,
      // hostName: '192.168.2.218',
      // port: 7798,
      // 是否使用代理接口数据 , false则使用mock数据
      // open: false
        open: true
    }
  },
  
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: process.env.NODE_ENV === 'production' ? `${prodDomain + cdnDir}` : `${testDomain + cdnDir}`,
    // assetsPublicPath: '',
    cdnDir: cdnDir,
    /**
     * Source Maps
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    uglifyConfig: {
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: false
      }
    }
  }
};
