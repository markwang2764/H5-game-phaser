/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-03
 * @des
 */
import './index.less';
import {getUrlParameter, httpGetPromise, embedClick, embedExposure} from "@js/utils";

class GameGuide {
  constructor(container = '.game-guide-container') {
    this.container = $(container);
    this.data = null;
    this.init();
  }

  init() {
    httpGetPromise(
      {
        url: '/common/getGameGuideInfo',
        data: {
          usk: CFG.sessionKey,
          gameId: getUrlParameter('id'),
          pageId: getUrlParameter('pageId'),
          dsm: getUrlParameter('dsm'),
          dcm: getUrlParameter('dcm')
        }
      })
      .then(data => {
        this.data = data.data;
        this.createDom();
        this.events();
      })
      .catch(err => {
        console.error(err);
      })
  }

  events() {
    this.data.forEach((item, idx)=>{
      if (idx === 0) {
        embedExposure(item.embed.img_guide_first_exposure);
      } else {
        embedExposure(item.embed.img_guide_second_exposure);
      }
    });

    $('.other-games-item').on('click', (evt) => {
      let n = $(evt.target).index();
      let block = this.data[n];
      if (n === 0 ) {
        embedClick(block.embed.img_guide_first_click);
      } else {
        embedClick(block.embed.img_guide_second_click);
      }
      setTimeout(()=>{
        window.location = block.url;
      }, 120);
    });
  }

  createDom() {
    let list = ``;
    this.data && this.data.forEach(item => {
      list += `<img class="other-games-item" src="${item.image}">`;
    });

    let dom =
      `<div class="other-games-list">
          ${list}
      </div>`;

    this.container.html(dom);
  }
}

export default GameGuide;