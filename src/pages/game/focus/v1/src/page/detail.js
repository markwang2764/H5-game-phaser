import './dropload';

var page = 0;
var size = 10;


function Detail(){
    
}

function time(t) {
    var date = new Date();
    var Y = date.getFullYear();
    var M = date.getMonth() + 1;
    var D = date.getDate();      
    function addZero(num) {
      return num > 9 ? num : '0' + num;
    }
  
    return [Y, addZero(M), addZero(D)].join("-");
}

Detail.prototype = {
    init: function(){
        $('.detail-content').dropload({
            scrollArea : $(".detail-content"),
            domUp : {
                domClass   : 'dropload-up',
                domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
                domUpdate  : '<div class="dropload-update">↑释放更新</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
            },
            domDown : {
                domClass   : 'dropload-down',
                domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData  : '<div class="dropload-noData">已经是最后一页了</div>'
            },
            loadUpFn : function(me){
                console.log("loadUpFn");
                GAME.tool.hpGet("/youtui/extreme/balanceDetail", {
                    gameId: CFG.gameId,
                    sourceToken: CFG.sourceToken,
                    sessionKey: CFG.sessionKey,
                    pageSize: 20,
                    rowStart: 0
                }, (data)=>{
                    var result = '';
                    for(var i = 0; i < data.list.length; i++){
                        result +=   `<div class="detail-item">
                        <div class="item-top">${data.list[i].bonusType == 2 ? "游戏奖励" : "翻倍奖励"}</div>
                        <div class="item-bottom">${time()}</div>
                        <div class="item-num">+ ${data.list[i].bonusGet}元</div>
                        </div>`;
                    }
                    // 为了测试，延迟1秒加载
                    setTimeout(function(){
                        $('.lists').html(result);
                        // 每次数据加载完，必须重置
                        me.resetload();
                        // 重置页数，重新获取loadDownFn的数据
                        page = 0;
                        // 解锁loadDownFn里锁定的情况
                        me.unlock();
                        me.noData(false);
                    }, 300);
                });

                /*
                $.ajax({
                    type: 'GET',
                    url: 'json/update.json',
                    data: param,
                    dataType: 'json',
                    success: function(data){
                        var result = '';
                        for(var i = 0; i < data.lists.length; i++){
                            result +=  `<div class="detail-item">
                            <div class="item-top">游戏奖励</div>
                            <div class="item-bottom">2018-03-30</div>
                            <div class="item-num">+ 0.20元</div>
                            </div>`;
                        }
                        // 为了测试，延迟1秒加载
                        setTimeout(function(){
                            $('.lists').html(result);
                            // 每次数据加载完，必须重置
                            me.resetload();
                            // 重置页数，重新获取loadDownFn的数据
                            page = 0;
                            // 解锁loadDownFn里锁定的情况
                            me.unlock();
                            me.noData(false);
                        },1000);
                    },
                    error: function(xhr, type){
                        // alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
                */
            },
            loadDownFn : function(me){
                console.log("loadDownFn");
                GAME.tool.hpGet("/youtui/extreme/balanceDetail", {
                    gameId: CFG.gameId,
                    sourceToken: CFG.sourceToken,
                    sessionKey: CFG.sessionKey,
                    pageSize: 20,
                    rowStart: page * 20
                }, (data)=>{
                    page++;
                    var result = '';
                    for(var i = 0; i < data.list.length; i++){
                        result +=   `<div class="detail-item">
                        <div class="item-top">${data.list[i].bonusType == 2 ? "游戏奖励" : "翻倍奖励"}</div>
                        <div class="item-bottom">${time()}</div>
                        <div class="item-num">+ ${data.list[i].bonusGet}元</div>
                        </div>`;
                    }
                    // 如果没有数据
                    
                    // 锁定
                    // me.lock();
                    // 无数据
                    // me.noData();
                    
                    // 为了测试，延迟1秒加载
                    setTimeout(function(){
                        // 插入数据到页面，放到最后面
                        $('.detail-list').append(result);
                        // 每次数据插入，必须重置
                        me.resetload();
                    }, 300);
                });
                /*
                page++;
                // 拼接HTML
                var result = '';
                $.ajax({
                    type: 'GET',
                    url: 'http://ons.me/tools/dropload/json.php?page='+page+'&size='+size,
                    data: param,
                    dataType: 'json',
                    success: function(data){
                        var arrLen = data.length;
                        if(arrLen > 0){
                            for(var i=0; i<arrLen; i++){
                                result +=   `<div class="detail-item">
                                <div class="item-top">游戏奖励</div>
                                <div class="item-bottom">2018-03-30</div>
                                <div class="item-num">+ 0.20元</div>
                                </div>`;
                            }
                        // 如果没有数据
                        }else{
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                        }
                        // 为了测试，延迟1秒加载
                        setTimeout(function(){
                            // 插入数据到页面，放到最后面
                            $('.detail-list').append(result);
                            // 每次数据插入，必须重置
                            me.resetload();
                        },1000);
                    },
                    error: function(xhr, type){
                        // alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
                */
            },
            threshold : 50
        });
    }
}

export default Detail;

