/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2018-07-09
 * @des
 */
class Embed {
    constructor() {
        this.data = null;
    }

    init() {
        console.log('embed init');
    }

    update(newData) {
        this.data = Object.assign({}, this.data, newData);
    }
    handleClick(type, cb, params) {
        $.ajax({
            url: `/youtui/log/getContentLogs`,
            data: {
                type: type,
                content_id: getUrlParameter('id'),
                share_user_id: getUrlParameter('shareUserId'),
                consumer_id_order: getUrlParameter('consumerIdOrder'),
                share_way: shareWay || getUrlParameter('share_way'),
                source_user_id: getUrlParameter('sourceUserId'),
                sourceToken: getUrlParameter('sourceToken'),
                sessionKey: getUrlParameter('sessionKey')
            },
            type: 'get',
            dataType: 'json',
            success: function success(result) {
                cb(result)
            },
            error: function error() {
                console.log('埋点失败');
            }
        });
    }

}


export default Embed;
