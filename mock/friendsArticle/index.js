/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-05-16
 * @des
 */
let path = '/friendsArticle';

module.exports = {
  get: {
    '/youtui/system/getDownloadUrl': path + '/getDownloadUrl',
    '/youtui/log/articleEmbedLog': path + '/articleEmbedLog',
    '/youtui/share/getArticleShareUrl': path + '/getArticleShareUrl',
     '/youtui/article/getCDK':path+'/articleEmbedLog'
  },
  post: {}
};