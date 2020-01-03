/**
 * @note    打包bundle中entry.js引入的组件
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-21
 * @des     公用的js打包文件放在dui88下便于修改，暂不自动上传资源
 */
const exec = require('child_process').exec;
const chalk = require('chalk');
const webpack = require('webpack');
let arguments = process.argv.splice(2);

let cmd = `npm run build:file ${arguments[0] ? arguments[0] : ''}`;

const execCmd = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, function (error, stdout, stderr) {
    // 获取命令执行的输出
    if (error) {
      reject(error);
    }
    resolve();
  });
});


execCmd(cmd).then(() => {
  // webpack require的时候才会读取文件
  // 入口文件构建结束后，再引入配置文件，保证entry最新
  const webpackConfig = require('../build/webpack.pack.conf');

  webpack(webpackConfig, function (err, stats) {
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');
    console.log(chalk.cyan('  Build complete.\n'));
  });
}).catch((error) => {
  console.error(error);
});