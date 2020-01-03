import './index.less';
import { httpGetPromise, appendUrlParameter,getUrlParameter } from '@js/utils';
import ClipboardJS from 'clipboard';
import toast from '@components/toast/2.0.0/index';
import Embed from './embed';
import Promise from 'promise-polyfill';

class LandingTest {
  constructor({ baseEmbed, bonus, code ,pageSource, channel}) {
    // 区分开发环境和线上环境
    this.landingUrl = getUrlParameter('debug') == 1 ? '/landing/cash/entry.html' : '/youtui/ab/getLandView';
    this.bonus = bonus;
    this.type = 'a'; // a 落地页 b 弹层
    this.code = code;
    this.downloadUrl = '';
    this.channelBase = channel;
    this.baseEmbed = baseEmbed;
    this.pageSource = pageSource;
    this.guideContainer = null;
    this.guideMask = null;
  
    this.btnCopy = null;
    this.embed = new Embed(this.baseEmbed);
    this.clipboard = null;
    this.init();
  }
  init() {
    this.getLandingData()
      .then(()=>{
        this.getDownloadUrl(this.channelBase + this.type)
        .then((downloadUrl)=>{
          this.downloadUrl = downloadUrl;
          if (this.type === 'b') {
            this.testB();
          } else {
            this.testA();
          }
        })
      });
  }
  createDom() {
    let _pop = document.createElement('div');
    _pop.className = 'guide-container';
    _pop.innerHTML = 
    `<div class="guide-mask"></div>
      <div class="guide-main">
          <div class="content">
              ${this.bonus}元已入账
          </div>
          <div class="code-wrap">
              <span class="label">活动奖励码</span>
              <input id="code" value="${this.code}" readonly="readonly">
              <div class="code-copy" data-clipboard-target="#code">复制</div>
          </div>
          <div class="step-tips">
            <div class="step">复制奖励码</div>
            <div class="step">点击右上角选择"在浏览器打开"</div>
          </div>
      </div>`;
    document.body.appendChild(_pop);
    this.guideContainer = document.querySelector('.guide-container');
    this.guideMask = document.querySelector('.guide-mask');
    this.btnCopy = document.querySelector('.code-copy');
  }

  events() {
    new ClipboardJS('.code-copy');
    this.guideMask.onclick = (e)=>{
        this.hideDownloadModal();
    }
  }

  testA() {
    // url附带金额和邀请码
    this.landingUrl = appendUrlParameter(this.landingUrl, 'bonus', this.bonus);
    this.landingUrl = appendUrlParameter(this.landingUrl, 'code', this.code);
    this.landingUrl = appendUrlParameter(this.landingUrl, 'pageSource', this.pageSource);
    this.landingUrl = appendUrlParameter(this.landingUrl, 'embed', encodeURIComponent(this.baseEmbed));
    this.landingUrl = appendUrlParameter(this.landingUrl, 'url', encodeURIComponent(this.downloadUrl));
    window.location = this.landingUrl;
  }

  initClipboard() {
    let _ = this;
    console.log('init copy')
    // 点击元素加上cursor: pointer;属性修复ios下无法复制的bug
    if (ClipboardJS.isSupported()) {
      _.btnCopy.style.display = 'block';
      // 按钮添加复制到剪切板功能
      this.clipboard = new ClipboardJS('.code-copy');
      this.clipboard.on('success', function (e) {
        console.log('copy success')
        _.embed.singleClk(_.embed.TYPE_904, null, {
          page_source: _.pageSource,
          bonus: _.bonus
        })
        toast.make('复制成功');
        e.clearSelection();
        // 复制成功后隐藏对话框
        _.hideDownloadModal();
      });

      this.clipboard.on('error', function (e) {
          alert('当前浏览器不支持该功能，请手动复制内容');
      });
    } else{
      alert('当前浏览器不支持该功能，请手动复制内容');
    }
  }

  testB() {
    this.embed.singleClk(this.embed.TYPE_903, null, {
      page_source: this.pageSource,
      layer_type: 1, // layer_type(1-直接蒙层    2-落地页蒙层) 
      bonus: this.bonus
    })
    this.showDownloadModal();
  }

  showDownloadModal() {
    this.createDom();
    this.events();
    this.initClipboard()
  }
  hideDownloadModal() {
    console.log('hide modal')
    if (this.clipboard) {
      this.clipboard.destroy();
      this.clipboard = null;
    }
    document.body.removeChild(this.guideContainer);
  }

  getLandingData() {
    return new Promise((resolve, reject) => {
      httpGetPromise({
        url: '/youtui/ab/getLand'
      })
      .then(res => {
        let { data, code, success, desc } = res;
        this.type = data ? 'a' : 'b'; // true 显示落地页 false走弹层
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject();
      });
    });
  }

  getDownloadUrl(channel) {
    return new Promise((resolve, reject) => {
      httpGetPromise({
        url: '/youtui/system/getDownloadUrl',
        data: {
          channelString: channel
        }
      })
        .then(res => {
          let { data, code, success, desc } = res;
          if (success && data) {
            resolve(data);
          } else {
            console.error('下载地址获取错误');
            reject();
          }

        })
        .catch(err => {
          reject();
          console.error(err);
        });
      });
  }

}

export default LandingTest;