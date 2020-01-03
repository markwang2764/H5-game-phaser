/**
 * @note    打包组件成一个js，不分离css和其他js资源
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-02
 * @des
 */
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')
const utils = require('./utils')
const entry = require('../config/entry')


function resolve(dir) {
  return path.join(__dirname, dir)
}

const time = (function(){
  var date = new Date();
  var Y = date.getFullYear();
  var M = date.getMonth() + 1;
  var D = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  function addZero(num){
    return num > 9 ? num : '0' + num;
  }
  return [Y, addZero(M), addZero(D), addZero(h), addZero(m)].join('');
})();

const webpackConifg = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: false,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap? config.build.devtool : false,
  output:  {
    path: resolve('../dist'),
    filename: `[name]-${time}.js`,
    publicPath: config.build.assetsPublicPath
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: config.build.uglifyConfig
      })
    ]
  },
  plugins: [
    new webpack.BannerPlugin('create-game'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CleanWebpackPlugin(
      [
        'dist/**',
        'dist/*'
      ], {
      root: resolve('../'),
      verbose: true,
      dry: false
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),

  ].concat(utils.computeHtmlWebpackEntry(entry))

})

module.exports = webpackConifg