/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */
const exec = require('child_process').exec;
const path = require('path');
const chalk = require('chalk');
const chalkWarning = chalk.keyword('orange');
const log = console.log;
const webpack = require('webpack');
const config = require('../config');
const OssUpload = require('../build/ossupload');
let args = process.argv.splice(2);

let cmd = `npm run build:file ${args[0] ? args[0] : ''}`;

const execCmd = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, function (error, stdout, stderr) {
    // 获取命令执行的输出
    if (error) {
      reject(error);
    }
    log(chalkWarning(`----------${cmd}-----------`));
    resolve();
  });
});

execCmd(cmd).then(() => {
  // webpack require的时候才会读取文件
  // 入口文件构建结束后，再引入配置文件，保证entry最新
  // const entries = require('../config/entry');
  const webpackConfig = require('../build/webpack.prod.conf');

  webpack(webpackConfig, function (err, stats) {
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    log(chalk.cyan('  Build complete.\n'));

    // 打包具体项目时才执行自动上传，避免一次性把工程里的所有资源都同步上去了
    if (args[0]) {
      // 自动上传cdn资源
      const uploader = new OssUpload({
        dir: path.join(__dirname, '../dist/'),
        originDir: config.build.cdnDir
      });
      uploader.start();
    } else {
      log(chalkWarning(`----------打包整个工程暂不上传资源到cdn-----------`));
    }

  });
}).catch((error) => {
  console.error(error);
});