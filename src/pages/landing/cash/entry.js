import "./entry.less";
import toast from "@components/toast/2.0.0/index";
// require('@js/base.js');
import { getUrlParameter, isAppDownload, toDownloadUrl ,isWeiXin,isAndroid} from "@js/utils";
import ClipboardJS from 'clipboard';
import Embed from '@components/landingtest/embed.js';

class Main {
  constructor() {
    this.bonus = getUrlParameter("bonus") || 0;
    this.code = getUrlParameter("code");
    this.pageSource = getUrlParameter("pageSource");
    try {
        console.log(getUrlParameter("embed"))
        console.log(decodeURIComponent(getUrlParameter("embed")))
        this.baseEmbed = decodeURIComponent(getUrlParameter("embed"));
    } catch(e) {
        this.baseEmbed = null;
        console.error(e);
    }
    this.downloadUrl =  decodeURIComponent(getUrlParameter("url")) || '';
    this.$pageContainer = $(".page-container");
    this.$withdraw = $(".page-container .withdraw");
    this.$codeCopy = $(".page-container .code-copy");
    this.$money = $(".page-container .money");
    this.$code = $(".page-container .code");
    this.$codeInput = $(".page-container #code");

    this.$guideMain = $(".guide-main");
    this.$guideContainer = $(".guide-container");
    this.$guideMask = $(".guide-mask");
    this.embed = new Embed(this.baseEmbed);

    this.init();
  }
  init() {
    if (!isWeiXin() && !getUrlParameter('appPreview')) {
      // 当前页面在安卓的其他浏览器中并且不在趣晒app中 自动发起下载
     if (isAndroid()) {
      this.embed.singleClk(this.embed.TYPE_10, {
        loadpage_source_type: 1 // （1-落地页  2-直接蒙层）
      });
      toDownloadUrl(this.downloadUrl);
      } else {
          location.href = '/youtui/ab/getIosDownload';
      }
    } else {
      this.embed.singleClk(this.embed.TYPE_901, null, {
        page_source: this.pageSource,
        bonus: this.bonus
      })
      this.$pageContainer.show();
      this.$codeInput.val(this.code);
      console.log(this.$codeInput)
      this.$code.html(this.code);
      this.$money.html(`￥${this.bonus}`)
      this.$guideMain.html(`${this.bonus}元已入账`);
      this.events();
    }
  }

  events() {
    // this.$withdraw.on('click', e=>{
    //     this.embed.singleClk(this.embed.TYPE_902, null, {
    //       button_type: 2, // (1-点击复制按钮   2-点击复制奖励码去APP收款) 
    //       bonus: this.bonus
    //     })
    //     this.showDownloadModal();
    // })
    this.$guideMask.on("click", e => {
      this.hideDownloadModal();
    });
    this.initClipboard();
  }

  initClipboard() {
      
    let _ = this;
    console.log("init copy");
    if (ClipboardJS.isSupported()) {
      // 按钮添加复制到剪切板功能
      let clipboard = new ClipboardJS(".code-copy");
      clipboard.on('success', function (e) {
        console.log('copy success')
        _.embed.singleClk(_.embed.TYPE_902, null, {
          button_type: 1, // (1-点击复制按钮   2-点击复制奖励码去APP收款) 
          bonus: _.bonus
        })
          toast.make('复制成功');
          e.clearSelection();
          // 复制成功后隐藏对话框
          _.hideDownloadModal();
      });

      clipboard.on('error', function (e) {
          alert('当前浏览器不支持该功能，请手动复制内容');
      });

      let clipboard2 = new ClipboardJS(".withdraw");
      clipboard2.on('success', function (e) {
          console.log('copy success')
         _.withdrawClick();
          toast.make('复制成功');
          e.clearSelection();        
      });

      clipboard2.on('error', function (e) {
          _.withdrawClick();
          alert('当前浏览器不支持该功能，请手动复制内容');
      });
    } else {
      alert("当前浏览器不支持该功能，请手动复制内容");
    }
  }

  withdrawClick() {
    this.embed.singleClk(this.embed.TYPE_902, null, {
      button_type: 2, // (1-点击复制按钮   2-点击复制奖励码去APP收款) 
      bonus: this.bonus
    })
    this.showDownloadModal();
  }

  showDownloadModal() {
    console.log("show modal");
    this.$guideContainer.show();
    this.embed.singleClk(this.embed.TYPE_903, null, {
      page_source: this.pageSource,
      layer_type: 2, // layer_type(1-直接蒙层    2-落地页蒙层) 
      bonus: this.bonus
    })
  }
  hideDownloadModal() {
    console.log("hide modal");
    this.$guideContainer.hide();
  }
}
$(function() {
    const main = new Main();
});
