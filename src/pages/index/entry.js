/**
 * @note
 * @author  miaokefu <alfred>
 * @create  2018-04-03
 * @des
 */
import './entry.less';
import $ from '@js/base';

import {httpGet} from '@js/utils';
import Tree from './components/tree';
/**
 * @param {String}  errorMessage   错误信息
 * @param {String}  scriptURI      出错的文件
 * @param {Long}    lineNumber     出错代码的行号
 * @param {Long}    columnNumber   出错代码的列号
 * @param {Object}  errorObj       错误的详细信息，Anything
 */
window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
  console.log(`catch error${errorMessage}--on:line${lineNumber},column${columnNumber}`);
};

/**
 * 构建树父子结构的数组
 * @param {*} data 
 */
const buildPidData = (data)=>{
  let result = [];
  const rootPath = 'src/pages/';

  data.forEach((entry, i)=>{
    // 删除字符串尾部的/
    let path = entry.path.replace(/\/$/, '');
    let frags = path.split('/');

    frags.forEach((frag, j)=>{
      let obj = {};
      // 将当前文件的路径作为id
      let pid =  frags.slice(0, j).join('/') ;
      obj.id = pid + (pid === ''  ? '' : '/') +  frag;
      obj.name = frag; 
      obj.pid = pid;
      obj.deep = j; // 层级深度
      if (j === frags.length - 1) {
        // type 1 文件
        obj.type = 1;
        obj.title = entry.title;
        obj.href = `../${entry.template.split(rootPath)[1]}`;
      }else {
        // type 0 文件夹
        obj.type = 0
      }
      let isExist = false;
      for (let item of result) {
        if (item.id === obj.id) {
          isExist = true;
        }
      }
      // 去重
      if (!isExist) {
        result.push(obj);
      }
    });
  });

  return result;

}

class FileTree {
  constructor (container) {
    this.$container = $(container)
    this.init();
  }

  init () {
    this.getDirData();
  }

  createTreeDom (data) {
    if (!data || data.length === 0) {
      return '';
    }
   
    let deep  = parseInt(data[0].deep); 
    let html = `<ul style='text-indent: ${deep * 2}em'>`
    data.forEach((item, index)=>{
      html += `<li data-id='${item.id}' data-deep='${item.deep}' data-pid='${item.pid}'
       data-href='${item.href}' data-type='${item.type}'>${item.type == 1 ? item.name + '-' + item.title: item.name}`;
      html += this.createTreeDom(item.children);
      html +=`</li>`;
    });
    html += `</ul>`;
    return html;
  }

  initTreeEvents(){
    this.$container.find('li').each(function(){
      $(this).on('click', function(e){
        e.stopPropagation();
        let type = parseInt($(this).data('type'));
        if (type === 1){
          location.href = $(this).data('href');
        } else {
          console.log(this)
          $(this).children('ul').toggle();
        }
      })
      
    });
  }
  initTree (data) {
    let dom = this.createTreeDom(data)
    this.$container.html(dom);
    this.initTreeEvents();
  }

  getDirData () {
    httpGet({
      url: '/api/entry',
      data: {},
      success: (data) => {
        const path = 'src/pages/';
        data = data || [];
        let pidData = buildPidData(data);
        var treeData = new Tree(pidData).init('');
        this.initTree(treeData);
      }
    });
  }
}

new FileTree('#container');



