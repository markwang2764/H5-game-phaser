/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-27
 * @des
 */
const OssUpload = require('../build/ossupload');
const chalk = require('chalk');
const path =require('path');
const config = require('../config/index');
const chalkWarning = chalk.keyword('orange');
const log = console.log;
let args = process.argv.splice(2);

let localDir = args[0];
if (localDir) {
  // 自动上传cdn资源
  const uploader = new OssUpload({
    dir: path.join(__dirname, '../', localDir),
    originDir: config.build.cdnDir
  });
  uploader.start();
} else {
  log(chalkWarning(`----------请输入要上传的文件夹-----------`));
}