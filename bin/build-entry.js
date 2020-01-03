/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-02
 * @des
 */
const fs = require("fs");
const path = require("path");
const tips = "// This file is auto gererated by /bin/build-entry.js";
const pagePath = 'src/pages'
const entryDir = path.join(__dirname, '..', pagePath);

// 直接忽略资源文件夹，加快遍历速度
const exclude = /(img|image)s?\//;
// 指定必须包含的入口文件
const include = /index\/entry\.js/;
let args = process
  .argv
  .splice(2);

let entryResult = [];

function filterFile(fileDir) {
  fileDir = replaceBackSlash(fileDir);

  if (fileDir.match(include)) {
    return true;
  }
  return fileDir.match(/entry\.(js|ts)/) && fileDir.indexOf(args[0] || '') > -1;
}

function replaceBackSlash(str) {
  let n = str
    .split('\\')
    .length - 1;
  for (let i = 0; i < n; i++) {
    str = str.replace('\\', '/');
  }
  return str;
}

function getFileExt(path) {
  let dotIndex = path.lastIndexOf('.');
  return path.substring(dotIndex, path.length);
}

/**
 * 递归文件夹
 * @param dir
 * @param cb
 */
function loopDir(dir, cb) {
  const pages = fs.readdirSync(dir);
  pages.map(name => {
    const fileDir = path.join(dir, name);
    const stat = fs.statSync(fileDir);

    // 当前为文件结束
    if (stat.isFile()) {
      // 过滤不需要的文件
      if (filterFile(fileDir)) {
        cb && cb(fileDir);
      }
    } else if (stat.isDirectory()) {
      // 当前为文件夹继续遍历
      if (replaceBackSlash(fileDir).match(exclude)) {
        return;
      }
      loopDir(fileDir, cb);
    }
  });
}

/**
 * 生成入口文件数组
 * @param dir
 * @returns {Array}
 */
function getEntryArray(dir) {
  loopDir(dir, (fileDir) => {
    pushFileToEntry(fileDir);
  });

  return entryResult;
}

function pushFileToEntry(fileDir) {

  let relative = path.relative(entryDir, fileDir)
  // 统一处理为posix平台的斜杠
  relative = replaceBackSlash(relative)

  let lastIndex = relative.lastIndexOf('/')
  let ext = getFileExt(relative);
  let name = 'entry'

  let rpath = relative.substring(0, lastIndex + 1) // 加最后/
  let template = pagePath + '/' + relative

  template = template.replace(/entry\.(js|ts)/, 'entry.html');
  // 获取html的title
  let regExp = /<title>(.*)<\/title>/;
  let htmlPath = path.join(__dirname, '..', template);
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  let title = '';
  let matchObj = htmlContent.match(regExp);
  if (matchObj && matchObj[1]) {
    title = matchObj[1];
  }

  entryResult.push(`  {
      path: '${rpath}',
      name: '${name}',
      template: '${template}',
      ext: '${ext}',
      title: '${title}'
  }`);
}

function buildEntry(dir) {
  
  let entryArray = getEntryArray(dir);
 console.log(entryArray);
 
  let content = `${tips}
module.exports = [
${entryArray.join(',\n')}
]`;
  
  fs.writeFileSync(path.join(__dirname, "../config/entry.js"), content);
}

buildEntry(entryDir);