/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-02
 * @des
 */
const path = require("path");
const utils = require("./utils");
const entry = require("../config/entry");
const config = require("../config");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

function replaceBackSlash(str) {
  let n = str.split('\\').length - 1;
  for (let i = 0; i < n; i++) {
    str = str.replace('\\', '/');
  }
  return str;
}

function getAssetFileName(file, originName) {
  let curPath = resolve('../src/pages');
  let relative = file.replace(curPath, '');
  relative = replaceBackSlash(relative);
  let lastIndex = relative.lastIndexOf('/');
  let rpath = relative.substring(0, lastIndex + 1); // 加最后/
  return utils.assetsSubDirectory(rpath, originName);
}


const createLintingRule = () => ({
  test: /\.(js)$/,
  loader: "eslint-loader",
  enforce: "pre",
  include: [resolve("../src")],
  options: {
    formatter: require("eslint-friendly-formatter"),
    emitWarning: config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  entry: utils.computeEntry(entry),
  output: {
    path: config.build.assetsRoot,
    filename: "[name].js",
    chunkFilename: "[id].bundle.js",
    // 在对应的dev.conf和prod.conf中配置
    // publicPath: process.env.NODE_ENV === 'production'
    //   ? config.build.assetsPublicPath
    //   : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", '.vue'],
    alias: {
      '@': resolve('../src'),
      '@css': resolve('../src/common/css'),
      '@fonts': resolve('../src/common/fonts'),
      '@images': resolve('../src/common/images'),
      '@js': resolve('../src/common/js'),
      '@lib': resolve('../src/common/lib'),
      '@layout': resolve('../src/common/layout'),
      '@pages': resolve('../src/pages'),
      '@components': resolve('../src/components'),
      '@common': resolve('../src/common'),
      // You are using the runtime-only build of Vue where the template compiler is not available
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.(ts)$/,
        use: {
          loader: "ts-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: {
          loader: 'file-loader',
          options: {
            limit: 2048,
            name(file) {
              return getAssetFileName(file, '[name]_[hash:7].[ext]');
            },
            outputPath: utils.assetsSubDirectory('')
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 2048,
            name(file) {
              return getAssetFileName(file, '[name]_[hash:7].[ext]');
            },
            outputPath: utils.assetsSubDirectory('')
          }
        }
      },
      {
        test: /\.(htm|html)$/,
        use: 'html-withimg-loader?min=false'
      }
    ]
  },
  plugins: [
    new ManifestPlugin(),
    // make sure to include the plugin for the magic
    new VueLoaderPlugin()
    // new CopyWebpackPlugin([{
    //   from: resolve('../src/pages'),
    //   to: '[0]-[1]-[2].[hash].[ext]',
    //   test: /(.+)\.js$/,
    //   toType: 'template'
    // }])
  ]
};
