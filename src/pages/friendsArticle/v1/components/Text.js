import Data from '../page/main/data'
import DownLoad from './DownLoad'
import {isWeiXin,isAndroid,getUrlParameter,embed} from './utils'
const pageIndex = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
const II = 1
const currentPage = Data[pageIndex[II-1]]
class Text {
  constructor() {
    this.$title = $('.title');
    this.$author = $('.author');
    this.$content = $('.content');
    this.$comment = $('.comment');
    this.$download = $('.download');
    this.dowlondUrl = '';
    this.shareUrl = ''
    this.contentType = 1;
  }
  render() {
    this.append(this.$title, currentPage.title)
    this.append(this.$author, currentPage.author)
    this.renderContent()
    this.renderConment()
    this.handleDowload()
    this.handleLike()
    this.$download.hide()
    let _this = this
    $.ajax({
      url: '/youtui/system/getDownloadUrl?channelString=yysc-cc-friendrb',
      type: 'get',
      dataType: 'json',
      success: function (result) {
        if (result.success) {
          _this.dowlondUrl = result.data
          alert('一')
          alert(_this.dowlondUrl)
          if (isAndroid() && !isWeiXin() && getUrlParameter('appPreview') != 1) {
            $('.small-bag').hide()
            setTimeout(() => {
              embed(10, false, (res) => {
                console.log('pengyouquan mandian chenggong')
              })
              window.location.href = _this.dowlondUrl
              $('.page').hide()
            }, 120);
          } else {
            $('.page').show()
          }
        }
      },
      error: function error() {
        console.log('获取链接失败');
      }
    });
 
   
  }
  handleDowload() {
    $(document).on('click', '.download', () => {
      if (isWeiXin()) {
        embed(9, false, (res) => {
          console.log('pengyouquan mandian chenggong')
        })
        DownLoad.show()
      } 
    })
  }
  handleLike() {
    $(document).on('click', '.nickname span', (e) => {
      let key = e.target.getAttribute('key')
      if (!this['like' + key]) {
        $(e.target).toggleClass('thumb-2')
        this['like'+key]= !this['like'+key]
        let num = ++e.target.innerHTML
        e.target.innerHTML = num
      } else {
        $(e.target).toggleClass('thumb-2')
        this['like'+key] = !this['like'+key]
        let num = --e.target.innerHTML
        e.target.innerHTML = num
      }
    })
  }
  append(wrapper, ctx) {
    wrapper.append(ctx)
  }
  renderContent() {
    currentPage.content.forEach((v, i) => {
      let img = ''
      v.img.forEach((g, j) => {
        img += `<img class="img" src="${require('../img/'+g)}"></img>`
      })
      const html = v.section + img
      this.append(this.$content, html)
    })
  }
  renderConment() {
    let html = '<div class=\'label\'>精选留言</div>'
    let list = ''
    currentPage.conment.forEach((v, i) => {
      list += `<div class="flex-box">
        <i class="portrait" style="background-image:url(${require('../img/'+v.portrait)})"></i>
        <div class="nickname-detail">
          <div class="nickname">${v.nickname}
            <span class="thumb-1" key=${i}>${v.like}</span>
          </div>  
          <div class="detail">${v.detail}</div>
        </div>
      </div>`
    })
    html = html + list
    this.append(this.$comment, html)
  }
  wxReady() {
    let _ = this;
    $.ajax({
    url: '/youtui/share/getArticleShareUrl',
    type: 'get',
    dataType: 'json',
    data: {
      id: getUrlParameter('id'),
      shareUserId: getUrlParameter('shareUserId'),
      sourceUserId: getUrlParameter('sourceUserId'),
      consumerIdOrder: getUrlParameter('consumerIdOrder'),
      sourceToken: getUrlParameter('sourceToken'),
      sessionKey: getUrlParameter('sessionKey'),
    },
    success: function success(result) {
      console.log('获取url成功')
      if (result.success) {
        const {clickUrl,desc,picUrl,title} = result.data
        let shareData = {
          title: title,
          desc: desc,
          imgUrl: picUrl,
          // 必须带上协议，否则微信无法识别
          // imgUrl: location.protocol + '//yun.tuisnake.com/h5-youtui/images/pengyouquan/' + II + '/2.jpg'
        };
        let isParmas = _.shareUrl.indexOf('?') != -1
        let friendsShareData = Object.assign({}, shareData, {
          link: isParmas ? clickUrl+ '&share_way=2' : clickUrl + '?share_way=2',
          success: () => {
            // 微信好友埋点
            embed(8, 2, (res) => {
              console.log('haoyou mandian chenggong')
            })
          }
        });
        let circleShareData = Object.assign({}, shareData, {
          link: isParmas ? clickUrl + '&share_way=1' : clickUrl + '?share_way=1',
          success: () => {
            // 微信朋友圈埋点
            embed(8, 1, (res) => {
              console.log('pengyouquan mandian chenggong')
            })
          }
        });
        // 分享给朋友
        wx.onMenuShareAppMessage(friendsShareData);
        // 分享到朋友圈
        wx.onMenuShareTimeline(circleShareData);
        wx.onMenuShareQQ(shareData);
        // wx.hideOptionMenu();/***隐藏分享菜单****/
        wx.error(function (res) {
          alert(JSON.stringify(res));
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      }
    },
    error: function error () {
      console.log('获取链接失败');
    }
  });

  }
}

export default Text;
