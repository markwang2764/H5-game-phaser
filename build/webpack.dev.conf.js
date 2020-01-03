/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-02
 * @des
 */
const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

const baseWebpackConfig = require("./webpack.base.conf");
const utils = require("./utils");
const config = require("../config");
const entry = require("../config/entry");

const host = utils.getHost();
const port = utils.getPort();

function resolve(dir) {
  return path.join(__dirname, dir);
}

Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  if (name !== 'vendor') {
    baseWebpackConfig.entry[name] = baseWebpackConfig.entry[name].concat('webpack-hot-middleware/client?reload=true');
  }
});

const devWebpackConfig = merge(baseWebpackConfig, {
  // Provides process.env.NODE_ENV with value development. Enables NamedChunksPlugin and NamedModulesPlugin.
  mode: 'development',
  output: {
    publicPath: config.dev.assetsPublicPath
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.cssSourceMap,
      usePostCSS: true,
      // extract: true
    })
  },
  devtool: config.build.devtool,

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(), // 启用此插件后，webpack 进程遇到错误代码将不会退出
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${host}:${port}`],
        notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      // should the console be cleared between each compilation?
      // default is true
      clearConsole: true
    })
    // new webpack.ProvidePlugin({
    //   _: "underscore"
    // })
  ].concat(utils.computeHtmlWebpackEntry(entry))
});

module.exports = devWebpackConfig;
