/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-06-09
 * @des
 */
import BetPop from './betpop';

class TimeList {
  constructor({main}) {
    this.data = null;
    this.$timeList = $('#db-content .time-list');
    this.opitionSelected = {};

    this.main = main;
    this.init();
  }

  init() {
    this.reset();
  }

  events() {
    let _ = this;
    let $viewpoints = this.$timeList.find('.quizzes-item.going').find('.viewpoint');
    $viewpoints.each(function () {
      $(this).off('click').on('click', () => {
        // $(this).siblings().removeClass('selected');
        $viewpoints.removeClass('selected');
        $(this).addClass('selected');
        _.opitionSelected = JSON.parse($(this).attr('data-opinion'));
        let guessId = $(this).parents('.quizzes-item').attr('data-guessid');
        // 比赛背景改为选中状态
        $('.quizzes-item').removeClass('selected');
        $(this).parents('.quizzes-item').addClass('selected');
        // show pop
        let betPop = new BetPop({
          guessId: guessId,
          option: _.opitionSelected,
          normalMode: CFG.normalMode,
          superMode: CFG.superMode,
          mostMode: CFG.mostMode,
          main: _.main,
          onClose: ()=>{
            $viewpoints.removeClass('selected');
            $('.quizzes-item').removeClass('selected');
          }
        });
        betPop.show();
      })
    });
  }

  reset() {
    this.$timeList.html('');
  }

  createOpinionList(opinions = []) {
    let html = '';

    if (opinions.length === 2) {
      // floatRight = `style="float: right!important;" `;
      html = `<div class="viewpoint-wrap double">`;
    } else {
      html = `<div class="viewpoint-wrap">`;
    }

    let floatRight = '';
    opinions.forEach((opinion, idx) => {
      html += `<div class="viewpoint" ${floatRight} data-opinion=${JSON.stringify(opinion)}>${opinion.optionDesc} ${opinion.odds}</div>`;
    });
    html += `</div>`;
    return html;
  }

  createQuizzesListDom(perGuesses) {
    // 竞猜列表项
    let quizzesLiDoms = '';

    perGuesses.forEach((guess, j) => {
      let optionsDom = this.createOpinionList(guess.options);
      let guessStatus = guess.guessStatus; // 开奖状态 0 押注中 1 押注截止 2 已开奖 3 押注截止开赛中

      let quizzesClass = '';
      let guessStatusText = '';
      let eventStatusText = '';
      let eventStatusClass = '';
      switch (guessStatus) {
        case 0:
          quizzesClass = 'going';
          guessStatusText = '可竞猜';
          eventStatusText = guess.startGameTime;
          eventStatusClass = 'show-time';

          break;
        case 1:
          // 押注截止未开赛
          quizzesClass = 'stop';
          guessStatusText = '停止竞猜';
          eventStatusText = guess.startGameTime;
          eventStatusClass = 'show-time';

          break;

        case 2:
          quizzesClass = 'end';
          guessStatusText = '竞猜结束';
          if (guess.homeScore === null || guess.visitingScore === null) {
            eventStatusText = '';
          } else {
            eventStatusText = `${guess.homeScore} : ${guess.visitingScore}`;
          }
          break;

        case 3:
          quizzesClass = 'stop';
          guessStatusText = '停止竞猜';
          eventStatusText = '已开始';
          eventStatusClass = 'started';
          break;

      }
      quizzesLiDoms +=
        `<li class="quizzes-item ${quizzesClass}" data-guessid="${guess.id}">
                    <div class="host-team">
                        <div class="team-name">${guess.homeTeamName}</div>
                        <img class="team-logo" src="${guess.homeTeamLogoUrl}">
                    </div>
                    <div class="guest-team">
                        <div class="team-name">${guess.visitingTeamName}</div>
                        <img class="team-logo" src="${guess.visitingTeamLogoUrl}">
                    </div>
                    ${optionsDom}
                    <div class="events-result-wrap">
                        <div class="title">${guess.hotTitle}</div>
                        <div class="events-status ${eventStatusClass}">${eventStatusText}</div>
                        <div class="quizzes-status">${guessStatusText}</div>
                    </div>
                </li>`;
    });

    return quizzesLiDoms;
  }

  createDom(data) {
    let html = '';

    // 如果是对象转数组
    if (!(data instanceof Array)) {
      let tmp = data;
      data = [];
      data.push(tmp);
    }
    console.log(data)
    data.forEach((item, i) => {
      let quizzesLiDoms = '';
      let perGuesses = item.perGuesses;
      if (perGuesses.length > 0) {
        quizzesLiDoms = this.createQuizzesListDom(perGuesses);
      }

      // 时间项
      let timeLiDom =
        `<li class="time-item">
            <div class="time-title">
                <div class="time-date">${item.day} ${item.dayDesc}</div>
            </div>
            <ul class="quizzes-list">${quizzesLiDoms}</ul>
          </li>`;

      html += timeLiDom;
    });
    return html;
  }

  addAfter(data) {
    let dom = this.createDom(data);
    this.$timeList.append(dom);
    this.events();
  }

  addBefore(data) {
    let dom = this.createDom(data);
    let current = this.$timeList.html();
    this.$timeList.html(dom).append(current);
    this.events();
  }

}


export default TimeList;