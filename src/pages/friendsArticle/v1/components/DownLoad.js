
class DownloadPop {
  show() {
    $('body').append(`
      <div class="download-pop"   @click="onClose">
        <div class="guide-pic"></div>
      </div>
    `)
    $('.download-pop').on('click', () => {
      this.hide()
    })
  }
  hide() {
    $('.download-pop').remove()
  }
}
const NewDownloadPop = new DownloadPop()
export default NewDownloadPop

