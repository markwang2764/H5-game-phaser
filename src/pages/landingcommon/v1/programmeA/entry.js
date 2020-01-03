import './entry.less';
require('@js/base.js');
$(function () {
    $('footer .button').click(function () {
       $('.mask').css({
           'display':'block'
       })
    })
    $('.mask').click(function () {
        $('.mask').css({
            'display':'none'
        })
    })
});