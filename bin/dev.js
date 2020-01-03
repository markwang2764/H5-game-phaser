/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-21
 * @des
 */
const chalk = require('chalk');
const log = console.log;
const chalkError = chalk.bold.red;
const chalkInfo = chalk.blue;
const chalkWarning = chalk.keyword('orange');

// exec 子进程输出一次性返回
// spawn 返回一个带有stdout和stderr流的对象
const {spawn, exec} = require('child_process');
let arguments = process.argv.splice(2);
const buildEntry = `npm run build:file ${arguments[0] ? arguments[0] : ''}`;

const execCmd = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, function (error, stdout, stderr) {
    // 获取命令执行的输出
    if (error) {
      reject(error);
    }
    if (stderr) {
      reject(stderr);
    }
    log(chalkWarning(`----------${cmd}-----------`));
    resolve();
  });
});


execCmd(buildEntry)
  .then(() => {
    const www = spawn('node', ['./bin/www']);

    www.stdout.on('data', (data) => {
      if (data.toString().match(/error\s{2,}/ig)) {
        log(chalkError(data));
      } else if (data.toString().match(/done\s{2,}/ig)) {
        log(chalkWarning(data));
      } else {
        log(chalkInfo(`${data}`));
      }
    });

    www.stderr.on('data', (data) => {
      log(chalkError(`stderr: ${data}`));
    });

    www.on('close', (code) => {
      log(chalk.blue(`child process exited with code ${code}`));
    });

  })
  .catch((error) => {
    log(chalkError(error));
});