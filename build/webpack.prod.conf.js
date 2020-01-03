/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-02
 * @des
 */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const config = require('../config');
const baseWebpackConfig = require('./webpack.base.conf');
const utils = require('./utils');
const entry = require('../config/entry');

// TODO 先执行tinypng再打包，减少内联base64图片大小

function resolve(dir) {
  return path.join(__dirname, dir);
}

////存在replace参数且dev环境时，替换时间戳，覆盖cdn资源
const time = process.env.npm_config_replace
  ? process.env.npm_config_replace
  : (function() {
      var date = new Date();
      var Y = date.getFullYear();
      var M = date.getMonth() + 1;
      var D = date.getDate();
      var h = date.getHours();
      var m = date.getMinutes();
      function addZero(num) {
        return num > 9 ? num : '0' + num;
      }
      return [Y, addZero(M), addZero(D), addZero(h), addZero(m)].join('');
    })();

const webpackConifg = merge(baseWebpackConfig, {
  // Provides process.env.NODE_ENV with value production.
  // Enables FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin and UglifyJsPlugin.
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: resolve('../dist'),
    filename: `[name]-${time}.js`,
    // chunks文件统一放chunks文件夹下管理，避免cdn根目录下文件太乱
    chunkFilename: 'chunks/[name].[chunkhash].min.js',
    publicPath: config.build.assetsPublicPath
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: config.build.uglifyConfig
      })
    ],
    // 分割代码块
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        // default: {
        //   name: 'default',
        //   minChunks: 2,
        //   priority: -20,
        //   // chunks: 'initial',
        //   reuseExistingChunk: true,
        // },
        // // commons: {
        // //   name: 'commons',
        // //   chunks: 'initial',
        // //   minChunks: 2
        // // },
        // vendors: {
        //   name: 'vendors',
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: -10
        // }
      }
    }
    // runtimeChunk: true
  },
  plugins: [
    new webpack.BannerPlugin('create-game'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin({
      filename: utils.assetsSubDirectory(`[name]-${time}.css`),
      // Vue 项目打包后访问报错：Uncaught TypeError: Cannot read property 'call' of undefined
      // Extract from all additional chunks too (by default it extracts only from the initial chunk(s))
      // When using CommonsChunkPlugin and there are extracted chunks (from ExtractTextPlugin.extract) in the commons chunk, allChunks must be set to true
      allChunks: true
    }),
    new CleanWebpackPlugin(['dist/**', 'dist/*'], {
      root: resolve('../'),
      verbose: true,
      dry: false
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap ? { safe: true, map: { inline: false } } : { safe: true }
    })
  ].concat(utils.computeHtmlWebpackEntry(entry))
});

module.exports = webpackConifg;