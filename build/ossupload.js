/**
 * @note    阿里云cdn上传
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-22
 * @des
 */

const fs = require('fs');

const co = require('co');
const OSS = require('ali-oss');

const chalk = require('chalk');
const ProgressBar = require('progress');
const path = require('path');
let NODE_ENV = process.env.NODE_ENV;

function replaceBackSlash(str) {
  let n = str.split('\\').length - 1;
  for (let i = 0; i < n; i++) {
    str = str.replace('\\', '/');
  }
  return str;
}

class OssUpload {
  constructor(props) {
    const defaultOptions = {
      exclude: /(\.(html|htm))|(manifest\.json)/,
      dir: undefined,
      originDir: undefined
    };
    this.options = Object.assign({}, defaultOptions, props);
    if (!this.options.dir || !this.options.originDir) {
      console.log(chalk.red('缺少参数，初始化失败'));
      return;
    }
    this.sum = 0; // 文件总数
    this.count = 0;
    this.init();
  }

  /**
   * 获取所有文件数
   */
  getFilesCount() {
    this.walk(this.options.dir, () => {
      this.sum++;
    });
  }

  start() {
    this.walk(this.options.dir, this.uploadFile.bind(this));
  }

  /**
   * 上传单个文件
   * @param fileDir
   */
  uploadFile(fileDir) {
    this.count++;
    let _this = this;
    const path = fileDir;

    let originFile;
    this.existFiles = 0;
    this.uploadFiles = 0;
    this.errorFiles = 0;

    co(function*() {
      let relativeDir = _this.getRelativePath(fileDir);
      const originPath = `${_this.options.originDir}${relativeDir}`; // cdn 路径
      try {
        originFile = yield _this.client.head(originPath);
      } catch (error) {
        originFile = error;
      }

      // console.log(chalk.red(originFile))
      // console.log(originFile)

      if (NODE_ENV === 'production') {
        if (originFile.status === 404 && originFile.code === 'NoSuchKey') {
          // status=404 , code=NoSuchKey 文件不存在
          yield _this.client.put(originPath, path);

          console.log('push file');
          _this.uploadFiles += 1;
        } else {
          _this.existFiles += 1;
        }
      } else {
        // //存在replace参数且dev环境时，覆盖cdn资源
        if ((originFile.status === 404 && originFile.code === 'NoSuchKey') || process.env.npm_config_replace) {
          yield _this.client.put(originPath, path, {
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          _this.uploadFiles += 1;
        } else {
          _this.existFiles += 1;
        }
      }
      _this.bar.tick();
    }).catch(function(err) {
      _this.errorFiles += 1;
      console.log(err);
    });
  }

  getRelativePath(fileDir) {
    let relative = path.relative(this.options.dir, fileDir);
    // 统一处理为posix平台的斜杠
    relative = replaceBackSlash(relative);

    return relative;
  }
  filterFile(fileDir) {
    fileDir = replaceBackSlash(fileDir);
    return !fileDir.match(this.options.exclude);
  }

  /**
   * 遍历文件树
   * @param dir
   * @param cb
   */
  walk(dir, cb) {
    const pages = fs.readdirSync(dir);
    pages.map(name => {
      const fileDir = path.join(dir, name);
      const stat = fs.statSync(fileDir);

      // 当前为文件结束
      if (stat.isFile()) {
        // 过滤不需要的文件
        if (this.filterFile(fileDir)) {
          cb && cb(fileDir);
        }
      } else if (stat.isDirectory()) {
        // 当前为文件夹继续遍历
        this.walk(fileDir, cb);
      }
    });
  }

  init() {
    this.getFilesCount();
    this.client = new OSS({
      region: 'oss-cn-hangzhou',
      accessKeyId: 'LTAIdGi1IOap7fkF',
      accessKeySecret: 'SKrOOp6EVtDGEV47yn0t2h97gyNioQ',
      bucket: NODE_ENV === 'production' ? 'duiba' : 'daily-duiba'
    });

    console.log(chalk.red(NODE_ENV));
    this.bar = new ProgressBar(chalk.yellow(`  文件上传中 [:bar] :current/${this.sum} :percent :elapseds`), {
      complete: '●',
      incomplete: '○',
      width: 20,
      total: this.sum,
      callback: () => {
        console.log(chalk.green('\n  All complete.'));
        console.log(
          chalk.blue(
            `\n  本次队列文件共${this.sum}个，已存在文件${this.existFiles}个，上传文件${this.uploadFiles}个，上传失败文件${this.errorFiles}个\n`
          )
        );
      }
    });

    return this;
  }
}

module.exports = OssUpload;
